import React, { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAudio } from '@/contexts/AudioContext';
import { motion } from 'framer-motion';

interface CrisisAlertModalProps {
  isOpen: boolean;
  onAcknowledge: () => void;
  isBotTurn?: boolean;
}

export const CrisisAlertModal: React.FC<CrisisAlertModalProps> = ({ isOpen, onAcknowledge }) => {
  const { currentTheme } = useTheme();
  const { playSFX } = useAudio();
  
  useEffect(() => {
    if (isOpen) {
      playSFX('popup_crisis');
      const timer = setTimeout(() => {
        onAcknowledge();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onAcknowledge]);

  if (!isOpen) return null;

  const isJakarta = currentTheme.id === 'jakarta-heritage';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="bg-[var(--color-parchment)] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-4 border-[var(--color-gold-dark)]"
      >
        
        {/* Header */}
        <div className={`bg-[var(--color-gold-dark)] p-6 text-center text-[var(--color-cream)] relative ${isJakarta ? 'pt-7' : ''}`}>
          {isJakarta && (
            <div className="absolute top-0 left-0 right-0 h-[10px] bg-repeat-x bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'10\' viewBox=\'0 0 16 10\'%3E%3Cpolygon points=\'0,0 8,8 16,0\' fill=\'%2378350f\'/%3E%3C/svg%3E')] z-10" />
          )}
          <div className="text-5xl mb-3 filter drop-shadow-sm">🚨</div>
          <h2 className="text-3xl font-black font-display uppercase tracking-wide">Fase Krisis!</h2>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <p className="text-[var(--color-navy-dark)] text-lg font-bold leading-relaxed">
            Seseorang sudah memasuki zona akhir permainan.. semua player di zona bawah mendapatkan +2 langkah!
          </p>
        </div>
      </motion.div>
    </div>
  );
};
