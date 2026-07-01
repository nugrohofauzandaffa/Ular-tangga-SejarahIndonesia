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
 * @param isMVP Whether the player is currently the MVP.
 * @returns The movement result containing the new position and whether the player reached the end.
 */
export function calculateMovement(currentPosition: number, diceValue: number, isMVP: boolean = false): MovementResult {
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
    if (isMVP) {
      // Pemain MVP berhasil mencapai petak terakhir (menang)
      return {
        newPosition: targetPosition,
        hasReachedEnd: true,
      };
    } else {
      // Pemain bukan MVP dipantulkan dari petak 100 (tidak bisa masuk, mundur 1 langkah agar tidak terjebak di loop animasi yang sama)
      // Atau sesuai dadu mereka habis di 100, tapi karena ditolak, dipaksa turun.
      // Kita pakai aturan: Ditolak dari 100, mundur sisa langkah (jika pas 100 berarti overshoot 0, tapi ditolak, jadi mundur 1)
      // Wait, let's just make them bounce back 1 step if they land exactly on 100 but aren't MVP
      return {
        newPosition: finalSquare - 1, // Turun ke 99
        hasReachedEnd: false,
        isBounced: true,
      };
    }
  }

  // Pergerakan normal
  return {
    newPosition: targetPosition,
    hasReachedEnd: false,
  };
}
