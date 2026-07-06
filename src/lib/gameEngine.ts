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
  pathEvent?: { type: 'Snake' | 'Ladder'; start: number; end: number };
  movementSteps: number;
  isAmnesia?: boolean;
}

const getRandomBuff = (): PlayerEffect => {
  const buffs: BuffType[] = ['AntiSnake', 'DoubleRoll', 'StealPoint', 'Cendekiawan', 'MesinWaktu'];
  const type = buffs[Math.floor(Math.random() * buffs.length)];
  return { type, duration: -1 }; // -1 = until used/triggered
};

export const getRandomDebuff = (): PlayerEffect => {
  const debuffs: DebuffType[] = ['AbsoluteRoll', 'Silence', 'DecreasedRoll', 'AmnesiaSejarah', 'PajakKolonial', 'PhobiaTangga'];
  const type = debuffs[Math.floor(Math.random() * debuffs.length)];
  
  if (type === 'Silence') return { type, duration: -1 }; // -1 = until used
  if (type === 'AbsoluteRoll') return { type, duration: 2 }; // 1 aktif + 1 putaran akuisisi
  if (type === 'DecreasedRoll') return { type, duration: 2 }; // 1 aktif + 1 putaran akuisisi
  if (type === 'AmnesiaSejarah') return { type, duration: 2 };
  if (type === 'PajakKolonial') return { type, duration: 3 }; // 2 aktif + 1 putaran akuisisi
  if (type === 'PhobiaTangga') return { type, duration: 2 };
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
      message: `💀 ${playerToUpdate.name} terkena efek Silence! Kehilangan giliran.`,
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
    return { newState, movementSteps: 0 };
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
      message: `💀 ${playerToUpdate.name} terkena efek Batas Dadu! Lemparan ${originalDice} dibatasi maksimal 4 langkah.`,
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
      message: `💀 ${playerToUpdate.name} terkena efek Kelelahan! Dadu awal ${originalDice} dikurangi 2 menjadi ${diceValue} langkah.`,
      type: 'penalty'
    });
  }

  let isAmnesia = false;
  const amnesiaIndex = playerToUpdate.activeEffects.findIndex(e => e.type === 'AmnesiaSejarah');
  if (amnesiaIndex !== -1) {
    isAmnesia = true;
    playerToUpdate.activeEffects.splice(amnesiaIndex, 1);
    newState.logs.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      playerName: playerToUpdate.name,
      message: `💀 ${playerToUpdate.name} terkena efek Amnesia Sejarah! Kebingungan dan melangkah mundur.`,
      type: 'penalty'
    });
  }

  const pajakIndex = playerToUpdate.activeEffects.findIndex(e => e.type === 'PajakKolonial');
  if (pajakIndex !== -1) {
    playerToUpdate.score = Math.max(0, playerToUpdate.score - diceValue);
    newState.logs.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      playerName: playerToUpdate.name,
      message: `💀 ${playerToUpdate.name} terkena efek Pajak Kolonial! Kehilangan ${diceValue} poin karena melangkah.`,
      type: 'penalty'
    });
  }

  // Efek Fase Krisis
  let crisisBuffApplied = false;
  if (newState.isCrisisPhaseActive && playerToUpdate.position < 91) {
    crisisBuffApplied = true;
    newState.logs.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      playerName: playerToUpdate.name,
      message: `🔥 ${playerToUpdate.name} mendapat dorongan semangat +2 Langkah (Fase Krisis).`,
      type: 'bonus'
    });
  }

  newState.dice = {
    currentValue: diceValue,
    isRolling: false,
  };

  // 2. Calculate Movement
  const oldPosition = playerToUpdate.position;
  let movementSteps = diceValue + (crisisBuffApplied ? 2 : 0);
  if (isAmnesia) {
    movementSteps = -movementSteps; // Arah mundur
  }
  
  const movement = calculateMovement(playerToUpdate.position, movementSteps);
  playerToUpdate.position = movement.newPosition;

  // Cek apakah dipantulkan (Bouncing)
  if (movement.isBounced) {
    newState.logs.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      playerName: playerToUpdate.name,
      message: `⚠️ ${playerToUpdate.name} terpental! Gagal masuk garis akhir karena melebihi batas!`,
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
    return { newState, movementSteps };
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
    return { newState, movementSteps };
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
  let pathEvent: ProcessTurnResult['pathEvent'] = undefined;

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
            message: `🛡️ ${playerToUpdate.name} menggunakan efek AntiSnake! Berhasil menahan gigitan ular.`,
            type: 'system'
          });
          tileEvent = { type: 'Normal' };
          keepResolving = true;
        } else if (tileEvent.destination !== undefined) {
          pathEvent = { type: 'Snake', start: playerToUpdate.position, end: tileEvent.destination };
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

      case 'Ladder': {
        const phobiaIndex = playerToUpdate.activeEffects.findIndex(e => e.type === 'PhobiaTangga');
        if (phobiaIndex !== -1) {
          playerToUpdate.activeEffects.splice(phobiaIndex, 1);
          newState.logs.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            playerName: playerToUpdate.name,
            message: `💀 ${playerToUpdate.name} terkena efek Phobia Tangga! Menolak untuk naik tangga.`,
            type: 'system'
          });
          tileEvent = { type: 'Normal' };
          newState.gameStatus = 'idle';
          keepResolving = false;
          break;
        }

        if (tileEvent.destination !== undefined) {
          pathEvent = { type: 'Ladder', start: playerToUpdate.position, end: tileEvent.destination };
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

    case 'Bonus': {
      // [PATCH v1.1 - Double Roll] Proteksi Anti-Loop
      if (playerToUpdate.disableBonusForThisTurn) {
        newState.logs.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          playerName: playerToUpdate.name,
          message: `⚠️ ${playerToUpdate.name} terlalu cepat! Petak bonus tidak memicu efek di giliran ganda.`,
          type: 'system'
        });
        tileEvent = { type: 'Normal' };
        newState.gameStatus = 'idle';
        keepResolving = false;
        break;
      }

      acquiredEffect = getRandomBuff();
      
      let effectMsg = '';
      switch (acquiredEffect.type) {
        case 'AntiSnake': effectMsg = `✨ ${playerToUpdate.name} mendapatkan efek AntiSnake! Mendapat kekebalan dari ular berikutnya`; break;
        case 'DoubleRoll': 
          effectMsg = `✨ ${playerToUpdate.name} mendapatkan efek Double Roll! Mendapat ekstra giliran melempar dadu`; 
          // [PATCH v1.1 - Double Roll] Aktifkan extra turn
          playerToUpdate.hasExtraTurn = true;
          break;
        case 'StealPoint': effectMsg = `✨ ${playerToUpdate.name} mendapatkan efek StealPoint! Mencuri poin dari lawan`; break;
        case 'Cendekiawan': effectMsg = `✨ ${playerToUpdate.name} mendapatkan efek Cendekiawan! Poin kuis berikutnya akan dilipatgandakan (x2)`; break;
        case 'MesinWaktu': effectMsg = `✨ ${playerToUpdate.name} mendapatkan efek Mesin Waktu! Teleportasi 5 langkah ke depan secara instan!`; break;
      }
      
      newState.logs.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        playerName: playerToUpdate.name,
        message: effectMsg,
        type: 'bonus'
      });

      if (acquiredEffect.type === 'StealPoint') {
        // Cek Peringkat Saat Ini (Anti-Snowball)
        const sortedPlayers = [...newState.players].sort((a, b) => b.score - a.score);
        const isRankOne = sortedPlayers[0].id === playerToUpdate.id && sortedPlayers.length > 1 && sortedPlayers[0].score > sortedPlayers[1].score;

        if (isRankOne) {
          // Bonus Konsistensi (Anti-Snowball)
          playerToUpdate.score = addScore(playerToUpdate.score, 3).newScore;
          newState.logs.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            timestamp: Date.now() + 1,
            playerName: playerToUpdate.name,
            message: `✨ ${playerToUpdate.name} mendapatkan Bonus Konsistensi! Sebagai pemimpin mendapat +3 Poin dari sistem.`,
            type: 'bonus'
          });
        } else {
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
              timestamp: Date.now() + 1,
              playerName: newState.players[highestOpponentIndex].name,
              message: `⚠️ ${newState.players[highestOpponentIndex].name} kehilangan ${stolenAmount} Poin yang dicuri oleh ${playerToUpdate.name}!`,
              type: 'penalty'
            });
          }
        }
      } else if (acquiredEffect.type === 'MesinWaktu') {
        // Instant teleport +5
        const newPos = Math.min(GAME_CONSTANTS.BOARD_SIZE, playerToUpdate.position + 5);
        playerToUpdate.position = newPos;
        // Tidak memicu tile resolution dari tile yang baru (berhenti di tempat)
        newState.gameStatus = 'showing_effect';
        shouldAdvanceTurn = false;
        keepResolving = false;
        break;
      } else {
        // [EXPERIMENT: Stacking System] Cek kategori intensitas
        if (['AntiSnake', 'Cendekiawan'].includes(acquiredEffect.type)) {
          const existingIdx = playerToUpdate.activeEffects.findIndex(e => e.type === acquiredEffect.type);
          if (existingIdx !== -1) {
            // Intensitas: Refresh durasi (Batas max stack 1)
            playerToUpdate.activeEffects[existingIdx].duration = acquiredEffect.duration;
          } else {
            playerToUpdate.activeEffects.push(acquiredEffect);
          }
        } else {
          playerToUpdate.activeEffects.push(acquiredEffect);
        }
      }
      
      shouldAdvanceTurn = false;
      newState.gameStatus = 'showing_effect';
      break;
    }

    case 'Penalty': {
      acquiredEffect = getRandomDebuff();
      
      // [EXPERIMENT: Stacking System]
      const intensityDebuffs = ['AmnesiaSejarah', 'PhobiaTangga'];
      const durationDebuffs = ['AbsoluteRoll', 'DecreasedRoll', 'Silence', 'PajakKolonial'];

      const existingIdx = playerToUpdate.activeEffects.findIndex(e => e.type === acquiredEffect.type);
      
      if (existingIdx !== -1) {
        if (intensityDebuffs.includes(acquiredEffect.type as string)) {
          // Intensitas: Refresh durasi (Max stack 1)
          playerToUpdate.activeEffects[existingIdx].duration = acquiredEffect.duration;
        } else if (durationDebuffs.includes(acquiredEffect.type as string)) {
          // Durasi: Akumulasi giliran (Infinite stack)
          playerToUpdate.activeEffects[existingIdx].duration += acquiredEffect.duration;
        }
      } else {
        playerToUpdate.activeEffects.push(acquiredEffect);
      }

      shouldAdvanceTurn = false;
      newState.gameStatus = 'showing_effect';
      
      let effectMsg = '';
      switch (acquiredEffect.type) {
        case 'AbsoluteRoll': effectMsg = `💀 ${playerToUpdate.name} terkena efek Batas Kecepatan! Dadu maksimal 4 selama giliran aktif`; break;
        case 'DecreasedRoll': effectMsg = `💀 ${playerToUpdate.name} terkena efek Kelelahan! Langkah dadu dikurangi 2`; break;
        case 'Silence': effectMsg = `💀 ${playerToUpdate.name} terkena efek Silence! Kehilangan giliran berikutnya`; break;
        case 'AmnesiaSejarah': effectMsg = `💀 ${playerToUpdate.name} terkena efek Amnesia Sejarah! Akan melangkah mundur di giliran berikutnya`; break;
        case 'PajakKolonial': effectMsg = `💀 ${playerToUpdate.name} terkena efek Pajak Kolonial! Poin dikurangi berdasarkan jumlah langkah`; break;
        case 'PhobiaTangga': effectMsg = `💀 ${playerToUpdate.name} terkena efek Phobia Tangga! Tidak bisa naik tangga`; break;
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
    playerToUpdate.score = addScore(playerToUpdate.score, 100).newScore; // Grand Finish Bonus +100 Poin
    newState.players[activePlayerIndex] = playerToUpdate;
    const champion = [...newState.players].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.correctAnswers !== a.correctAnswers) return b.correctAnswers - a.correctAnswers;
      return b.position - a.position;
    })[0];
    newState.winner = champion.id;
    newState.gameStatus = 'finished';
    return { newState, tileEvent, acquiredEffect, diceModifierInfo, antiSnakeTriggered, pathEvent, movementSteps, isAmnesia };
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

  return { newState, tileEvent, acquiredEffect, diceModifierInfo, antiSnakeTriggered, pathEvent, movementSteps, isAmnesia };
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
  
  const cendekiawanIndex = playerToUpdate.activeEffects.findIndex(e => e.type === 'Cendekiawan');
  const hasCendekiawan = cendekiawanIndex !== -1;
  if (hasCendekiawan) {
    playerToUpdate.activeEffects.splice(cendekiawanIndex, 1);
  }

  if (result.isCorrect) {
    playerToUpdate.correctAnswers += 1;
    let reward = 0;
    switch (question.difficulty) {
      case 'Easy': reward = 3; break;
      case 'Medium': reward = 5; break;
      case 'Hard': reward = 10; break;
      case 'Extreme': reward = 15; break;
    }
    if (hasCendekiawan) {
      reward *= 2;
      newState.logs.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        playerName: playerToUpdate.name,
        message: `✨ ${playerToUpdate.name} menggunakan efek Cendekiawan! Poin kuis dilipatgandakan menjadi +${reward}`,
        type: 'bonus'
      });
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
    if (hasCendekiawan) {
      newState.logs.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        playerName: playerToUpdate.name,
        message: `⚠️ Efek Cendekiawan milik ${playerToUpdate.name} hangus karena salah menjawab!`,
        type: 'system'
      });
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
    // [PATCH v1.1 - Double Roll]
    // Hapus efek DoubleRoll agar tidak terus-terusan muncul di modal
    const doubleRollIndex = playerToUpdate.activeEffects.findIndex(e => e.type === 'DoubleRoll');
    if (doubleRollIndex !== -1) {
      playerToUpdate.activeEffects.splice(doubleRollIndex, 1);
      
      // Tambahkan log khusus untuk menegaskan giliran tambahan
      newState.logs.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        playerName: playerToUpdate.name,
        message: `🎲 ${playerToUpdate.name} mendapat Giliran Tambahan (Double Roll)!`,
        type: 'bonus'
      });
      
      newState.players[activePlayerIndex] = playerToUpdate;
    }
  }
  
  // Panggil tickDurationAndAdvanceTurn. advanceTurn akan mencegat perpindahan giliran karena hasExtraTurn = true.
  return tickDurationAndAdvanceTurn(newState);
};
