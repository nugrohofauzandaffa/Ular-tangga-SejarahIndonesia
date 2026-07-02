import { GAME_CONSTANTS } from '../constants/game';

export interface MovementResult {
  newPosition: number;
  hasReachedEnd: boolean;
  isBounced?: boolean;
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
    // Pantulan (Bouncing)
    const overshoot = targetPosition - finalSquare;
    const bouncedPosition = finalSquare - overshoot;
    return {
      newPosition: bouncedPosition,
      hasReachedEnd: false,
      isBounced: true,
    };
  }

  if (targetPosition === finalSquare) {
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

/**
 * Calculates the step-by-step path for a player's movement, including bounces.
 * Useful for hopping animations.
 */
export function calculateMovementPath(currentPosition: number, diceValue: number): number[] {
  const path: number[] = [];
  let current = currentPosition;
  const finalSquare = GAME_CONSTANTS.BOARD_SIZE;
  let isBouncing = false;

  for (let i = 0; i < diceValue; i++) {
    if (!isBouncing) {
      if (current < finalSquare) {
        current += 1;
      } else {
        isBouncing = true;
        current -= 1;
      }
    } else {
      current -= 1;
    }
    path.push(current);
  }

  return path;
}
