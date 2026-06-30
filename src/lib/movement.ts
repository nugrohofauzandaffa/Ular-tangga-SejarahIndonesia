import { GAME_CONSTANTS } from '../constants/game';

export interface MovementResult {
  newPosition: number;
  hasReachedEnd: boolean;
}

/**
 * Calculates the new position of a player based on their current position and the dice value.
 * 
 * Rules:
 * - If the target position is exactly the final square, the player wins.
 * - If the target position exceeds the final square, the player stays in the current position.
 * - Otherwise, the player moves to the target position.
 * 
 * @param currentPosition The current position of the player on the board.
 * @param diceValue The value rolled on the dice.
 * @returns The movement result containing the new position and whether the player reached the end.
 */
export function calculateMovement(currentPosition: number, diceValue: number): MovementResult {
  const targetPosition = currentPosition + diceValue;
  const finalSquare = GAME_CONSTANTS.BOARD_SIZE;

  if (targetPosition > finalSquare) {
    // Pemain harus mendapatkan angka yang tepat untuk mencapai petak terakhir.
    // Jika melebihi, posisi tetap di semula.
    return {
      newPosition: currentPosition,
      hasReachedEnd: false,
    };
  }

  if (targetPosition === finalSquare) {
    // Pemain tepat berada di petak terakhir (menang)
    return {
      newPosition: targetPosition,
      hasReachedEnd: true,
    };
  }

  // Pergerakan normal
  return {
    newPosition: targetPosition,
    hasReachedEnd: false,
  };
}
