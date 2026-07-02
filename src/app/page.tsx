"use client";

import React, { useState } from 'react';
import GameLayout from "@/components/GameLayout";
import { MainMenu } from "@/components/ui/MainMenu";
import { Player } from '@/types/player';
import { Howler } from 'howler';

type AppState = 'splash' | 'menu' | 'game';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [players, setPlayers] = useState<Player[]>([]);

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
          className="absolute inset-0 opacity-[0.07] pointer-events-none z-0"
          style={{
            backgroundImage: 'url(/batik-pattern.png)',
            backgroundSize: '320px 320px',
            backgroundRepeat: 'repeat',
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
        <div
          className="absolute left-0 bottom-0 w-[45%] max-w-[500px] h-full pointer-events-none z-0 hidden md:block"
          style={{
            backgroundImage: 'url(/hero-map.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left bottom',
            opacity: 0.18,
            maskImage: 'linear-gradient(to right, black 30%, transparent 90%)',
            WebkitMaskImage: 'linear-gradient(to right, black 30%, transparent 90%)',
          }}
        />

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

          {/* CTA Button */}
          <button
            className="group relative px-10 py-4 font-bold text-sm uppercase tracking-widest rounded transition-all duration-300 overflow-hidden"
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
