import React from 'react';
import { Player } from '@/types/player';

interface PlayerTokenProps {
  player: Player;
  index?: number;
  totalTokens?: number;
}

export default function PlayerToken({ player, index = 0, totalTokens = 1 }: PlayerTokenProps) {
  // Palet warna statis yang bisa menampung 4 pemain
  const colorClasses = [
    'bg-blue-500 border-blue-700',
    'bg-rose-500 border-rose-700',
    'bg-emerald-500 border-emerald-700',
    'bg-amber-500 border-amber-700',
  ];
  
  // Mengambil angka dari ID untuk indeks warna, default 0 jika gagal
  const numId = parseInt(player.id.replace(/\D/g, '')) || 0;
  const colorClass = colorClasses[numId % colorClasses.length];
  
  // Hitung sedikit offset (geser) jika terdapat lebih dari satu pemain di petak yang sama
  let offsetClass = '';
  if (totalTokens > 1) {
    switch (index) {
      case 0: offsetClass = '-translate-x-1.5 -translate-y-1.5 z-20'; break;
      case 1: offsetClass = 'translate-x-1.5 translate-y-1.5 z-30'; break;
      case 2: offsetClass = '-translate-x-1.5 translate-y-1.5 z-40'; break;
      case 3: offsetClass = 'translate-x-1.5 -translate-y-1.5 z-50'; break;
      default: offsetClass = 'z-50';
    }
  }

  return (
    <div 
      className={`absolute w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border shadow-md flex items-center justify-center transition-transform ${colorClass} ${offsetClass}`}
      title={`${player.name} (Score: ${player.score})`}
    >
      <span className="text-[8px] sm:text-[10px] font-bold text-white leading-none">
        {player.name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
