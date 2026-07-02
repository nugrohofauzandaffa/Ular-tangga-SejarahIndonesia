import React from 'react';
import { Tile as TileType } from '@/types/board';
import { Player } from '@/types/player';
import PlayerToken from '../player/PlayerToken';

interface TileProps {
  tile: TileType;
  players?: Player[];
}

export default function Tile({ tile, players = [] }: TileProps) {
  // Tema warna ala perkamen/kertas kuno untuk base
  let bgClass = "bg-[#fdf6e3]";
  let borderClass = "border-[#e0d6b8]";
  let icon = "";
  let iconClass = "text-sm sm:text-xl opacity-80";
  
  switch (tile.type) {
    case 'Quiz':
      bgClass = "bg-blue-50";
      borderClass = "border-blue-200";
      icon = "📜"; // Gulungan naskah sejarah
      break;
    case 'Bonus':
      bgClass = "bg-amber-50";
      borderClass = "border-amber-300";
      icon = "⭐"; // Bintang kejayaan
      break;
    case 'Penalty':
      bgClass = "bg-red-50";
      borderClass = "border-red-300";
      icon = "⚠️"; // Peringatan bahaya
      break;
    case 'Snake':
      // Dibuat senatural mungkin karena SVG ular sudah ada
      bgClass = "bg-[#fdf6e3]";
      borderClass = "border-[#e0d6b8]";
      break;
    case 'Ladder':
      // Dibuat senatural mungkin karena SVG tangga sudah ada
      bgClass = "bg-[#fdf6e3]";
      borderClass = "border-[#e0d6b8]";
      break;
  }

  // Khusus untuk petak 100 (Garis Finish)
  if (tile.position === 100) {
    bgClass = "bg-yellow-100";
    borderClass = "border-yellow-400";
    icon = "👑"; // Mahkota kemenangan
    iconClass = "text-lg sm:text-2xl animate-pulse";
  }

  // Zona krisis (petak akhir 91-99)
  const isCrisisZone = tile.position >= 91 && tile.position <= 99;
  if (isCrisisZone) {
    borderClass = "border-red-400 shadow-[inset_0_0_10px_rgba(239,68,68,0.15)]";
  }

  return (
    <div 
      className={`border relative flex flex-col items-center justify-center p-1 transition-colors duration-300 ${bgClass} ${borderClass}`}
    >
      {/* Nomor Petak */}
      <span className="absolute top-1 left-1.5 text-[6px] sm:text-xs font-bold text-[#8b7355] z-10 font-serif">
        {tile.position}
      </span>
      
      {/* Indikator Tipe (Icon) */}
      <div className={`z-0 flex items-center justify-center w-full h-full ${iconClass}`}>
        {icon}
      </div>
      
      {/* Area untuk Player Token dipindahkan ke Board.tsx agar bisa beranimasi absolut */}
    </div>
  );
}
