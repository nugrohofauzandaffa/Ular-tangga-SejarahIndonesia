'use client';

import React, { useEffect, useRef } from 'react';
import { DiceState } from '@/types/gameState';
import styles from '@/components/dice/Dice.module.css';
import { useParticles } from '@/components/effects/ParticleManager';
import { useTheme } from '@/contexts/ThemeContext';

interface DiceProps {
  diceState: DiceState;
  onRoll: () => void;
  disabled?: boolean;
  layout?: 'vertical' | 'horizontal';
}

const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [[0, 2], [2, 0]],
  3: [[0, 2], [1, 1], [2, 0]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2]],
};

const FACE_ROTATIONS: Record<number, string> = {
  1: 'rotateY(0deg)',
  2: 'rotateY(-90deg)',
  3: 'rotateX(90deg)',
  4: 'rotateX(-90deg)',
  5: 'rotateY(90deg)',
  6: 'rotateY(180deg)',
};

const FACE_LAYOUT = [
  { value: 1, transform: 'translateZ(var(--half))' },
  { value: 6, transform: 'rotateY(180deg) translateZ(var(--half))' },
  { value: 2, transform: 'rotateY(90deg) translateZ(var(--half))' },
  { value: 5, transform: 'rotateY(-90deg) translateZ(var(--half))' },
  { value: 3, transform: 'rotateX(-90deg) translateZ(var(--half))' },
  { value: 4, transform: 'rotateX(90deg) translateZ(var(--half))' },
];

function DiceFace({ value, size, isJakarta }: { value: number; size: number, isJakarta: boolean }) {
  const dots = DOT_POSITIONS[value] || [];
  const dotSize = Math.round(size * 0.16);

  const grid = Array.from({ length: 9 }, (_, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const hasDot = dots.some(([r, c]) => r === row && c === col);
    return { row, col, hasDot };
  });

  return (
    <>
      {grid.map(({ hasDot }, idx) =>
        hasDot ? (
          <div
            key={idx}
            className={styles.dot}
            style={{
              width: dotSize,
              height: dotSize,
              margin: 'auto',
              backgroundColor: isJakarta ? '#78350f' : 'var(--color-navy-dark)',
              boxShadow: isJakarta ? 'inset 0 1px 3px rgba(0,0,0,0.6), 0 1px 1px rgba(255,255,255,0.4)' : '0 1px 3px rgba(0,0,0,0.4)',
            }}
          />
        ) : (
          <div key={idx} />
        )
      )}
    </>
  );
}

export const Dice: React.FC<DiceProps> = ({
  diceState,
  onRoll,
  disabled,
  layout = 'vertical',
}) => {
  const isHorizontal = layout === 'horizontal';
  const size = isHorizontal ? 48 : 80;
  const half = size / 2;

  const sceneRef = useRef<HTMLDivElement>(null);
  const { spawnParticle } = useParticles();
  const wasRolling = useRef(diceState.isRolling);
  
  const { currentTheme } = useTheme();
  const isJakarta = currentTheme.id === 'jakarta-heritage';

  useEffect(() => {
    if (wasRolling.current && !diceState.isRolling && sceneRef.current) {
      const rect = sceneRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        for (let i = 0; i < 8; i++) {
          const offsetAngle = (i / 8) * Math.PI * 2;
          const offsetX = Math.cos(offsetAngle) * 15;
          const offsetY = Math.sin(offsetAngle) * 15;
          spawnParticle('sparkle', x + offsetX, y + offsetY);
        }
        for (let i = 0; i < 6; i++) {
          const offsetAngle = (i / 6) * Math.PI * 2 + 0.5;
          const offsetX = Math.cos(offsetAngle) * 20;
          const offsetY = Math.sin(offsetAngle) * 20;
          spawnParticle('confetti', x + offsetX, y + offsetY);
        }
      }
    }
    wasRolling.current = diceState.isRolling;
  }, [diceState.isRolling, spawnParticle]);

  const targetTransform = FACE_ROTATIONS[diceState.currentValue] || 'rotateY(0deg)';
  const cubeTransform = diceState.isRolling
    ? `${targetTransform} rotateX(-20deg)`
    : `${targetTransform} rotateX(-15deg) rotateZ(3deg)`;

  return (
    <div className={`flex items-center ${isHorizontal ? 'flex-row gap-3' : 'flex-col gap-5'} w-full justify-center`}>
      <div
        ref={sceneRef}
        className={`${styles.scene} ${diceState.isRolling ? styles.shake : ''}`}
        style={{ width: size, height: size }}
      >
        <div
          className={`${styles.cube} ${diceState.isRolling ? styles.rolling : ''}`}
          style={{
            width: size,
            height: size,
            transform: cubeTransform,
            transition: diceState.isRolling ? 'none' : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            ['--half' as string]: `${half}px`,
          }}
        >
          {FACE_LAYOUT.map(({ value, transform }) => (
            <div
              key={value}
              className={styles.face}
              style={{
                width: size,
                height: size,
                transform,
                backgroundColor: isJakarta ? '#fdf6e3' : 'var(--color-parchment)',
                border: `${Math.max(2, size * 0.025)}px solid ${isJakarta ? 'var(--color-wood)' : 'var(--color-wood-light)'}`,
                boxShadow: isJakarta 
                  ? 'inset 0 4px 12px rgba(120,53,15,0.15), inset 0 -2px 4px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.2)'
                  : 'inset 0 2px 6px rgba(139,69,19,0.12), inset 0 -2px 4px rgba(0,0,0,0.08)',
              }}
            >
              <DiceFace value={value} size={size} isJakarta={isJakarta} />
            </div>
          ))}
        </div>
      </div>

      <button
        className={`${styles.rollButton} ${isJakarta ? 'shadow-[0_4px_12px_rgba(217,119,6,0.2)] border-2' : ''}`}
        onClick={onRoll}
        disabled={disabled || diceState.isRolling}
        style={isHorizontal ? {
          padding: '8px 16px',
          fontSize: '11px',
          minWidth: '80px',
          ...(isJakarta ? { borderColor: 'var(--color-gold-dark)', backgroundColor: '#78350f' } : {})
        } : {
          padding: '12px 28px',
          fontSize: '12px',
          width: '100%',
          maxWidth: '200px',
          ...(isJakarta ? { borderColor: 'var(--color-gold-dark)', backgroundColor: '#78350f' } : {})
        }}
      >
        {diceState.isRolling ? '⟳ Melempar...' : '✦ Lempar Dadu'}
      </button>
    </div>
  );
};
