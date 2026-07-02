import React, { useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';

interface CrisisAlertModalProps {
  isOpen: boolean;
  onAcknowledge: () => void;
  isBotTurn?: boolean;
}

export const CrisisAlertModal: React.FC<CrisisAlertModalProps> = ({ isOpen, onAcknowledge, isBotTurn }) => {
  const { playSFX } = useAudio();
  
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onAcknowledge();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onAcknowledge]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all border-4 border-red-500 animate-pulse-fast">
        <div className="bg-red-600 p-6 text-center text-white">
          <div className="text-5xl mb-3">🚨</div>
          <h2 className="text-3xl font-bold font-heading">Fase Krisis!</h2>
        </div>

        <div className="p-6 text-center">
          <p className="text-gray-700 text-lg leading-relaxed font-semibold">
            Seseorang sudah memasuki zona akhir permainan.. semua player di zona bawah mendapatkan +2 langkah!
          </p>
        </div>
      </div>
    </div>
  );
};
