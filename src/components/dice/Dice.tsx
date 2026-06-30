import React from 'react';
import { DiceState } from '../../types/gameState';
import styles from './Dice.module.css';

interface DiceProps {
  diceState: DiceState;
  onRoll: () => void;
  disabled?: boolean;
}

/**
 * Pure presentation component for the Dice.
 * It does not contain any game logic or state management.
 */
export const Dice: React.FC<DiceProps> = ({ diceState, onRoll, disabled }) => {
  return (
    <div className={styles.diceContainer}>
      <div className={`${styles.dice} ${diceState.isRolling ? styles.rolling : ''}`}>
        {diceState.isRolling ? '?' : diceState.currentValue}
      </div>
      <button 
        className={styles.rollButton} 
        onClick={onRoll} 
        disabled={disabled || diceState.isRolling}
      >
        {diceState.isRolling ? 'Mengacak...' : 'Lempar Dadu'}
      </button>
    </div>
  );
};
