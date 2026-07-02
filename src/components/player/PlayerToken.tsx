import React, { useEffect, useState, useRef } from 'react';
import { Player } from '@/types/player';
import { motion, useReducedMotion, Transition, Variants } from 'framer-motion';
import { ANIMATION_GUIDELINES } from '@/constants/animation';

interface PlayerTokenProps {
  player: Player;
  index?: number;
  totalTokens?: number;
  x?: number; // Persentase X
  y?: number; // Persentase Y
  isTransitioning?: boolean; // Menandakan sedang di-animasikan oleh RAF (bypass CSS transition)
}

export default function PlayerToken({ player, index = 0, totalTokens = 1, x = 50, y = 50, isTransitioning = false }: PlayerTokenProps) {
  const prefersReducedMotion = useReducedMotion();
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
  
  const [isHopping, setIsHopping] = useState(false);
  const prevPos = useRef({ x, y });
  const prevIsTransitioning = useRef(isTransitioning);

  useEffect(() => {
    const wasTransitioning = prevIsTransitioning.current;

    if (prevPos.current.x !== x || prevPos.current.y !== y) {
      // Jangan melompat jika saat ini sedang transisi ATAU baru saja selesai transisi (landing)
      if (!isTransitioning && !wasTransitioning && !prefersReducedMotion) {
        console.log(`[PlayerToken] ${player.name} IS HOPPING! Old: ${prevPos.current.x},${prevPos.current.y} New: ${x},${y}`);
        setIsHopping(true);
        const timer = setTimeout(() => setIsHopping(false), ANIMATION_GUIDELINES.CATEGORIES.QUICK.durationMs);
        return () => clearTimeout(timer);
      }
      prevPos.current = { x, y };
    }
    
    prevIsTransitioning.current = isTransitioning;
  }, [x, y, isTransitioning, prefersReducedMotion, player.name]);

  // Hitung offset (geser) jika terdapat lebih dari satu pemain di petak yang sama
  let offsetX = 0;
  let offsetY = 0;
  let zIndex = 50;
  
  if (totalTokens > 1 && !isTransitioning) {
    switch (index) {
      case 0: offsetX = -5; offsetY = -5; zIndex = 20; break;
      case 1: offsetX = 5; offsetY = 5; zIndex = 30; break;
      case 2: offsetX = -5; offsetY = 5; zIndex = 40; break;
      case 3: offsetX = 5; offsetY = -5; zIndex = 50; break;
    }
  }

  // Jika sedang melompat, kita override zIndex agar tampil paling depan
  if (isHopping) {
    zIndex = 100;
  }

  const variants: Variants = {
    idle: {
      left: `${x}%`,
      top: `${y}%`,
      scale: 1,
      y: offsetY,
      x: offsetX,
      boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
      transition: {
        left: { duration: 0.3, ease: 'easeOut' },
        top: { duration: 0.3, ease: 'easeOut' },
        x: { duration: 0.3, ease: 'easeOut' },
        y: { duration: 0.3, ease: 'easeOut' },
        scale: { duration: 0.3, ease: 'easeOut' },
        boxShadow: { duration: 0.3, ease: 'easeOut' }
      }
    },
    hopping: {
      left: `${x}%`,
      top: `${y}%`,
      scale: [1, 1.1, 0.9, 1],
      y: [
        offsetY, 
        offsetY - 15, 
        offsetY + 2, 
        offsetY
      ],
      x: offsetX,
      boxShadow: ['0px 4px 6px rgba(0,0,0,0.1)', '0px 15px 15px rgba(0,0,0,0.3)', '0px 2px 4px rgba(0,0,0,0.2)', '0px 4px 6px rgba(0,0,0,0.1)'],
      transition: {
        duration: ANIMATION_GUIDELINES.CATEGORIES.QUICK.duration,
        ease: 'easeInOut' as const
      } as Transition
    },
    transitioning: {
      left: `${x}%`,
      top: `${y}%`,
      scale: 1,
      y: offsetY,
      x: offsetX,
      boxShadow: '0px 10px 15px rgba(0,0,0,0.3)',
      transition: {
        duration: 0
      }
    }
  };

  // Dinamika ukuran: membesar bila sendirian, mengecil bila bertumpuk
  const isStacked = totalTokens > 1;
  const sizeClasses = isStacked 
    ? 'w-2.5 h-2.5 sm:w-4 sm:h-4' 
    : 'w-4 h-4 sm:w-6 sm:h-6';
    
  const textClasses = isStacked
    ? 'text-[5px] sm:text-[8px]'
    : 'text-[8px] sm:text-xs';

  return (
    <motion.div 
      className="absolute w-0 h-0"
      initial={false}
      animate={isTransitioning ? 'transitioning' : (isHopping ? 'hopping' : 'idle')}
      variants={prefersReducedMotion ? undefined : variants}
      style={{ zIndex }}
    >
      <div 
        className={`absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 ${sizeClasses} rounded-full border flex items-center justify-center ${colorClass} transition-all duration-300 ease-out`}
        title={`${player.name} (Score: ${player.score})`}
      >
        <span className={`${textClasses} font-bold text-white leading-none`}>
          {player.name.charAt(0).toUpperCase()}
        </span>
      </div>
    </motion.div>
  );
}
