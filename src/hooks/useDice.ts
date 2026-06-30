import { useState, useCallback } from 'react';
import { rollDice } from '../lib/dice';
import { DiceState } from '../types/gameState';

/**
 * Custom hook to manage the state of the dice and coordinate the rolling logic.
 */
export function useDice() {
  const [diceState, setDiceState] = useState<DiceState>({
    currentValue: 1,
    isRolling: false,
  });

  const triggerRoll = useCallback(async (onComplete?: (value: number) => void) => {
    if (diceState.isRolling) return;

    setDiceState((prev) => ({ ...prev, isRolling: true }));
    
    // Simulate the animation delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    const newValue = rollDice();
    
    setDiceState({
      currentValue: newValue,
      isRolling: false,
    });

    if (onComplete) {
      onComplete(newValue);
    }
  }, [diceState.isRolling]);

  return {
    diceState,
    triggerRoll,
  };
}
