import React, { useEffect } from 'react';
import { PlayerEffect } from '@/types/player';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

interface EffectModalProps {
  effect: PlayerEffect;
  onAcknowledge: () => void;
  isBotTurn?: boolean;
}

export const EffectModal: React.FC<EffectModalProps> = ({ effect, onAcknowledge }) => {
  const { currentTheme } = useTheme();
  const isBuff = ['AntiSnake', 'DoubleRoll', 'StealPoint'].includes(effect.type);

  // Dynamic header bg based on active theme
  const getHeaderBg = () => {
    const isJakarta = currentTheme.id === 'jakarta-heritage';
    if (isBuff) {
      return isJakarta ? 'bg-[var(--color-navy)]' : 'bg-green-700';
    } else {
      return isJakarta ? 'bg-[var(--color-gold-dark)]' : 'bg-red-800';
    }
  };

  const headerBgClass = getHeaderBg();

  useEffect(() => {
    const timer = setTimeout(() => {
      onAcknowledge();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onAcknowledge]);

  const getEffectDetails = () => {
    switch (effect.type) {
      // BUFFS
      case 'AntiSnake':
        return { icon: '🛡️', title: 'Anti Ular', desc: 'Kamu mendapat kekebalan dari gigitan ular berikutnya!' };
      case 'DoubleRoll':
        return { icon: '🎲', title: 'Lempar Ganda', desc: 'Kamu mendapat ekstra giliran untuk melempar dadu satu kali lagi.' };
      case 'StealPoint':
        return { icon: '🥷', title: 'Pencuri Poin', desc: 'Poinmu bertambah dengan mencuri dari pemimpin klasemen (atau dari sistem)!' };
      case 'Cendekiawan':
        return { icon: '📜', title: 'Cendekiawan', desc: 'Poin kuis berikutnya akan dilipatgandakan (x2) jika kamu menjawab benar.' };
      case 'MesinWaktu':
        return { icon: '🕰️', title: 'Mesin Waktu', desc: 'Kamu berteleportasi 5 langkah ke depan secara instan!' };
        
      // DEBUFFS
      case 'AbsoluteRoll':
        return { icon: '⛓️', title: 'Batas Dadu', desc: 'Kecepatanmu dibatasi! Dadu maksimal hanya angka 4 pada putaran berikutnya.' };
      case 'Silence':
        return { icon: '🚫', title: 'Kehilangan Giliran', desc: 'Kamu tidak dapat melempar dadu pada putaran berikutnya.' };
      case 'DecreasedRoll':
        return { icon: '📉', title: 'Kelelahan', desc: 'Hasil dadumu di putaran berikutnya akan dikurangi 2 langkah.' };
      case 'AmnesiaSejarah':
        return { icon: '⏪', title: 'Amnesia Sejarah', desc: 'Kamu kebingungan dan akan melangkah mundur di putaran berikutnya.' };
      case 'PajakKolonial':
        return { icon: '🪙', title: 'Pajak Kolonial', desc: 'Setiap melangkah selama 2 putaran ke depan, skormu akan dipotong sebesar angka dadu.' };
      case 'PhobiaTangga':
        return { icon: '🚧', title: 'Phobia Tangga', desc: 'Kamu terlalu takut ketinggian dan tidak bisa menggunakan tangga di putaran berikutnya.' };
      default:
        return { icon: '✨', title: 'Efek Misteri', desc: 'Sesuatu terjadi...' };
    }
  };

  const details = getEffectDetails();
  const isJakarta = currentTheme.id === 'jakarta-heritage';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="bg-[var(--color-parchment)] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-4 border-[var(--color-wood)]"
      >
        
        {/* Header */}
        <div className={`${headerBgClass} p-6 text-center text-[var(--color-cream)] border-b border-[var(--color-gold)]/40 relative ${isJakarta ? 'pt-7' : ''}`}>
          {isJakarta && (
            <div className="absolute top-0 left-0 right-0 h-[10px] bg-repeat-x bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'10\' viewBox=\'0 0 16 10\'%3E%3Cpolygon points=\'0,0 8,8 16,0\' fill=\'%2378350f\'/%3E%3C/svg%3E')] z-10" />
          )}
          <div className="text-5xl mb-3 filter drop-shadow-sm">{details.icon}</div>
          <h2 className="text-3xl font-black font-display uppercase tracking-wide">{isBuff ? 'Bonus!' : 'Penalti!'}</h2>
          <p className="text-[var(--color-cream-dark)] mt-1.5 text-base font-semibold tracking-wide">{details.title}</p>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <p className="text-[var(--color-navy-dark)] text-lg font-medium leading-relaxed">
            {details.desc}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
