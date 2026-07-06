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
  const isJakarta = currentTheme.id === 'jakarta-heritage';

  // Tema warna ala perkamen/kertas kuno untuk base
  let bgClass = "bg-[var(--color-parchment)]";
  let borderClass = "border-[var(--color-cream-dark)]/40";
  let icon: React.ReactNode = "";
  let iconClass = "scale-[0.4] sm:scale-100 text-[10px] sm:text-xl opacity-60 sm:opacity-80";
  
  // Highlight untuk special tiles
  let glowEffect = "";

  switch (tile.type) {
    case 'Quiz':
      bgClass = isJakarta ? "bg-[var(--color-cream-light)]/40" : "bg-blue-50";
      borderClass = isJakarta ? "border-teal-700/20" : "border-blue-200";
      icon = currentTheme.tiles.quizIcon;
      if (isJakarta) glowEffect = "shadow-[inset_0_0_12px_rgba(20,184,166,0.15)]";
      break;
    case 'Bonus':
      bgClass = isJakarta ? "bg-[var(--color-cream-light)]/20" : "bg-amber-50";
      borderClass = isJakarta ? "border-orange-500/30" : "border-amber-300";
      icon = currentTheme.tiles.bonusIcon;
      if (isJakarta) glowEffect = "shadow-[inset_0_0_12px_rgba(249,115,22,0.15)]";
      break;
    case 'Penalty':
      bgClass = isJakarta ? "bg-[var(--color-cream-light)]/20" : "bg-red-50";
      borderClass = isJakarta ? "border-red-500/30" : "border-red-300";
      icon = currentTheme.tiles.penaltyIcon;
      if (isJakarta) glowEffect = "shadow-[inset_0_0_12px_rgba(239,68,68,0.15)]";
      break;
    case 'Snake':
    case 'Ladder':
      bgClass = "bg-[var(--color-parchment)]";
      borderClass = "border-[var(--color-cream-dark)]/40";
      break;
  }

  // Khusus untuk petak 100 (Garis Finish)
  if (tile.position === 100) {
    bgClass = isJakarta ? "bg-[var(--color-cream)] shadow-[0_0_12px_rgba(201,168,76,0.25)]" : "bg-yellow-100";
    borderClass = isJakarta ? "border-2 border-[var(--color-gold)]" : "border-yellow-400";
    icon = currentTheme.tiles.winIcon;
    iconClass = isJakarta ? "scale-50 sm:scale-125 z-10" : "text-xs sm:text-2xl animate-pulse scale-[0.6] sm:scale-100";
    if (isJakarta) glowEffect = "shadow-[inset_0_0_20px_rgba(201,168,76,0.3)] animate-pulse";
  }

  // Zona krisis (petak akhir 91-99)
  const isCrisisZone = tile.position >= 91 && tile.position <= 99;
  if (isCrisisZone) {
    borderClass = isJakarta
      ? "border-orange-400 shadow-[inset_0_0_10px_rgba(249,115,22,0.15)]"
      : "border-red-400 shadow-[inset_0_0_10px_rgba(239,68,68,0.15)]";
  }

  return (
    <div 
      className={`border relative flex flex-col items-center justify-center p-1 transition-all duration-300 ${bgClass} ${borderClass} ${glowEffect} hover:brightness-110 hover:shadow-[inset_0_0_15px_rgba(253,211,77,0.4)] cursor-default`}
    >
      {/* Nomor Petak */}
      <span 
        className="absolute top-1 left-1.5 text-[6px] sm:text-xs font-bold z-10 font-serif"
        style={{ color: 'var(--color-wood-light)' }}
      >
        {tile.position}
      </span>
      
      {/* Indikator Tipe (Icon) */}
      <div className={`z-0 flex items-center justify-center w-full h-full transition-transform duration-300 hover:scale-110 ${iconClass}`}>
        {icon}
      </div>
      
      {/* Area untuk Player Token dipindahkan ke Board.tsx agar bisa beranimasi absolut */}
    </div>
  );
}
