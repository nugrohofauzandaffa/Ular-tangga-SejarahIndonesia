import { GameState } from '../types/gameState';
import { Tile, Snake, Ladder } from '../types/board';
import { Question } from '../types/question';
import { PlayerEffect, BuffType, DebuffType } from '../types/player';
import { GAME_CONSTANTS } from '../constants/game';

import { rollDice } from './dice';
import { calculateMovement } from './movement';
import { resolveTile, TileEvent } from './tileResolver';
import { getActivePlayer, advanceTurn } from './turnManager';
import { addScore, reduceScore } from './score';
import { validateAnswer, getQuestionById } from './quiz';

export interface GameEngineContext {
  board: Tile[];
  snakes: Snake[];
  ladders: Ladder[];
  questions: Question[];
}

export interface ProcessTurnResult {
  newState: GameState;
  tileEvent?: TileEvent;
  acquiredEffect?: PlayerEffect;
  diceModifierInfo?: { type: 'DecreasedRoll' | 'AbsoluteRoll'; original: number; final: number };
  antiSnakeTriggered?: boolean;
}

const getRandomBuff = (): PlayerEffect => {
  const buffs: BuffType[] = ['AntiSnake', 'DoubleRoll', 'StealPoint'];
  const type = buffs[Math.floor(Math.random() * buffs.length)];
  return { type, duration: -1 }; // -1 = until used/triggered
};

export const getRandomDebuff = (): PlayerEffect => {
  const debuffs: DebuffType[] = ['AbsoluteRoll', 'Silence', 'DecreasedRoll'];
  const type = debuffs[Math.floor(Math.random() * debuffs.length)];
  
  if (type === 'Silence') return { type, duration: -1 }; // -1 = until used
  if (type === 'AbsoluteRoll') return { type, duration: 1 };
  if (type === 'DecreasedRoll') return { type, duration: 1 }; // 1 aktif + 1 putaran akuisisi
  return { type, duration: 2 };
};

export const processTurn = (
  state: GameState,
  context: GameEngineContext,
  diceValueOverride?: number
): ProcessTurnResult => {
  const newState = { ...state };
  newState.players = [...state.players];
  newState.logs = [...(state.logs || [])];

  const activePlayer = getActivePlayer(newState.players, newState.currentTurn);
  if (!activePlayer) {
    throw new Error('Active player not found');
  }

  const activePlayerIndex = newState.players.findIndex((p) => p.id === activePlayer.id);
  const playerToUpdate = { ...activePlayer };
  playerToUpdate.activeEffects = [...(playerToUpdate.activeEffects || [])];

  // 0.5 Check Silence (Skip Turn)
  const silenceIndex = playerToUpdate.activeEffects.findIndex(e => e.type === 'Silence');
  if (silenceIndex !== -1) {
    playerToUpdate.activeEffects.splice(silenceIndex, 1);
    newState.logs.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      playerName: playerToUpdate.name,
      message: 'Kehilangan giliran karena efek Silence',
      type: 'system'
    });
    
    // Decrement other effect durations since turn is skipped
    playerToUpdate.activeEffects = playerToUpdate.activeEffects.map(e => {
      if (e.duration > 0) return { ...e, duration: e.duration - 1 };
      return e;
    }).filter(e => e.duration !== 0);

    newState.currentTurn = advanceTurn(newState.players, newState.currentTurn);
    newState.players[activePlayerIndex] = playerToUpdate;
    newState.gameStatus = 'idle';
    newState.dice = { ...newState.dice, isRolling: false };
    return { newState };
  }

  // 1. Roll Dice
  let diceValue = diceValueOverride ?? rollDice();

  // PRE-ROLL EFFECTS
  let diceModifierInfo: ProcessTurnResult['diceModifierInfo'] = undefined;

  const absoluteRollIndex = playerToUpdate.activeEffects.findIndex(e => e.type === 'AbsoluteRoll');
  if (absoluteRollIndex !== -1 && diceValue > 4) {
    const originalDice = diceValue;
    diceValue = 4;
    diceModifierInfo = { type: 'AbsoluteRoll', original: originalDice, final: diceValue };
    newState.logs.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      playerName: playerToUpdate.name,
      message: `Efek Batas Dadu aktif! Lemparan ${originalDice} dibatasi maksimal 4 langkah.`,
      type: 'penalty'
    });
  }
  
  const decreasedRollIndex = playerToUpdate.activeEffects.findIndex(e => e.type === 'DecreasedRoll');
  if (decreasedRollIndex !== -1) {
    const originalDice = diceValue;
    diceValue = Math.max(1, diceValue - 2);
    // Hapus debuff DecreasedRoll setelah dipakai
    playerToUpdate.activeEffects.splice(decreasedRollIndex, 1);
    
    // Jika ada AbsoluteRoll sebelumnya, timpa dengan DecreasedRoll (karena terjadi di atasnya)
    diceModifierInfo = { type: 'DecreasedRoll', original: originalDice, final: diceValue };
    
    newState.logs.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      playerName: playerToUpdate.name,
      message: `Efek Kelelahan aktif! Dadu awal ${originalDice} dikurangi 2 menjadi ${diceValue} langkah.`,
      type: 'penalty'
    });
  }

  // Efek Fase Krisis
  let crisisBuffApplied = false;
  if (newState.isCrisisPhaseActive && playerToUpdate.position < 80) {
    diceValue += 2;
    crisisBuffApplied = true;
    newState.logs.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      playerName: playerToUpdate.name,
      message: 'Mendapat dorongan semangat +2 Langkah (Fase Krisis)',
      type: 'bonus'
    });
  }

  newState.dice = {
    currentValue: diceValue,
    isRolling: false,
  };

  // 2. Calculate Movement
  const oldPosition = playerToUpdate.position;
  const movement = calculateMovement(playerToUpdate.position, diceValue);
  playerToUpdate.position = movement.newPosition;

  // Cek apakah dipantulkan (Bouncing)
  if (movement.isBounced) {
    newState.logs.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      playerName: playerToUpdate.name,
      message: 'Gagal masuk garis akhir karena melebihi batas! (Terpental)',
      type: 'penalty'
    });
  }

  // 3. Check Win
  if (movement.hasReachedEnd) {
    newState.fastestExplorer = playerToUpdate.id;
    playerToUpdate.score = addScore(playerToUpdate.score, 15).newScore; // Reward +15 poin
    newState.players[activePlayerIndex] = playerToUpdate;
    const champion = [...newState.players].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.correctAnswers !== a.correctAnswers) return b.correctAnswers - a.correctAnswers;
      return b.position - a.position;
    })[0];
    newState.winner = champion.id;
    newState.gameStatus = 'finished';
    return { newState };
  }

  // Jika pemain tidak bergerak (karena melebihi petak 100), jangan memicu ulang efek petak saat ini.
  if (oldPosition === playerToUpdate.position) {
    newState.gameStatus = 'idle';
    playerToUpdate.activeEffects = playerToUpdate.activeEffects.map(e => {
      if (e.duration > 0) return { ...e, duration: e.duration - 1 };
      return e;
    }).filter(e => e.duration !== 0);
    newState.currentTurn = advanceTurn(newState.players, newState.currentTurn);
    newState.players[activePlayerIndex] = playerToUpdate;
    return { newState };
  }

  // 4. Resolve Tile
  const tile = context.board.find((t) => t.position === playerToUpdate.position);
  if (!tile) {
    throw new Error(`Tile at position ${playerToUpdate.position} not found`);
  }

  let tileEvent = resolveTile(tile, context.snakes, context.ladders);
  let acquiredEffect: PlayerEffect | undefined = undefined;
  let shouldAdvanceTurn = true;
  let antiSnakeTriggered = false;

  // 5. Handle Event
  let keepResolving = true;
  while (keepResolving) {
    keepResolving = false;

    switch (tileEvent.type) {
      case 'Normal':
        newState.gameStatus = 'idle';
        break;

      case 'Snake': {
        const antiSnakeIndex = playerToUpdate.activeEffects.findIndex(e => e.type === 'AntiSnake');
        if (antiSnakeIndex !== -1) {
          // Block snake, consume buff
          playerToUpdate.activeEffects.splice(antiSnakeIndex, 1);
          antiSnakeTriggered = true;
          newState.logs.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            playerName: playerToUpdate.name,
            message: '🛡️ Menahan gigitan ular menggunakan efek AntiSnake',
            type: 'system'
          });
          tileEvent = { type: 'Normal' };
          keepResolving = true;
        } else if (tileEvent.destination !== undefined) {
          playerToUpdate.position = tileEvent.destination;
          
          const destTile = context.board.find(t => t.position === playerToUpdate.position);
          if (destTile && destTile.type !== 'Normal' && destTile.type !== 'Snake' && destTile.type !== 'Ladder') {
             tileEvent = resolveTile(destTile, context.snakes, context.ladders);
             keepResolving = true;
          } else {
             newState.gameStatus = 'idle';
          }
        }
        break;
      }

      case 'Ladder':
        if (tileEvent.destination !== undefined) {
          playerToUpdate.position = tileEvent.destination;
          
          const destTile = context.board.find(t => t.position === playerToUpdate.position);
          if (destTile && destTile.type !== 'Normal' && destTile.type !== 'Snake' && destTile.type !== 'Ladder') {
             tileEvent = resolveTile(destTile, context.snakes, context.ladders);
             keepResolving = true;
          } else {
             newState.gameStatus = 'idle';
          }
        }
        break;

    case 'Bonus': {
      acquiredEffect = getRandomBuff();
      
      let effectMsg = '';
      switch (acquiredEffect.type) {
        case 'AntiSnake': effectMsg = 'Mendapat kekebalan dari ular berikutnya'; break;
        case 'DoubleRoll': effectMsg = 'Mendapat ekstra giliran melempar dadu'; break;
        case 'StealPoint': effectMsg = 'Mencuri 7 Poin dari lawan teratas'; break;
      }
      
      newState.logs.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        playerName: playerToUpdate.name,
        message: effectMsg,
        type: 'bonus'
      });

      if (acquiredEffect.type === 'StealPoint') {
        // Steal from highest
        let highestOpponentIndex = -1;
        let highestScore = -1;
        for (let i = 0; i < newState.players.length; i++) {
          if (newState.players[i].id !== playerToUpdate.id) {
            if (newState.players[i].score > highestScore) {
              highestScore = newState.players[i].score;
              highestOpponentIndex = i;
            }
          }
        }
        
        let stolenAmount = 0;
        if (highestOpponentIndex !== -1 && highestScore > 0) {
          stolenAmount = Math.min(7, highestScore);
          newState.players[highestOpponentIndex] = {
            ...newState.players[highestOpponentIndex],
            score: newState.players[highestOpponentIndex].score - stolenAmount
          };
        }
        
        if (stolenAmount > 0) {
          playerToUpdate.score = addScore(playerToUpdate.score, stolenAmount).newScore;
          
          // Delayed log explicitly for the victim
          newState.logs.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            timestamp: Date.now() + 1, // Add 1ms to ensure it renders after the main log
            playerName: newState.players[highestOpponentIndex].name,
            message: `⚠️ AWAS! ${stolenAmount} Poinmu dicuri oleh ${playerToUpdate.name}!`,
            type: 'penalty'
          });
        }
      } else {
        playerToUpdate.activeEffects.push(acquiredEffect);
      }
      
      shouldAdvanceTurn = false;
      newState.gameStatus = 'showing_effect';
      break;
    }

    case 'Penalty': {
      acquiredEffect = getRandomDebuff();
      playerToUpdate.activeEffects.push(acquiredEffect);
      shouldAdvanceTurn = false;
      newState.gameStatus = 'showing_effect';
      
      let effectMsg = '';
      switch (acquiredEffect.type) {
        case 'AbsoluteRoll': effectMsg = 'Lemparan dadu maksimal bernilai 4 di giliran berikutnya'; break;
        case 'Silence': effectMsg = 'Akan kehilangan 1 giliran berikutnya'; break;
        case 'DecreasedRoll': effectMsg = 'Lemparan dadu berikutnya akan dikurangi 2'; break;
      }
      
      newState.logs.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        playerName: playerToUpdate.name,
        message: effectMsg,
        type: 'penalty'
      });
      break;
    }

    case 'Quiz':
      newState.gameStatus = 'answering_quiz';
      shouldAdvanceTurn = false;
      break;
    }
  }

  // 6. Check Win (Post-Tile Resolution)
  if (playerToUpdate.position === GAME_CONSTANTS.BOARD_SIZE) {
    newState.fastestExplorer = playerToUpdate.id;
    playerToUpdate.score = addScore(playerToUpdate.score, 15).newScore; // Reward +15 poin
    newState.players[activePlayerIndex] = playerToUpdate;
    const champion = [...newState.players].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.correctAnswers !== a.correctAnswers) return b.correctAnswers - a.correctAnswers;
      return b.position - a.position;
    })[0];
    newState.winner = champion.id;
    newState.gameStatus = 'finished';
    return { newState, tileEvent, acquiredEffect, diceModifierInfo, antiSnakeTriggered };
  }

  // 7. Finalize Turn
  if (shouldAdvanceTurn) {
    playerToUpdate.activeEffects = playerToUpdate.activeEffects.map(e => {
      if (e.duration > 0) return { ...e, duration: e.duration - 1 };
      return e;
    }).filter(e => e.duration !== 0);
    newState.currentTurn = advanceTurn(newState.players, newState.currentTurn);
  }

  newState.players[activePlayerIndex] = playerToUpdate;

  // 8. Evaluasi Fase Krisis setelah pergerakan pemain selesai
  const isAnyoneEndgameNow = newState.players.some(p => p.position >= 91);
  if (isAnyoneEndgameNow && !newState.isCrisisPhaseActive) {
    newState.isCrisisPhaseActive = true;
    newState.logs.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      playerName: 'Sistem',
      message: 'Seseorang sudah memasuki zona akhir permainan.. semua player di zona bawah mendapatkan +2 langkah',
      type: 'system'
    });
  } else if (!isAnyoneEndgameNow && newState.isCrisisPhaseActive) {
    newState.isCrisisPhaseActive = false; // Jika semua pemain turun dari 91 akibat ular
  }

  return { newState, tileEvent, acquiredEffect, diceModifierInfo, antiSnakeTriggered };
};

export const submitQuizAnswer = (
  state: GameState,
  context: GameEngineContext,
  questionId: string,
  answer: string
): GameState => {
  const newState = { ...state };
  newState.players = [...state.players];

  const activePlayerIndex = newState.players.findIndex(p => p.id === newState.currentTurn);
  if (activePlayerIndex === -1) throw new Error('Active player not found');
  const playerToUpdate = { ...newState.players[activePlayerIndex] };

  const question = getQuestionById(questionId, context.questions);
  if (!question) throw new Error('Question not found');

  const result = validateAnswer(question, answer);
  if (result.isCorrect) {
    playerToUpdate.correctAnswers += 1;
    let reward = 0;
    switch (question.difficulty) {
      case 'Easy': reward = 3; break;
      case 'Medium': reward = 5; break;
      case 'Hard': reward = 10; break;
      case 'Extreme': reward = 15; break;
    }
    playerToUpdate.score = addScore(playerToUpdate.score, reward).newScore;
  } else {
    playerToUpdate.wrongAnswers += 1;
    let penalty = 0;
    switch (question.difficulty) {
      case 'Easy': penalty = 1; break;
      case 'Medium': penalty = 2; break;
      case 'Hard': penalty = 3; break;
      case 'Extreme': penalty = 5; break;
    }
    playerToUpdate.score = reduceScore(playerToUpdate.score, penalty).newScore;
  }

  newState.players[activePlayerIndex] = playerToUpdate;
  newState.gameStatus = 'showing_quiz_result';
  return newState;
};

// Utils untuk memotong durasi dan ganti giliran dari UI Acknowledge
const tickDurationAndAdvanceTurn = (state: GameState): GameState => {
  const newState = { ...state };
  newState.players = [...state.players];
  const activePlayerIndex = newState.players.findIndex(p => p.id === newState.currentTurn);
  
  if (activePlayerIndex !== -1) {
    const playerToUpdate = { ...newState.players[activePlayerIndex] };
    playerToUpdate.activeEffects = playerToUpdate.activeEffects.map(e => {
      if (e.duration > 0) return { ...e, duration: e.duration - 1 };
      return e;
    }).filter(e => e.duration !== 0);
    newState.players[activePlayerIndex] = playerToUpdate;
  }
  
  newState.currentTurn = advanceTurn(newState.players, newState.currentTurn);
  newState.gameStatus = 'idle';
  return newState;
};

export const acknowledgeQuizResult = (state: GameState): GameState => {
  return tickDurationAndAdvanceTurn(state);
};

export const acknowledgeEffect = (state: GameState): GameState => {
  const newState = { ...state };
  newState.players = [...state.players];
  const activePlayerIndex = newState.players.findIndex(p => p.id === newState.currentTurn);
  
  if (activePlayerIndex !== -1) {
    const playerToUpdate = { ...newState.players[activePlayerIndex] };
    
    // Periksa DoubleRoll (dapat jalan lagi tanpa potong durasi buff lain)
    const doubleRollIndex = playerToUpdate.activeEffects.findIndex(e => e.type === 'DoubleRoll');
    if (doubleRollIndex !== -1) {
      playerToUpdate.activeEffects.splice(doubleRollIndex, 1);
      newState.players[activePlayerIndex] = playerToUpdate;
      newState.gameStatus = 'idle';
      
      // Tambahkan log khusus untuk menegaskan giliran tambahan
      newState.logs.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        playerName: playerToUpdate.name,
        message: '🎲 Mendapat Giliran Tambahan (Double Roll)!',
        type: 'bonus'
      });
      
      return newState;
    }
  }
  
  return tickDurationAndAdvanceTurn(newState);
};
