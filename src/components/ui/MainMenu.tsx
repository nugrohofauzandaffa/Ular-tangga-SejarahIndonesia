import React, { useState, useEffect } from 'react';
import { Player } from '@/types/player';
import { AudioSettings } from './AudioSettings';
import { useAudio } from '@/contexts/AudioContext';

interface MainMenuProps {
  onStartGame: (players: Player[]) => void;
}

type GameMode = 'multiplayer' | 'solo';

export function MainMenu({ onStartGame }: MainMenuProps) {
  const [gameMode, setGameMode] = useState<GameMode>('multiplayer');
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [playerNames, setPlayerNames] = useState<string[]>(['Pemain 1', 'Pemain 2', 'Pemain 3', 'Pemain 4']);
  const { playSFX, playBGM, stopBGM } = useAudio();

  // Memutar BGM Main Menu saat komponen dimuat
  useEffect(() => {
    playBGM('menu');
    return () => stopBGM('menu');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Menyesuaikan state ketika mode berubah
  useEffect(() => {
    if (gameMode === 'solo') {
      setPlayerCount(2);
      setPlayerNames(prev => {
        const newNames = [...prev];
        newNames[1] = 'Bot (AI)';
        return newNames;
      });
    } else {
      setPlayerNames(prev => {
        // Jika namanya masih 'Bot (AI)' (belum diubah), kembalikan ke default 'Pemain 2'
        if (prev[1] === 'Bot (AI)') {
          const newNames = [...prev];
          newNames[1] = 'Pemain 2';
          return newNames;
        }
        return prev;
      });
    }
  }, [gameMode]);

  const handleNameChange = (index: number, newName: string) => {
    const newNames = [...playerNames];
    newNames[index] = newName;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    playSFX('click');
    const initialPlayers: Player[] = [];
    
    for (let i = 0; i < playerCount; i++) {
      const isBot = gameMode === 'solo' && i > 0; // Di mode solo, pemain ke-2 (index 1) adalah bot
      
      initialPlayers.push({
        id: `p${i + 1}`,
        name: playerNames[i] || (isBot ? 'Bot' : `Pemain ${i + 1}`),
        position: 1,
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        activeEffects: [],
        isBot,
      });
    }
    
    onStartGame(initialPlayers);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500 blur-3xl"></div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl z-10 w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
            Ular Tangga Sejarah
          </h1>
          <p className="text-slate-500 text-sm">Persiapkan Permainan Anda</p>
        </div>

        <div className="space-y-6">
          {/* Mode Permainan */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Mode Permainan
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => { playSFX('click'); setGameMode('multiplayer'); }}
                className={`flex-1 py-3 rounded-lg font-bold transition-all duration-200 ${
                  gameMode === 'multiplayer'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Multiplayer Local
              </button>
              <button
                onClick={() => { playSFX('click'); setGameMode('solo'); }}
                className={`flex-1 py-3 rounded-lg font-bold transition-all duration-200 ${
                  gameMode === 'solo'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Solo vs Bot
              </button>
            </div>
          </div>

          {/* Jumlah Pemain (Hanya Muncul di Mode Multiplayer) */}
          {gameMode === 'multiplayer' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Jumlah Pemain
              </label>
              <div className="flex gap-2">
                {[2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => { playSFX('click'); setPlayerCount(num); }}
                    className={`flex-1 py-2 rounded-lg font-medium transition-all duration-200 ${
                      playerCount === num
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {num} Pemain
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Konfigurasi Nama Pemain */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nama Pemain
            </label>
            {Array.from({ length: playerCount }).map((_, index) => {
              const isBot = gameMode === 'solo' && index === 1;
              
              return (
                <div key={index} className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold shrink-0">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={playerNames[index]}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    disabled={isBot}
                    placeholder={`Nama Pemain ${index + 1}`}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isBot ? 'bg-slate-100 text-slate-500 border-slate-200 font-medium' : 'bg-white border-slate-300'
                    }`}
                    maxLength={15}
                  />
                  {isBot && (
                    <span className="text-xs font-bold text-indigo-600 px-2 py-1 bg-indigo-100 rounded mr-1 shrink-0">
                      BOT
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Audio Settings */}
          <AudioSettings />

          {/* Tombol Mulai */}
          <button
            onClick={handleStart}
            className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Mulai Permainan
          </button>
        </div>
      </div>
    </div>
  );
}

