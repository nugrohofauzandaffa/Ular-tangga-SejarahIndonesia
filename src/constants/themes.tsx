import React from 'react';

export interface HeaderConfig {
  bgColor: string;
  borderColor: string;
  textColor: string;
  subtitleColor: string;
  subtitle: string;
  showGigiBalang?: boolean;
  leftOrnament?: React.ReactNode;
  rightOrnament?: React.ReactNode;
}

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  displayClass: string; // CSS class for fonts
  bgPattern: string; // Background batik or pattern CSS style
  bgOpacity: number;
  heroImage?: string;
  header: HeaderConfig;
  
  board: {
    borderColor: string;
    ringColor: string;
    gridBg: string;
    snakeGrad: { start: string; end: string };
    ladderGrad: { start: string; end: string };
    decorations?: 'classic-gold' | 'gigi-balang';
  };
  
  tiles: {
    quizIcon: React.ReactNode;
    bonusIcon: React.ReactNode;
    penaltyIcon: React.ReactNode;
    winIcon: React.ReactNode;
  };
}

// Inline SVGs for Jakarta Heritage Theme v2.0
const WhiteOndelOndelIcon = () => (
  <svg viewBox="0 0 64 64" className="w-10 h-10 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Kembang Kelapa spikes (Gold, yellow and white hair spikes) */}
    <path d="M12 20l4-8M20 16l2-10M32 14v-9M44 16l-2-10M52 20l-4-8" stroke="var(--color-gold)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M15 22l6-10M25 18l3-10M38 18l-3-10M49 22l-6-10" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 24l8-8M54 24l-8-8" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />

    {/* Face / Mask (Creamy White) */}
    <rect x="20" y="22" width="24" height="26" rx="12" fill="#fafaf9" stroke="var(--color-gold)" strokeWidth="2" />
    
    {/* Headband / Floral Crown (Gold accents) */}
    <rect x="23" y="22" width="18" height="4" fill="var(--color-gold)" rx="1" />
    <circle cx="32" cy="24" r="1.5" fill="#ef4444" />
    <circle cx="28" cy="24" r="1" fill="#ef4444" />
    <circle cx="36" cy="24" r="1" fill="#ef4444" />

    {/* Eyes (Happy arched/smiling eyes) */}
    <path d="M24 33c1-2 4-2 5 0M35 33c1-2 4-2 5 0" stroke="var(--color-navy-dark)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    
    {/* Friendly Cheeks */}
    <circle cx="25" cy="38" r="2" fill="#ef4444" opacity="0.4" />
    <circle cx="39" cy="38" r="2" fill="#ef4444" opacity="0.4" />

    {/* Gold Nose */}
    <polygon points="32,30 30,37 34,37" fill="var(--color-gold)" />

    {/* Warm Smile */}
    <path d="M26 40c2 2.5 10 2.5 12 0" stroke="var(--color-navy-dark)" strokeWidth="2" strokeLinecap="round" fill="none" />
    
    {/* Body robe details (White and Gold trim) */}
    <path d="M16 48h32v8H16z" fill="#f5f5f4" />
    <path d="M32 48l-5 8h10z" fill="var(--color-gold)" opacity="0.8" />
  </svg>
);

const RedOndelOndelIcon = () => (
  <svg viewBox="0 0 64 64" className="w-10 h-10 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Kembang Kelapa spikes (Fierce Red and Dark Blue spikes) */}
    <path d="M12 20l4-8M20 16l2-10M32 14v-9M44 16l-2-10M52 20l-4-8" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M15 22l6-10M25 18l3-10M38 18l-3-10M49 22l-6-10" stroke="var(--color-navy)" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 24l8-8M54 24l-8-8" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />

    {/* Face / Mask (Red) */}
    <rect x="20" y="22" width="24" height="26" rx="12" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />

    {/* Headband / Floral Crown (Dark Metal/Navy accents) */}
    <rect x="23" y="22" width="18" height="4" fill="#1e293b" rx="1" />
    <circle cx="32" cy="24" r="1.5" fill="var(--color-gold)" />

    {/* Eyes (Fierce circular eyes with thick brows) */}
    <ellipse cx="27" cy="32" rx="3.2" ry="2.2" fill="#ffffff" />
    <circle cx="27" cy="32" r="1.5" fill="#000000" />
    <ellipse cx="37" cy="32" rx="3.2" ry="2.2" fill="#ffffff" />
    <circle cx="37" cy="32" r="1.5" fill="#000000" />
    <path d="M23 28.5c2.5-1.5 5.5-1 6.5 0M41 28.5c-2.5-1.5-5.5-1-6.5 0" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" fill="none" />

    {/* Stern/Fierce Nose */}
    <polygon points="32,30 29.5,38 34.5,38" fill="#f59e0b" />

    {/* Stern Mustache & Mouth */}
    <path d="M25 41c3 -1.5 11 -1.5 14 0" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M28 44h8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />

    {/* Body robe details (Red and Dark trim) */}
    <path d="M16 48h32v8H16z" fill="#991b1b" />
    <path d="M32 48l-5 8h10z" fill="#1e293b" />
  </svg>
);

const PremiumMonasIcon = () => (
  <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Soft radial glow in background */}
      <radialGradient id="monasGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
      </radialGradient>
    </defs>
    
    {/* Soft Glow */}
    <circle cx="32" cy="24" r="22" fill="url(#monasGlow)" />
    
    {/* Traditional floral border decorations (Ornamen Betawi) */}
    <path d="M12 44c-2-4 2-8 4-8s8 4 6 8" stroke="var(--color-gold)" strokeWidth="0.8" fill="none" opacity="0.6" />
    <path d="M52 44c2-4-2-8-4-8s-8 4-6 8" stroke="var(--color-gold)" strokeWidth="0.8" fill="none" opacity="0.6" />

    {/* Pedestal - Tiered base steps */}
    <path d="M8 52h48v3H8z" fill="#78350f" stroke="var(--color-gold-dark)" strokeWidth="0.8" />
    <path d="M14 47h36v5H14z" fill="#b45309" stroke="var(--color-gold-dark)" strokeWidth="0.6" />
    <path d="M20 40h24v7H20z" fill="#fdfbf7" stroke="var(--color-gold-dark)" strokeWidth="0.6" />
    
    {/* Main column tower */}
    <path d="M29 16h6l2 24h-10l2-24z" fill="#ffffff" stroke="var(--color-gold-dark)" strokeWidth="0.5" />
    {/* Shadow detail on tower */}
    <path d="M32 16h3l2 24h-5z" fill="#e5e7eb" opacity="0.5" />

    {/* Platform Peak Cupola */}
    <path d="M26 16h12l-1.5-3h-9l-1.5 3z" fill="#f5f5f4" stroke="var(--color-gold-dark)" strokeWidth="0.5" />
    <path d="M28 13h8l-1-2h-6l-1 2z" fill="#d6d3d1" />

    {/* Flame of Monas (Gold & Red with pulsating layers) */}
    <path d="M32 3c-4.5 4.5-2.5 8-2.5 10.5h5c0-2.5 2-6-2.5-10.5z" fill="var(--color-gold-light)" className="animate-pulse" />
    <path d="M32 5c-2.5 2.5-1 4.5-1 6h2c0-1.5 1.5-3.5-1-6z" fill="#ef4444" />
    <circle cx="32" cy="3" r="1.5" fill="#fef08a" className="animate-ping" style={{ animationDuration: '2s' }} />
  </svg>
);

export const THEMES: Record<string, ThemeConfig> = {
  classic: {
    id: 'classic',
    name: 'Classic Sejarah',
    description: 'Tampilan orisinal dengan nuansa perkamen kuno dan motif batik tradisional Indonesia.',
    displayClass: 'font-display',
    bgPattern: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3E%3Cpath d=\'M0 0 L30 30 L60 0 M30 30 L0 60 L60 60 M0 30 L60 30 M30 0 L30 60\' fill=\'none\' stroke=\'%238b4513\' stroke-width=\'0.8\' stroke-opacity=\'0.06\'/%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'12\' fill=\'none\' stroke=\'%238b4513\' stroke-width=\'0.8\' stroke-opacity=\'0.06\'/%3E%3Ccircle cx=\'0\' cy=\'0\' r=\'12\' fill=\'none\' stroke=\'%238b4513\' stroke-width=\'0.8\' stroke-opacity=\'0.06\'/%3E%3Ccircle cx=\'60\' cy=\'0\' r=\'12\' fill=\'none\' stroke=\'%238b4513\' stroke-width=\'0.8\' stroke-opacity=\'0.06\'/%3E%3Ccircle cx=\'0\' cy=\'60\' r=\'12\' fill=\'none\' stroke=\'%238b4513\' stroke-width=\'0.8\' stroke-opacity=\'0.06\'/%3E%3Ccircle cx=\'60\' cy=\'60\' r=\'12\' fill=\'none\' stroke=\'%238b4513\' stroke-width=\'0.8\' stroke-opacity=\'0.06\'/%3E%3C/svg%3E")',
    bgOpacity: 0.07,
    heroImage: '/hero-map.png',
    header: {
      bgColor: 'var(--color-navy)',
      borderColor: 'var(--color-gold)',
      textColor: 'var(--color-gold-light)',
      subtitleColor: 'rgba(201, 168, 76, 0.6)',
      subtitle: 'Nusantara',
      showGigiBalang: false,
      leftOrnament: <span className="text-lg text-[var(--color-gold)] animate-pulse">✦</span>,
      rightOrnament: <span className="text-lg text-[var(--color-gold)] animate-pulse">✦</span>,
    },
    board: {
      borderColor: '#8B4513',
      ringColor: '#cd853f',
      gridBg: '#f4ebd0',
      snakeGrad: { start: '#ef4444', end: '#991b1b' },
      ladderGrad: { start: '#10b981', end: '#047857' },
      decorations: 'classic-gold',
    },
    tiles: {
      quizIcon: <span className="text-xl sm:text-2xl">📜</span>,
      bonusIcon: <span className="text-xl sm:text-2xl">⭐</span>,
      penaltyIcon: <span className="text-xl sm:text-2xl">⚠️</span>,
      winIcon: <span className="text-xl sm:text-2xl animate-pulse">👑</span>,
    },
  },
  'jakarta-heritage': {
    id: 'jakarta-heritage',
    name: 'Jakarta Heritage',
    description: 'Redesain bertema kebudayaan Betawi & sejarah Batavia. Menampilkan ornamen Gigi Balang dan ikon Monas.',
    displayClass: 'font-display-jakarta',
    bgPattern: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3E%3Cpath d=\'M0 30 L30 0 L60 30 L30 60 Z\' fill=\'none\' stroke=\'%230f766e\' stroke-width=\'1\' stroke-opacity=\'0.1\'/%3E%3Cpath d=\'M30 30 L30 10 M30 30 L30 50 M30 30 L10 30 M30 30 L50 30\' fill=\'none\' stroke=\'%23f97316\' stroke-width=\'1\' stroke-opacity=\'0.08\'/%3E%3C/svg%3E")',
    bgOpacity: 0.12,
    heroImage: 'jakarta-heritage',
    header: {
      bgColor: 'var(--color-parchment)',
      borderColor: 'var(--color-wood)',
      textColor: 'var(--color-navy-dark)',
      subtitleColor: 'var(--color-navy-light)',
      subtitle: 'Batavia',
      showGigiBalang: true,
      leftOrnament: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[var(--color-gold-dark)] opacity-70" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l1.5 4h-3L12 2zm-1.5 5h3l.5 12h-4l.5-12zM6 22h12v1H6v-1z" />
        </svg>
      ),
      rightOrnament: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[var(--color-gold-dark)] opacity-70" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l1.5 4h-3L12 2zm-1.5 5h3l.5 12h-4l.5-12zM6 22h12v1H6v-1z" />
        </svg>
      ),
    },
    board: {
      borderColor: '#78350f', // deep wood
      ringColor: '#d97706', // orange/amber ring
      gridBg: '#fdf6e3', // warmer parchment/cream base, less flat white
      snakeGrad: { start: '#ea580c', end: '#7c2d12' }, // orange-red Betawi snake
      ladderGrad: { start: '#0d9488', end: '#115e59' }, // teal-700 / Gigi Balang green
      decorations: 'gigi-balang',
    },
    tiles: {
      quizIcon: <span className="text-xl sm:text-2xl">📜</span>,
      bonusIcon: <WhiteOndelOndelIcon />,
      penaltyIcon: <RedOndelOndelIcon />,
      winIcon: <PremiumMonasIcon />,
    },
  },
};
