'use client';

import React, { useEffect, useRef } from 'react';
import { DiceState } from '@/types/gameState';
import styles from './Dice.module.css';
import { useParticles } from '@/components/effects/ParticleManager';

interface DiceProps {
  diceState: DiceState;
  onRoll: () => void;
  disabled?: boolean;
  layout?: 'vertical' | 'horizontal';
}

// Dot pattern: setiap nilai 1-6 memiliki posisi titik di grid 3x3
// Grid: row 0-2 (atas ke bawah), col 0-2 (kiri ke kanan)
// [row, col]
const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [[0, 2], [2, 0]],
  3: [[0, 2], [1, 1], [2, 0]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2]],
};

// Rotasi kubus agar sisi yang benar menghadap pemain
// Posisi sisi dalam 3D: front=1, back=6, right=2, left=5, top=3, bottom=4
const FACE_ROTATIONS: Record<number, string> = {
  1: 'rotateY(0deg)',
  2: 'rotateY(-90deg)',
  3: 'rotateX(90deg)',
  4: 'rotateX(-90deg)',
  5: 'rotateY(90deg)',
  6: 'rotateY(180deg)',
};

// Urutan nilai tiap sisi untuk ditampilkan pada kubus
const FACE_LAYOUT = [
  { value: 1, transform: 'translateZ(var(--half))' },               // Front
  { value: 6, transform: 'rotateY(180deg) translateZ(var(--half))' }, // Back
  { value: 2, transform: 'rotateY(90deg) translateZ(var(--half))' },  // Right
  { value: 5, transform: 'rotateY(-90deg) translateZ(var(--half))' }, // Left
  { value: 3, transform: 'rotateX(-90deg) translateZ(var(--half))' }, // Top
  { value: 4, transform: 'rotateX(90deg) translateZ(var(--half))' },  // Bottom
];

function DiceFace({ value, size }: { value: number; size: number }) {
  const dots = DOT_POSITIONS[value] || [];
  const dotSize = Math.round(size * 0.16);

  // Build a 3x3 grid
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
              backgroundColor: 'var(--color-navy-dark)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
            }}
          />
        ) : (
          <div key={idx} />
        )
      )}
    </>
  );
}

/**
 * Dice 3D — Kubus CSS 3D dengan 6 sisi dan dot pattern.
 * Murni Presentation Component. Tidak ada game logic.
 */
export const Dice: React.FC<DiceProps> = ({
  diceState,
  onRoll,
  disabled,
  layout = 'vertical',
}) => {
  const isHorizontal = layout === 'horizontal';

  // Ukuran responsif: lebih kecil saat horizontal (mobile panel)
  const size = isHorizontal ? 48 : 80;
  const half = size / 2;

  const sceneRef = useRef<HTMLDivElement>(null);
  const { spawnParticle } = useParticles();
  const wasRolling = useRef(diceState.isRolling);

  useEffect(() => {
    if (wasRolling.current && !diceState.isRolling && sceneRef.current) {
      // Landed! Sparkle and confetti burst
      const rect = sceneRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      // Burst particles
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
    wasRolling.current = diceState.isRolling;
  }, [diceState.isRolling, spawnParticle]);

  // Transform target berdasarkan nilai dadu saat ini
  const targetTransform = FACE_ROTATIONS[diceState.currentValue] || 'rotateY(0deg)';

  // Saat rolling, cube berputar-putar acak (melalui CSS animation)
  // Saat idle, cube di-snap ke posisi sisi yang sesuai
  const cubeTransform = diceState.isRolling
    ? `${targetTransform} rotateX(-20deg)` // base posisi awal animasi
    : `${targetTransform} rotateX(-15deg) rotateZ(3deg)`;

  return (
    <div
      className={`flex items-center ${isHorizontal ? 'flex-row gap-3' : 'flex-col gap-5'}`}
    >
      {/* Dice 3D Scene */}
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
                // Ivory/parchment face with wood border
                backgroundColor: 'var(--color-parchment)',
                border: `${Math.max(2, size * 0.025)}px solid var(--color-wood-light)`,
                boxShadow: 'inset 0 2px 6px rgba(139,69,19,0.12), inset 0 -2px 4px rgba(0,0,0,0.08)',
              }}
            >
              <DiceFace value={value} size={size} />
            </div>
          ))}
        </div>
      </div>

      {/* Roll Button */}
      <button
        className={styles.rollButton}
        onClick={onRoll}
        disabled={disabled || diceState.isRolling}
        style={isHorizontal ? {
          padding: '8px 16px',
          fontSize: '11px',
          minWidth: '80px',
        } : {
          padding: '12px 28px',
          fontSize: '12px',
          width: '100%',
          maxWidth: '200px',
        }}
      >
        {diceState.isRolling ? '⟳ Melempar...' : '✦ Lempar Dadu'}
      </button>
    </div>
  );
};
