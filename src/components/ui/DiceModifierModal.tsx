import React, { useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { motion } from 'framer-motion';

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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="bg-[var(--color-parchment)] rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border-4 border-[var(--color-wood)]"
      >
        <div className="text-6xl mb-4 animate-bounce">
          {isDecreased ? '📉' : '⛓️'}
        </div>
        <h2 className="text-2xl font-black text-[var(--color-gold-dark)] mb-2 uppercase tracking-wide font-display">
          {isDecreased ? 'Efek Kelelahan!' : 'Batas Kecepatan!'}
        </h2>
        <p className="text-[var(--color-navy-dark)] mb-6 font-semibold">
          {isDecreased ? 'Hasil dadumu dipotong 2 langkah.' : 'Dadu maksimal hanya 4 langkah.'}
        </p>
        
        <div className="flex items-center justify-center gap-4 text-4xl font-black bg-[var(--color-cream)]/20 p-6 rounded-xl shadow-inner border border-[var(--color-cream-dark)]/30">
          <div className="relative">
            <span className="text-[var(--color-navy-light)] opacity-40">{info.original}</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-red-500 -rotate-12"></div>
            </div>
          </div>
          <span className="text-[var(--color-navy-light)] opacity-60 text-2xl">
            {isDecreased ? '- 2' : '➡️'}
          </span>
          {isDecreased && <span className="text-[var(--color-navy-light)] opacity-60 text-2xl">=</span>}
          <span className="text-[var(--color-gold-dark)] text-5xl animate-in fade-in zoom-in duration-500 delay-300">
            {info.final}
          </span>
        </div>
        
        {!isBotTurn && (
          <button
            onClick={() => { playSFX('click'); onAcknowledge(); }}
            className="mt-8 w-full py-3 bg-[var(--color-navy)] text-[var(--color-cream)] hover:bg-[var(--color-navy-dark)] border-2 border-[var(--color-gold)] font-bold rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all uppercase text-xs tracking-wider cursor-pointer"
          >
            Lanjutkan
          </button>
        )}
      </motion.div>
    </div>
  );
};
