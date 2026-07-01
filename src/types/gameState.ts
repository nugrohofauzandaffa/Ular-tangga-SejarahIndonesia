import { Player } from './player';

export type GameStatus =
  | 'idle'
  | 'rolling_dice'
  | 'moving'
  | 'answering_quiz'
  | 'showing_quiz_result'
  | 'showing_effect'
  | 'finished';

export interface DiceState {
  currentValue: number;
  isRolling: boolean;
}

export interface ScoreStat {
  totalScore: number;
  combo: number;
  accuracy: number;
}

export interface GameLog {
  id: string;
  timestamp: number;
  playerName: string;
  message: string;
  type: 'bonus' | 'penalty' | 'system';
}

export interface GameState {
  players: Player[];
  currentTurn: string; // Player ID
  winner: string | null; // Player ID
  gameStatus: GameStatus;
  dice: DiceState;
  logs: GameLog[];
  isCrisisPhaseActive?: boolean;
}
