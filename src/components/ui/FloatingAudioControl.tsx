'use client';

import React, { useState } from 'react';
import { AudioSettings } from './AudioSettings';

export function FloatingAudioControl() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-[72px] right-4 z-50 flex flex-col items-end gap-2 pointer-events-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 text-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center text-xl transition-all duration-300 focus:outline-none ${
          isOpen ? 'bg-slate-700 hover:bg-slate-800 rotate-90' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        title="Pengaturan Suara"
      >
        {isOpen ? '✕' : '⚙️'}
      </button>
      
      {isOpen && (
        <div className="shadow-2xl rounded-xl animate-in fade-in slide-in-from-top-2 w-64 origin-top-right">
          <AudioSettings />
        </div>
      )}
    </div>
  );
}
