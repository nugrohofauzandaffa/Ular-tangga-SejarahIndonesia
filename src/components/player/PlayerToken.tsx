import React, { useEffect, useState, useRef } from 'react';
import { Player } from '@/types/player';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { ANIMATION_GUIDELINES } from '@/constants/animation';
import { useTheme } from '@/contexts/ThemeContext';

export type AnimationStyle = 'hop' | 'lerp' | 'arc' | 'squash' | 'slide';

interface PlayerTokenProps {
  player: Player;
  index?: number;
  totalTokens?: number;
  x?: number; // Persentase X
  y?: number; // Persentase Y
  rotation?: number; // Sudut rotasi saat spline animation
  isTransitioning?: boolean; // Menandakan sedang di-animasikan oleh RAF (bypass CSS transition)
  animationStyle?: AnimationStyle;
}

export default function PlayerToken({ 
  player, 
  index = 0, 
  totalTokens = 1, 
  x = 50, 
  y = 50, 
  rotation = 0,
  isTransitioning = false,
  animationStyle = 'hop'
}: PlayerTokenProps) {
  const prefersReducedMotion = useReducedMotion();
  const { currentTheme } = useTheme();
  const isJakarta = currentTheme.id === 'jakarta-heritage';

  // Jewel-toned premium board game token styles with wooden/gold trims
  const colorClasses = isJakarta ? [
    'bg-teal-700 border-[#fcd34d] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.45),_0_6px_12px_rgba(0,0,0,0.6)]',
    'bg-[#ea580c] border-[#fcd34d] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.45),_0_6px_12px_rgba(0,0,0,0.6)]',
    'bg-[#0d9488] border-[#fcd34d] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.45),_0_6px_12px_rgba(0,0,0,0.6)]',
    'bg-[#ca8a04] border-[#fcd34d] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.45),_0_6px_12px_rgba(0,0,0,0.6)]',
  ] : [
    'bg-blue-600 border-[#c9a84c] shadow-[inset_0_-2px_3px_rgba(0,0,0,0.35),_0_2px_3px_rgba(0,0,0,0.2)]',
    'bg-rose-600 border-[#c9a84c] shadow-[inset_0_-2px_3px_rgba(0,0,0,0.35),_0_2px_3px_rgba(0,0,0,0.2)]',
    'bg-emerald-600 border-[#c9a84c] shadow-[inset_0_-2px_3px_rgba(0,0,0,0.35),_0_2px_3px_rgba(0,0,0,0.2)]',
    'bg-amber-600 border-[#c9a84c] shadow-[inset_0_-2px_3px_rgba(0,0,0,0.35),_0_2px_3px_rgba(0,0,0,0.2)]',
  ];
  
  // Mengambil angka dari ID untuk indeks warna, default 0 jika gagal
  const numId = parseInt(player.id.replace(/\D/g, '')) || 0;
  const colorClass = colorClasses[numId % colorClasses.length];
  
  const [isHopping, setIsHopping] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const prevPos = useRef({ x, y });
  const prevIsTransitioning = useRef(isTransitioning);
  const wasHopping = useRef(false);

  useEffect(() => {
    if (wasHopping.current && !isHopping) {
      setShowRipple(true);
      const timer = setTimeout(() => setShowRipple(false), 800);
      return () => clearTimeout(timer);
    }
    wasHopping.current = isHopping;
  }, [isHopping]);


  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const wasTransitioning = prevIsTransitioning.current;

    if (prevPos.current.x !== x || prevPos.current.y !== y) {
      // Jangan melompat jika saat ini sedang transisi ATAU baru saja selesai transisi (landing)
      if (!isTransitioning && !wasTransitioning && !prefersReducedMotion) {
        setIsHopping(true);
        // Durasi loncatan disesuaikan dengan tipe animasi
        const duration = animationStyle === 'slide' ? 400 : ANIMATION_GUIDELINES.CATEGORIES.QUICK.durationMs;
        const timer = setTimeout(() => setIsHopping(false), duration);
        return () => clearTimeout(timer);
      }
      prevPos.current = { x, y };
    }
    
    prevIsTransitioning.current = isTransitioning;
  }, [x, y, isTransitioning, prefersReducedMotion, animationStyle]);

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

  if (isHopping) zIndex = 100;

  // Base transition duration
  const hopDuration = ANIMATION_GUIDELINES.CATEGORIES.QUICK.duration;

  // Pertahankan shadow bawaan agar token tetap terlihat 3D
  const baseInsetShadow = isJakarta 
    ? 'inset 0 -2px 4px rgba(0,0,0,0.45)' 
    : 'inset 0 -2px 3px rgba(0,0,0,0.35)';

  const idleShadowExt = isJakarta ? '0px 6px 12px rgba(0,0,0,0.6)' : '0px 4px 6px rgba(0,0,0,0.1)';
  const hopShadowExt = isJakarta ? '0px 20px 25px rgba(0,0,0,0.6)' : '0px 15px 15px rgba(0,0,0,0.3)';

  // Konfigurasi variants berdasarkan tipe animasi yang dipilih
  const getHoppingVariant = (): import('framer-motion').TargetAndTransition => {
    switch (animationStyle) {
      case 'lerp':
        return {
          left: `${x}%`,
          top: `${y}%`,
          scale: 1,
          y: offsetY,
          x: offsetX,
          boxShadow: `${baseInsetShadow}, ${idleShadowExt}`,
          transition: { duration: hopDuration, ease: 'linear' }
        };
      case 'slide':
        return {
          left: `${x}%`,
          top: `${y}%`,
          scale: 1,
          y: offsetY,
          x: offsetX,
          boxShadow: `${baseInsetShadow}, 0px 2px 4px rgba(0,0,0,0.2)`,
          transition: { duration: 0.4, ease: 'easeInOut' }
        };
      case 'arc':
        return {
          left: `${x}%`,
          top: `${y}%`,
          scale: [1, 1.25, 1],
          y: [offsetY, offsetY - 35, offsetY],
          x: offsetX,
          boxShadow: [
            `${baseInsetShadow}, ${idleShadowExt}`, 
            `${baseInsetShadow}, ${hopShadowExt}`, 
            `${baseInsetShadow}, ${idleShadowExt}`
          ],
          transition: {
            duration: hopDuration,
            ease: 'linear',
            y: { duration: hopDuration, times: [0, 0.45, 1], ease: ['circOut', 'circIn'] },
            scale: { duration: hopDuration, times: [0, 0.45, 1], ease: ['circOut', 'circIn'] },
            boxShadow: { duration: hopDuration, times: [0, 0.45, 1], ease: ['circOut', 'circIn'] }
          }
        };
      case 'squash':
        const bounceY = isMobile ? 12 : 20;
        const bounceSettle = isMobile ? 3 : 5;
        const scaleXArray = isMobile ? [1, 0.85, 1.1, 0.95, 1] : [1, 0.7, 1.2, 0.9, 1];
        const scaleYArray = isMobile ? [1, 1.15, 0.9, 1.05, 1] : [1, 1.3, 0.8, 1.1, 1];
        return {
          left: `${x}%`,
          top: `${y}%`,
          scaleX: scaleXArray,
          scaleY: scaleYArray,
          y: [offsetY, offsetY - bounceY, offsetY + bounceSettle, offsetY],
          x: offsetX,
          boxShadow: [
            `${baseInsetShadow}, ${idleShadowExt}`, 
            `${baseInsetShadow}, ${hopShadowExt}`, 
            `${baseInsetShadow}, 0px 2px 4px rgba(0,0,0,0.4)`, 
            `${baseInsetShadow}, ${idleShadowExt}`
          ],
          transition: { duration: hopDuration, ease: 'easeInOut' }
        };
      case 'hop':
      default:
        return {
          left: `${x}%`,
          top: `${y}%`,
          scale: [1, 1.1, 0.9, 1],
          y: [offsetY, offsetY - 15, offsetY + 2, offsetY],
          x: offsetX,
          boxShadow: [
            `${baseInsetShadow}, ${idleShadowExt}`, 
            `${baseInsetShadow}, ${hopShadowExt}`, 
            `${baseInsetShadow}, 0px 2px 4px rgba(0,0,0,0.3)`, 
            `${baseInsetShadow}, ${idleShadowExt}`
          ],
          transition: { duration: hopDuration, ease: 'easeInOut' }
        };
    }
  };

  const variants: Variants = {
    idle: {
      left: `${x}%`,
      top: `${y}%`,
      rotateZ: 0,
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      y: offsetY,
      x: offsetX,
      boxShadow: idleShadowExt,
      transition: {
        left: { duration: 0.3, ease: 'easeOut' },
        top: { duration: 0.3, ease: 'easeOut' },
        x: { duration: 0.3, ease: 'easeOut' },
        y: { duration: 0.3, ease: 'easeOut' },
        scale: { duration: 0.3, ease: 'easeOut' },
        boxShadow: { duration: 0.3, ease: 'easeOut' }
      }
    },
    hopping: getHoppingVariant(),
    transitioning: {
      left: `${x}%`,
      top: `${y}%`,
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      y: offsetY,
      x: offsetX,
      rotateZ: rotation,
      boxShadow: '0px 10px 15px rgba(0,0,0,0.5)',
      transition: {
        duration: 0
      }
    }
  };

  const isStacked = totalTokens > 1;
  const sizeClasses = isStacked 
    ? 'w-2.5 h-2.5 sm:w-4 sm:h-4' 
    : 'w-4 h-4 sm:w-6 sm:h-6';
    
  const textClasses = isStacked
    ? 'text-[5px] sm:text-[8px]'
    : 'text-[8px] sm:text-xs';

  const isDefaultName = player.name.startsWith('Penjelajah ') || player.name.startsWith('Bot ');

  return (
    <motion.div 
      className="absolute w-0 h-0"
      initial={false}
      animate={isTransitioning ? 'transitioning' : (isHopping ? 'hopping' : 'idle')}
      variants={prefersReducedMotion ? undefined : variants}
      style={{ zIndex }}
    >
      {showRipple && !prefersReducedMotion && (
        <motion.div
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-gold)] pointer-events-none"
          initial={{ width: 12, height: 12, opacity: 1 }}
          animate={{ width: 44, height: 44, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ transform: 'translate(-50%, -50%)' }}
        />
      )}
      <div 
        className={`absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 ${sizeClasses} rounded-full ${isJakarta ? 'border-2' : 'border'} flex items-center justify-center ${colorClass}`}
        title={`${player.name} (Score: ${player.score})`}
      >
        {!isDefaultName && (
          <span className={`${textClasses} font-extrabold ${isJakarta ? 'text-[#fdf6e3]' : 'text-white'} leading-none`} style={isJakarta ? { textShadow: '0px 1px 2px rgba(0,0,0,0.8)' } : {}}>
            {player.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    </motion.div>
  );
}
