'use client';

import React from 'react';
import { useAudio } from '@/contexts/AudioContext';

export function AudioSettings() {
  const { volume, isMuted, setVolume, toggleMute } = useAudio();

  return (
    <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <span className="text-lg">🎵</span> Pengaturan Audio
        </label>
        <button
          onClick={toggleMute}
          className="text-xl hover:scale-110 transition-transform focus:outline-none"
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
        className="w-full accent-blue-600 disabled:opacity-50 cursor-pointer"
      />
    </div>
  );
}
