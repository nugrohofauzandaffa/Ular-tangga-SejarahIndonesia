import React from 'react';
import { PlayerEffect } from '@/types/player';

interface EffectModalProps {
  effect: PlayerEffect;
  onAcknowledge: () => void;
}

export const EffectModal: React.FC<EffectModalProps> = ({ effect, onAcknowledge }) => {
  const isBuff = ['AntiSnake', 'DoubleRoll', 'StealPoint'].includes(effect.type);
  const colorClass = isBuff ? 'bg-green-600' : 'bg-red-600';
  const lightColorClass = isBuff ? 'text-green-100' : 'text-red-100';
  const buttonColorClass = isBuff ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';

  const getEffectDetails = () => {
    switch (effect.type) {
      case 'AntiSnake':
        return { icon: '🛡️', title: 'Anti Ular', desc: 'Kamu mendapat kekebalan dari gigitan ular berikutnya!' };
      case 'DoubleRoll':
        return { icon: '🎲', title: 'Lempar Ganda', desc: 'Kamu mendapat ekstra giliran untuk melempar dadu satu kali lagi.' };
      case 'StealPoint':
        return { icon: '🥷', title: 'Curi Poin', desc: 'Kamu mendapat +3 Poin, dan mencuri 3 Poin dari lawan dengan skor tertinggi!' };
      case 'AbsoluteRoll':
        return { icon: '⛓️', title: 'Batas Dadu', desc: 'Kecepatanmu dibatasi! Dadu maksimal hanya angka 4 selama 2 putaran.' };
      case 'FactBanned':
        return { icon: '🚫', title: 'Buta Fakta', desc: 'Aksesmu ke petak Fakta berikutnya telah diblokir.' };
      case 'DecreasedRoll':
        return { icon: '📉', title: 'Kelelahan', desc: 'Hasil dadumu di putaran berikutnya akan dikurangi 2 langkah.' };
      default:
        return { icon: '✨', title: 'Efek Misteri', desc: 'Sesuatu terjadi...' };
    }
  };

  const details = getEffectDetails();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
        {/* Header */}
        <div className={`${colorClass} p-6 text-center text-white`}>
          <div className="text-5xl mb-3">{details.icon}</div>
          <h2 className="text-3xl font-bold font-heading">{isBuff ? 'Bonus!' : 'Penalti!'}</h2>
          <p className={`${lightColorClass} mt-1 text-lg`}>{details.title}</p>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <p className="text-gray-700 text-lg mb-8 leading-relaxed">
            {details.desc}
          </p>

          <button
            onClick={onAcknowledge}
            className={`w-full text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md text-lg ${buttonColorClass}`}
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};
