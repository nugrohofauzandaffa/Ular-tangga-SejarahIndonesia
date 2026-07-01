import React from 'react';
import { Player } from '@/types/player';

interface PlayerTokenProps {
  player: Player;
  index?: number;
  totalTokens?: number;
  x?: number; // Persentase X
  y?: number; // Persentase Y
}

export default function PlayerToken({ player, index = 0, totalTokens = 1, x = 50, y = 50 }: PlayerTokenProps) {
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
  
  // Hitung offset (geser) jika terdapat lebih dari satu pemain di petak yang sama
  let offsetX = 0;
  let offsetY = 0;
  let zIndex = 50;
  
  if (totalTokens > 1) {
    switch (index) {
      case 0: offsetX = -6; offsetY = -6; zIndex = 20; break;
      case 1: offsetX = 6; offsetY = 6; zIndex = 30; break;
      case 2: offsetX = -6; offsetY = 6; zIndex = 40; break;
      case 3: offsetX = 6; offsetY = -6; zIndex = 50; break;
    }
  }

  return (
    <div 
      className={`absolute w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border shadow-md flex items-center justify-center transition-all duration-500 ease-in-out ${colorClass}`}
      style={{
        left: `calc(${x}% + ${offsetX}px)`,
        top: `calc(${y}% + ${offsetY}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: zIndex
      }}
      title={`${player.name} (Score: ${player.score})`}
    >
      <span className="text-[8px] sm:text-[10px] font-bold text-white leading-none">
        {player.name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
