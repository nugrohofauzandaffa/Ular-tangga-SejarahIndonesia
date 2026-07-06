'use client';

import React from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { useTheme } from '@/contexts/ThemeContext';

export function AudioSettings() {
  const { volume, isMuted, setVolume, toggleMute, playSFX } = useAudio();


  return (
    <div className="flex flex-col gap-3 p-4 bg-[var(--color-parchment)] rounded-xl border-2 border-[var(--color-wood-light)] shadow-lg">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--color-navy-dark)', fontFamily: 'var(--font-display)' }}>
          <span className="text-base">⚙️</span> Pengaturan Sistem
        </label>
      </div>
      
      {/* Audio Settings */}
      <div className="flex items-center justify-between border-t border-[var(--color-wood)]/20 pt-2 mt-1">
        <label className="text-xs font-bold text-[var(--color-navy)] flex items-center gap-2">
          Suara
        </label>
        <button
          onClick={() => { playSFX('click'); toggleMute(); }}
          className="text-xl hover:scale-110 transition-transform focus:outline-none cursor-pointer"
          title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={isMuted ? 0 : volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        disabled={isMuted}
        className="w-full accent-[var(--color-navy)] disabled:opacity-50 cursor-pointer"
      />

    </div>
  );
}
