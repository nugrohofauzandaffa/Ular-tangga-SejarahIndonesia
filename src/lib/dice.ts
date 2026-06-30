import { GAME_CONSTANTS } from '../constants/game';

/**
 * Business Logic for Dice
 * Pure function that generates a random number based on configured bounds.
 */
export function rollDice(): number {
  const { MIN_DICE, MAX_DICE } = GAME_CONSTANTS;
  return Math.floor(Math.random() * (MAX_DICE - MIN_DICE + 1)) + MIN_DICE;
}
