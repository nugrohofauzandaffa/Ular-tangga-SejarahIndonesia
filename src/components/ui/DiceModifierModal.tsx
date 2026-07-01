import React, { useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';

export interface DiceModifierInfo {
  type: 'DecreasedRoll' | 'AbsoluteRoll';
  original: number;
  final: number;
}

interface DiceModifierModalProps {
  info: DiceModifierInfo | null;
  onAcknowledge: () => void;
  isBotTurn?: boolean;
}

export const DiceModifierModal: React.FC<DiceModifierModalProps> = ({ info, onAcknowledge, isBotTurn }) => {
  const { playSFX } = useAudio();

  useEffect(() => {
    if (info) {
      playSFX('wrong'); // Mainkan suara penalti
      const timer = setTimeout(() => {
        onAcknowledge();
      }, 3000); // Tutup otomatis setelah 3 detik
      return () => clearTimeout(timer);
    }
  }, [info, onAcknowledge, playSFX]);

  if (!info) return null;

  const isDecreased = info.type === 'DecreasedRoll';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-in zoom-in-95 duration-300">
        <div className="text-6xl mb-4 animate-bounce">
          {isDecreased ? '📉' : '⛓️'}
        </div>
        <h2 className="text-2xl font-black text-red-600 mb-2 uppercase tracking-wide">
          {isDecreased ? 'Efek Kelelahan!' : 'Batas Kecepatan!'}
        </h2>
        <p className="text-slate-600 mb-6 font-medium">
          {isDecreased ? 'Hasil dadumu dipotong 2 langkah.' : 'Dadu maksimal hanya 4 langkah.'}
        </p>
        
        <div className="flex items-center justify-center gap-4 text-4xl font-black bg-slate-100 p-6 rounded-xl shadow-inner border border-slate-200">
          <div className="relative">
            <span className="text-slate-400 opacity-50">{info.original}</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-red-500 -rotate-12"></div>
            </div>
          </div>
          <span className="text-slate-300 text-2xl">
            {isDecreased ? '- 2' : '➡️'}
          </span>
          {isDecreased && <span className="text-slate-300 text-2xl">=</span>}
          <span className="text-red-600 text-5xl animate-in fade-in zoom-in duration-500 delay-300">
            {info.final}
          </span>
        </div>
        
        {!isBotTurn && (
          <button
            onClick={() => { playSFX('click'); onAcknowledge(); }}
            className="mt-8 w-full py-3 bg-red-600 text-white rounded-xl font-bold shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:bg-red-700 hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-0.5 transition-all"
          >
            Lanjutkan
          </button>
        )}
      </div>
    </div>
  );
};
