import React from 'react';
import { DiceState } from '@/types/gameState';
import styles from './Dice.module.css';

interface DiceProps {
  diceState: DiceState;
  onRoll: () => void;
  disabled?: boolean;
  layout?: 'vertical' | 'horizontal';
}

/**
 * Pure presentation component for the Dice.
 * It does not contain any game logic or state management.
 */
export const Dice: React.FC<DiceProps> = ({ diceState, onRoll, disabled, layout = 'vertical' }) => {
  const isHorizontal = layout === 'horizontal';

  return (
    <div className={`flex items-center ${isHorizontal ? 'flex-row gap-3' : 'flex-col gap-4'}`}>
      <div 
        className={`flex justify-center items-center bg-white border-2 border-slate-800 rounded-xl font-bold text-slate-800 shadow-sm transition-transform
          ${isHorizontal ? 'w-10 h-10 text-xl' : 'w-20 h-20 text-4xl'}
          ${diceState.isRolling ? styles.rolling : ''}`}
      >
        {diceState.isRolling ? '?' : diceState.currentValue}
      </div>
      <button 
        className={`font-bold cursor-pointer rounded-full text-white transition-colors
          ${disabled || diceState.isRolling ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'}
          ${isHorizontal ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'}`}
        onClick={onRoll} 
        disabled={disabled || diceState.isRolling}
      >
        {diceState.isRolling ? '...' : 'Lempar Dadu'}
      </button>
    </div>
  );
};
