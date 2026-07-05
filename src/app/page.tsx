"use client";

import React, { useState } from 'react';
import GameLayout from "@/components/GameLayout";
import { MainMenu } from "@/components/ui/MainMenu";
import { Player } from '@/types/player';
import { Howler } from 'howler';
import { useTheme } from '@/contexts/ThemeContext';

type AppState = 'splash' | 'menu' | 'game';

// Custom inline SVG illustration for Jakarta Heritage theme
const JakartaHeroMap = () => (
  <svg viewBox="0 0 400 800" className="w-full h-full opacity-20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maskImage: 'linear-gradient(to right, black 30%, transparent 95%)', WebkitMaskImage: 'linear-gradient(to right, black 30%, transparent 95%)' }}>
    {/* Monas silhouette */}
    <g transform="translate(60, 250)">
      <path d="M120 500h160v20H120zm30-20h100v20H150zm20-30h60v30h-60zm25-150h10l8 150h-26l8-150zm-3-30h16l-3-10h-10l-3 10zm5-30c-5 5-2 10-2 14h10c0-4 3-9-2-14-.5-.5-2.5-.5-3 0z" fill="var(--color-navy)" />
    </g>
    {/* Colonial style houses & silhouette */}
    <path d="M20 780h100v20H20z" fill="var(--color-navy)" />
    <path d="M30 680h50v100H30z" fill="var(--color-navy)" opacity="0.4" />
    <polygon points="25,680 55,640 85,680" fill="var(--color-navy)" opacity="0.4" />
    
    <path d="M120 700h70v100h-70z" fill="var(--color-navy)" opacity="0.6" />
    <polygon points="110,700 155,660 200,700" fill="var(--color-navy)" opacity="0.6" />
    
    <path d="M220 720h90v80h-90z" fill="var(--color-navy)" opacity="0.5" />
    <polygon points="210,720 265,685 320,720" fill="var(--color-navy)" opacity="0.5" />
    
    {/* Traditional pinisi boat outline in the harbor */}
    <g transform="translate(15, 710) scale(0.6)">
      <path d="M50 80c10-5 30-5 45 0l5-15h-55z" fill="var(--color-gold)" opacity="0.6" />
      <line x1="72" y1="80" x2="72" y2="20" stroke="var(--color-gold)" strokeWidth="3" opacity="0.6" />
      <polygon points="72,25 35,55 72,55" fill="var(--color-gold)" opacity="0.4" />
      <polygon points="72,30 95,65 72,65" fill="var(--color-gold)" opacity="0.4" />
    </g>
  </svg>
);

// Custom inline SVG illustration for Classic theme
const ClassicHeroMap = () => (
  <svg viewBox="0 0 400 800" className="w-full h-full opacity-20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maskImage: 'linear-gradient(to right, black 30%, transparent 95%)', WebkitMaskImage: 'linear-gradient(to right, black 30%, transparent 95%)' }}>
    {/* Old style map grid lines */}
    <path d="M 0,100 L 400,100 M 0,200 L 400,200 M 0,300 L 400,300 M 0,400 L 400,400 M 0,500 L 400,500 M 0,600 L 400,600 M 0,700 L 400,700" stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.25" strokeDasharray="4 4" />
    <path d="M 100,0 L 100,800 M 200,0 L 200,800 M 300,0 L 300,800" stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.25" strokeDasharray="4 4" />
    
    {/* Compass Rose */}
    <g transform="translate(100, 250) scale(0.8)">
      <circle cx="0" cy="0" r="24" stroke="var(--color-gold)" strokeWidth="1" opacity="0.4" />
      <path d="M 0,-40 L 5,-10 L 15,-15 L 10,-5 L 40,0 L 10,5 L 15,15 L 5,10 L 0,40 L -5,10 L -15,15 L -10,5 L -40,0 L -10,-5 L -15,-15 L -5,-10 Z" fill="var(--color-gold)" opacity="0.25" stroke="var(--color-gold-dark)" strokeWidth="0.5" />
      <text x="-4" y="-45" fill="var(--color-gold-dark)" fontSize="10" fontWeight="bold" opacity="0.5">N</text>
    </g>
    
    {/* Stylized island contours */}
    <path d="M-50,150 C50,120 120,200 150,220 C180,240 220,230 250,280 C270,310 240,360 280,380 C320,400 380,390 420,430 C450,460 430,520 480,560" stroke="var(--color-gold)" strokeWidth="1.5" opacity="0.25" strokeDasharray="3 1" fill="none" />
    <path d="M50,480 C100,450 180,490 220,510 C260,530 310,510 340,550 C370,590 350,650 390,670 C430,690 470,720 510,760" stroke="var(--color-gold)" strokeWidth="1.5" opacity="0.2" strokeDasharray="3 1" fill="none" />
    
    {/* Old Sailing Vessel */}
    <g transform="translate(150, 480) scale(0.6)">
      <path d="M 10,50 C 30,50 60,45 75,55 C 80,57 85,57 90,50 L 95,30 C 70,30 20,35 5,40 Z" fill="var(--color-gold)" opacity="0.3" stroke="var(--color-gold-dark)" strokeWidth="0.5" />
      <line x1="30" y1="40" x2="30" y2="10" stroke="var(--color-gold)" strokeWidth="2.5" opacity="0.4" />
      <line x1="60" y1="35" x2="60" y2="5" stroke="var(--color-gold)" strokeWidth="2" opacity="0.4" />
      <path d="M 30,12 C 15,22 15,35 30,37 Z" fill="var(--color-gold-light)" opacity="0.25" />
      <path d="M 60,7 C 48,15 48,27 60,32 Z" fill="var(--color-gold-light)" opacity="0.25" />
    </g>
  </svg>
);

export default function Home() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [players, setPlayers] = useState<Player[]>([]);
  const { currentTheme } = useTheme();

  const handleEnterMenu = () => {
    // Membuka blokir audio (browser autoplay policy) dengan interaksi user
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume();
    }
    setAppState('menu');
  };

  const handleStartGame = (initialPlayers: Player[]) => {
    setPlayers(initialPlayers);
    setAppState('game');
  };

  const handleBackToMenu = () => {
    setAppState('menu');
    setPlayers([]);
  };

  if (appState === 'splash') {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen cursor-pointer relative overflow-hidden select-none"
        style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-body)' }}
        onClick={handleEnterMenu}
      >
        {/* Batik pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: currentTheme.bgPattern,
            backgroundSize: currentTheme.id === 'jakarta-heritage' ? '60px 60px' : '320px 320px',
            backgroundRepeat: 'repeat',
            opacity: currentTheme.bgOpacity,
          }}
        />

        {/* Vignette edges */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(30,58,95,0.18) 100%)',
          }}
        />

        {/* Hero map illustration — left side, blended */}
        {currentTheme.id === 'jakarta-heritage' ? (
          <div className="absolute left-0 bottom-0 w-[45%] max-w-[500px] h-full pointer-events-none z-0 hidden md:block">
            <JakartaHeroMap />
          </div>
        ) : (
          <div className="absolute left-0 bottom-0 w-[45%] max-w-[500px] h-full pointer-events-none z-0 hidden md:block">
            <ClassicHeroMap />
          </div>
        )}

        {/* Top decorative rule */}

        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10 opacity-50">
          <div className="h-px w-16 md:w-32" style={{ backgroundColor: 'var(--color-gold)' }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: 'var(--color-gold)' }} />
          <div className="h-px w-16 md:w-32" style={{ backgroundColor: 'var(--color-gold)' }} />
        </div>

        {/* Main content */}
        <div className="z-10 text-center px-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-6 duration-700">

          {/* Keterangan genre */}
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em] mb-6"
            style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-display)' }}
          >
            Game Edukasi Sejarah Indonesia
          </p>

          {/* Title */}
          <h1
            className="text-5xl md:text-7xl font-black mb-4 leading-tight"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-navy)',
              textShadow: '0 2px 0 rgba(201,168,76,0.3)',
            }}
          >
            Ular Tangga
          </h1>
          <h2
            className="text-2xl md:text-4xl font-bold mb-2"
            style={{
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold-light), var(--color-gold-dark))',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer 3s linear infinite',
            }}
          >
            Sejarah Nusantara
          </h2>

          {/* Divider ornament */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-px w-12 md:w-20" style={{ backgroundColor: 'var(--color-wood)' }} />
            <span style={{ color: 'var(--color-gold)', fontSize: '1.25rem' }}>✦</span>
            <div className="h-px w-12 md:w-20" style={{ backgroundColor: 'var(--color-wood)' }} />
          </div>

          {/* Tagline */}
          <p
            className="text-base md:text-lg mb-10 max-w-sm leading-relaxed"
            style={{ color: 'var(--color-navy-light)', fontFamily: 'var(--font-body)' }}
          >
            Jelajahi perjalanan bangsa, taklukkan setiap petak, dan buktikan pengetahuanmu tentang sejarah Indonesia.
          </p>

          <button
            className="group relative px-10 py-4 font-bold text-sm uppercase tracking-widest rounded transition-all duration-300 overflow-hidden animate-pulse-glow"
            style={{
              fontFamily: 'var(--font-display)',
              backgroundColor: 'var(--color-navy)',
              color: 'var(--color-gold-light)',
              border: '2px solid var(--color-gold)',
              boxShadow: '0 4px 24px rgba(30,58,95,0.25), inset 0 1px 0 rgba(201,168,76,0.2)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-navy-dark)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(30,58,95,0.4), 0 0 20px rgba(201,168,76,0.2), inset 0 1px 0 rgba(201,168,76,0.3)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-navy)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 24px rgba(30,58,95,0.25), inset 0 1px 0 rgba(201,168,76,0.2)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            Mulai Petualangan
          </button>

          {/* Tap hint mobile */}
          <p className="mt-5 text-xs opacity-40 md:hidden" style={{ color: 'var(--color-navy)' }}>
            Ketuk di mana saja untuk memulai
          </p>
        </div>

        {/* Bottom decorative rule */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10 opacity-50">
          <div className="h-px w-16 md:w-32" style={{ backgroundColor: 'var(--color-gold)' }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: 'var(--color-gold)' }} />
          <div className="h-px w-16 md:w-32" style={{ backgroundColor: 'var(--color-gold)' }} />
        </div>
      </div>
    );
  }


  if (appState === 'menu') {
    return <MainMenu onStartGame={handleStartGame} />;
  }

  return <GameLayout initialPlayers={players} onMainMenu={handleBackToMenu} />;
}
