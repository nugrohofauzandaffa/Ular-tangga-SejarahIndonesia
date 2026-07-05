import React from 'react';
import { Tile as TileType } from '@/types/board';
import { Player } from '@/types/player';
import { useTheme } from '@/contexts/ThemeContext';

interface TileProps {
  tile: TileType;
  players?: Player[];
}

export default function Tile({ tile }: TileProps) {
  const { currentTheme } = useTheme();

  // Tema warna ala perkamen/kertas kuno untuk base
  let bgClass = "bg-[var(--color-parchment)]";
  let borderClass = "border-[var(--color-cream-dark)]/40";
  let icon: React.ReactNode = "";
  let iconClass = "text-sm sm:text-xl opacity-80";
  
  switch (tile.type) {
    case 'Quiz':
      bgClass = currentTheme.id === 'jakarta-heritage' ? "bg-[var(--color-cream-light)]/40" : "bg-blue-50";
      borderClass = currentTheme.id === 'jakarta-heritage' ? "border-teal-700/20" : "border-blue-200";
      icon = currentTheme.tiles.quizIcon;
      break;
    case 'Bonus':
      bgClass = currentTheme.id === 'jakarta-heritage' ? "bg-[var(--color-cream-light)]/20" : "bg-amber-50";
      borderClass = currentTheme.id === 'jakarta-heritage' ? "border-orange-500/30" : "border-amber-300";
      icon = currentTheme.tiles.bonusIcon;
      break;
    case 'Penalty':
      bgClass = currentTheme.id === 'jakarta-heritage' ? "bg-[var(--color-cream-light)]/20" : "bg-red-50";
      borderClass = currentTheme.id === 'jakarta-heritage' ? "border-red-500/30" : "border-red-300";
      icon = currentTheme.tiles.penaltyIcon;
      break;
    case 'Snake':
      bgClass = "bg-[var(--color-parchment)]";
      borderClass = "border-[var(--color-cream-dark)]/40";
      break;
    case 'Ladder':
      bgClass = "bg-[var(--color-parchment)]";
      borderClass = "border-[var(--color-cream-dark)]/40";
      break;
  }

  // Khusus untuk petak 100 (Garis Finish)
  if (tile.position === 100) {
    bgClass = currentTheme.id === 'jakarta-heritage' ? "bg-[var(--color-cream)] shadow-[0_0_12px_rgba(201,168,76,0.25)]" : "bg-yellow-100";
    borderClass = currentTheme.id === 'jakarta-heritage' ? "border-2 border-[var(--color-gold)]" : "border-yellow-400";
    icon = currentTheme.tiles.winIcon;
    iconClass = currentTheme.id === 'jakarta-heritage' ? "scale-110 sm:scale-125 z-10" : "text-lg sm:text-2xl animate-pulse";
  }

  // Zona krisis (petak akhir 91-99)
  const isCrisisZone = tile.position >= 91 && tile.position <= 99;
  if (isCrisisZone) {
    borderClass = currentTheme.id === 'jakarta-heritage'
      ? "border-orange-400 shadow-[inset_0_0_10px_rgba(249,115,22,0.15)]"
      : "border-red-400 shadow-[inset_0_0_10px_rgba(239,68,68,0.15)]";
  }

  return (
    <div 
      className={`border relative flex flex-col items-center justify-center p-1 transition-all duration-300 ${bgClass} ${borderClass}`}
    >
      {/* Nomor Petak */}
      <span 
        className="absolute top-1 left-1.5 text-[6px] sm:text-xs font-bold z-10 font-serif"
        style={{ color: 'var(--color-wood-light)' }}
      >
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

