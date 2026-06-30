import { GameState } from '../types/gameState';
import { Tile, Snake, Ladder } from '../types/board';
import { Question } from '../types/question';

import { rollDice } from './dice';
import { calculateMovement } from './movement';
import { resolveTile, TileEvent } from './tileResolver';
import { getActivePlayer, advanceTurn } from './turnManager';
import { addScore, reduceScore } from './score';
import { validateAnswer, getQuestionById } from './quiz';

// Konteks untuk dependency injection modul gameEngine
export interface GameEngineContext {
  board: Tile[];
  snakes: Snake[];
  ladders: Ladder[];
  questions: Question[];
}

export interface ProcessTurnResult {
  newState: GameState;
  tileEvent?: TileEvent;
}

/**
 * processTurn: Titik masuk utama saat pemain menekan kocok dadu.
 * Melakukan proses lempar dadu, memindahkan pemain, dan merespons petak tujuan.
 */
export const processTurn = (
  state: GameState,
  context: GameEngineContext,
  diceValueOverride?: number // Berguna untuk testing atau kontrol dadu eksternal
): ProcessTurnResult => {
  const newState = { ...state };
  newState.players = [...state.players];

  const activePlayer = getActivePlayer(newState.players, newState.currentTurn);
  if (!activePlayer) {
    throw new Error('Active player not found');
  }

  const activePlayerIndex = newState.players.findIndex((p) => p.id === activePlayer.id);
  const playerToUpdate = { ...activePlayer };

  // 1. Roll Dice
  const diceValue = diceValueOverride ?? rollDice();
  newState.dice = {
    currentValue: diceValue,
    isRolling: false,
  };

  // 2. Calculate Movement & Move Player
  const movement = calculateMovement(playerToUpdate.position, diceValue);
  playerToUpdate.position = movement.newPosition;

  // 3. Check Win Condition
  if (movement.hasReachedEnd) {
    newState.winner = playerToUpdate.id;
    newState.gameStatus = 'finished';
    newState.players[activePlayerIndex] = playerToUpdate;
    return { newState };
  }

  // 4. Resolve Tile
  const tile = context.board.find((t) => t.position === playerToUpdate.position);
  if (!tile) {
    throw new Error(`Tile at position ${playerToUpdate.position} not found`);
  }

  const tileEvent = resolveTile(tile, context.snakes, context.ladders);

  // 5. Handle Tile Event
  switch (tileEvent.type) {
    case 'Normal':
      newState.currentTurn = advanceTurn(newState.players, newState.currentTurn);
      newState.gameStatus = 'idle';
      break;

    case 'Snake':
    case 'Ladder':
      // Efek dieksekusi secara instan tanpa memicu tile tujuan
      if (tileEvent.destination !== undefined) {
        playerToUpdate.position = tileEvent.destination;
      }
      newState.currentTurn = advanceTurn(newState.players, newState.currentTurn);
      newState.gameStatus = 'idle';
      break;

    case 'Bonus':
      if (tileEvent.scoreDelta) {
        playerToUpdate.score = addScore(playerToUpdate.score, tileEvent.scoreDelta).newScore;
      }
      newState.currentTurn = advanceTurn(newState.players, newState.currentTurn);
      newState.gameStatus = 'idle';
      break;

    case 'Penalty':
      if (tileEvent.scoreDelta) {
        playerToUpdate.score = reduceScore(playerToUpdate.score, tileEvent.scoreDelta).newScore;
      }
      newState.currentTurn = advanceTurn(newState.players, newState.currentTurn);
      newState.gameStatus = 'idle';
      break;

    case 'Fact':
      newState.gameStatus = 'showing_fact';
      break;

    case 'Quiz':
      newState.gameStatus = 'answering_quiz';
      break;
  }

  newState.players[activePlayerIndex] = playerToUpdate;
  return { newState, tileEvent };
};

/**
 * Mensubmit jawaban dari UI Kuis dan memvalidasinya.
 */
export const submitQuizAnswer = (
  state: GameState,
  context: GameEngineContext,
  questionId: string,
  answer: string
): GameState => {
  const newState = { ...state };
  newState.players = [...state.players];

  const activePlayer = getActivePlayer(newState.players, newState.currentTurn);
  if (!activePlayer) {
    throw new Error('Active player not found');
  }

  const activePlayerIndex = newState.players.findIndex((p) => p.id === activePlayer.id);
  const playerToUpdate = { ...activePlayer };

  const question = getQuestionById(questionId, context.questions);
  if (!question) {
    throw new Error('Question not found');
  }

  const result = validateAnswer(question, answer);
  if (result.isCorrect) {
    playerToUpdate.correctAnswers += 1;
    playerToUpdate.score = addScore(playerToUpdate.score, 10).newScore; // Contoh +10
  } else {
    playerToUpdate.wrongAnswers += 1;
    playerToUpdate.score = reduceScore(playerToUpdate.score, 5).newScore; // Contoh -5
  }

  newState.players[activePlayerIndex] = playerToUpdate;
  
  // GameState berubah menjadi showing_quiz_result agar UI bisa menampilkan penjelasan
  newState.gameStatus = 'showing_quiz_result';
  return newState;
};

/**
 * Melanjutkan giliran setelah pemain selesai melihat hasil kuis (penjelasan).
 */
export const acknowledgeQuizResult = (state: GameState): GameState => {
  const newState = { ...state };
  newState.currentTurn = advanceTurn(newState.players, newState.currentTurn);
  newState.gameStatus = 'idle';
  return newState;
};

/**
 * Melanjutkan giliran setelah pemain membaca fakta sejarah.
 */
export const acknowledgeFact = (state: GameState): GameState => {
  const newState = { ...state };
  newState.currentTurn = advanceTurn(newState.players, newState.currentTurn);
  newState.gameStatus = 'idle';
  return newState;
};
