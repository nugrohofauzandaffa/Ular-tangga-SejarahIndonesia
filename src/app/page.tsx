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
        className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white cursor-pointer relative overflow-hidden"
        onClick={handleEnterMenu}
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500 blur-3xl animate-pulse"></div>
        </div>
        <div className="z-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400 mb-6 drop-shadow-sm">
            Ular Tangga Sejarah
          </h1>
          <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-md mx-auto leading-relaxed px-4">
            Jelajahi waktu, pelajari pahlawan bangsa, dan jadilah Ahli Sejarah Kuno!
          </p>
          <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-bold text-white tracking-widest uppercase transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Ketuk Untuk Memulai
          </button>
        </div>
      </div>
    );
  }

  if (appState === 'menu') {
    return <MainMenu onStartGame={handleStartGame} />;
  }

  return <GameLayout initialPlayers={players} onMainMenu={handleBackToMenu} />;
}
