'use client';

import React, { useState } from 'react';
import { AudioSettings } from './AudioSettings';
import { useAudio } from '@/contexts/AudioContext';

export function FloatingAudioControl() {
  const [isOpen, setIsOpen] = useState(false);
  const { playSFX } = useAudio();

  return (
    <div className="relative z-50 flex flex-col items-end gap-2 pointer-events-auto">
      <button
        onClick={() => { playSFX('click'); setIsOpen(!isOpen); }}
        className={`w-11 h-11 sm:w-12 sm:h-12 text-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center text-lg sm:text-xl transition-all duration-300 focus:outline-none border-2 border-[var(--color-gold)] cursor-pointer ${
          isOpen ? 'bg-[var(--color-wood)] hover:bg-[var(--color-wood-light)] rotate-90' : 'bg-[var(--color-navy)] hover:bg-[var(--color-navy-dark)]'
        }`}
        title="Pengaturan Suara"
      >
        {isOpen ? '✕' : '⚙️'}
      </button>
      
      {isOpen && (
        <div className="absolute top-[110%] right-0 shadow-2xl rounded-xl animate-in fade-in slide-in-from-top-2 w-64 origin-top-right">
          <AudioSettings />
        </div>
      )}
    </div>
  );
}
