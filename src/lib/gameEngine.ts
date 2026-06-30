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
}

const getRandomBuff = (): PlayerEffect => {
  const buffs: BuffType[] = ['AntiSnake', 'DoubleRoll', 'StealPoint'];
  const type = buffs[Math.floor(Math.random() * buffs.length)];
  return { type, duration: -1 };
};

const getRandomDebuff = (): PlayerEffect => {
  const debuffs: DebuffType[] = ['AbsoluteRoll', 'FactBanned', 'DecreasedRoll'];
  const type = debuffs[Math.floor(Math.random() * debuffs.length)];
  if (type === 'AbsoluteRoll') return { type, duration: 3 }; // 2 aktif + 1 putaran akuisisi
  if (type === 'FactBanned') return { type, duration: -1 }; // -1 = until used
  if (type === 'DecreasedRoll') return { type, duration: 2 }; // 1 aktif + 1 putaran akuisisi
  return { type, duration: 2 };
};

export const processTurn = (
  state: GameState,
  context: GameEngineContext,
  diceValueOverride?: number
): ProcessTurnResult => {
  const newState = { ...state };
  newState.players = [...state.players];

  const activePlayer = getActivePlayer(newState.players, newState.currentTurn);
  if (!activePlayer) {
    throw new Error('Active player not found');
  }

  const activePlayerIndex = newState.players.findIndex((p) => p.id === activePlayer.id);
  const playerToUpdate = { ...activePlayer };
  playerToUpdate.activeEffects = [...(playerToUpdate.activeEffects || [])];

  // 1. Roll Dice
  let diceValue = diceValueOverride ?? rollDice();

  // PRE-ROLL EFFECTS
  const absoluteRollIndex = playerToUpdate.activeEffects.findIndex(e => e.type === 'AbsoluteRoll');
  if (absoluteRollIndex !== -1 && diceValue > 4) {
    diceValue = 4;
  }
  
  const decreasedRollIndex = playerToUpdate.activeEffects.findIndex(e => e.type === 'DecreasedRoll');
  if (decreasedRollIndex !== -1) {
    diceValue = Math.max(1, diceValue - 2);
    // Hapus debuff DecreasedRoll setelah dipakai
    playerToUpdate.activeEffects.splice(decreasedRollIndex, 1);
  }

  newState.dice = {
    currentValue: diceValue,
    isRolling: false,
  };

  // 2. Calculate Movement
  const oldPosition = playerToUpdate.position;
  const movement = calculateMovement(playerToUpdate.position, diceValue);
  playerToUpdate.position = movement.newPosition;

  // 3. Check Win
  if (movement.hasReachedEnd) {
    newState.winner = playerToUpdate.id;
    newState.gameStatus = 'finished';
    newState.players[activePlayerIndex] = playerToUpdate;
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

  // 5. Handle Event
  switch (tileEvent.type) {
    case 'Normal':
      newState.gameStatus = 'idle';
      break;

    case 'Snake': {
      const antiSnakeIndex = playerToUpdate.activeEffects.findIndex(e => e.type === 'AntiSnake');
      if (antiSnakeIndex !== -1) {
        // Block snake, consume buff
        playerToUpdate.activeEffects.splice(antiSnakeIndex, 1);
        tileEvent = { type: 'Normal' };
      } else if (tileEvent.destination !== undefined) {
        playerToUpdate.position = tileEvent.destination;
      }
      newState.gameStatus = 'idle';
      break;
    }

    case 'Ladder':
      if (tileEvent.destination !== undefined) {
        playerToUpdate.position = tileEvent.destination;
      }
      newState.gameStatus = 'idle';
      break;

    case 'Bonus': {
      acquiredEffect = getRandomBuff();
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
          stolenAmount = Math.min(3, highestScore);
          newState.players[highestOpponentIndex] = {
            ...newState.players[highestOpponentIndex],
            score: newState.players[highestOpponentIndex].score - stolenAmount
          };
        }
        
        if (stolenAmount > 0) {
          playerToUpdate.score = addScore(playerToUpdate.score, stolenAmount).newScore;
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
      break;
    }

    case 'Fact': {
      const factBannedIndex = playerToUpdate.activeEffects.findIndex(e => e.type === 'FactBanned');
      if (factBannedIndex !== -1) {
        playerToUpdate.activeEffects.splice(factBannedIndex, 1);
        tileEvent = { type: 'Normal' };
        newState.gameStatus = 'idle';
      } else {
        newState.gameStatus = 'showing_fact';
        shouldAdvanceTurn = false;
      }
      break;
    }

    case 'Quiz':
      newState.gameStatus = 'answering_quiz';
      shouldAdvanceTurn = false;
      break;
  }

  // 6. Check Win (Post-Tile Resolution)
  if (playerToUpdate.position === GAME_CONSTANTS.BOARD_SIZE) {
    newState.winner = playerToUpdate.id;
    newState.gameStatus = 'finished';
    newState.players[activePlayerIndex] = playerToUpdate;
    return { newState, tileEvent, acquiredEffect };
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
  return { newState, tileEvent, acquiredEffect };
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
    playerToUpdate.score = addScore(playerToUpdate.score, 10).newScore;
  } else {
    playerToUpdate.wrongAnswers += 1;
    playerToUpdate.score = reduceScore(playerToUpdate.score, 5).newScore;
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

export const acknowledgeFact = (state: GameState): GameState => {
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
      return newState;
    }
  }
  
  return tickDurationAndAdvanceTurn(newState);
};
