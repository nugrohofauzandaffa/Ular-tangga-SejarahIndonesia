import React, { useState, useEffect } from 'react';
import { Player } from '@/types/player';
import { AudioSettings } from './AudioSettings';
import { useAudio } from '@/contexts/AudioContext';
import { ThemeSelector } from './ThemeSelector';
import { useTheme } from '@/contexts/ThemeContext';


interface MainMenuProps {
  onStartGame: (players: Player[]) => void;
}

type GameMode = 'multiplayer' | 'solo';

const PLAYER_COLORS = [
  { label: 'Biru',   bg: '#3b82f6', border: '#1d4ed8' },
  { label: 'Merah',  bg: '#ef4444', border: '#b91c1c' },
  { label: 'Hijau',  bg: '#10b981', border: '#047857' },
  { label: 'Kuning', bg: '#f59e0b', border: '#b45309' },
];

export function MainMenu({ onStartGame }: MainMenuProps) {
  const [gameMode, setGameMode] = useState<GameMode>('multiplayer');
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [playerNames, setPlayerNames] = useState<string[]>(['Pemain 1', 'Pemain 2', 'Pemain 3', 'Pemain 4']);
  const { playSFX, playBGM, stopBGM } = useAudio();
  const { currentTheme } = useTheme();

  useEffect(() => {
    playBGM('menu');
    return () => stopBGM('menu');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGameModeChange = (mode: GameMode) => {
    setGameMode(mode);
    if (mode === 'solo') {
      setPlayerCount(2);
      setPlayerNames(prev => {
        const n = [...prev];
        n[1] = 'Bot (AI)';
        return n;
      });
    } else {
      setPlayerNames(prev => {
        if (prev[1] === 'Bot (AI)') {
          const n = [...prev];
          n[1] = 'Pemain 2';
          return n;
        }
        return prev;
      });
    }
  };

  const handleNameChange = (index: number, value: string) => {
    const n = [...playerNames];
    n[index] = value;
    setPlayerNames(n);
  };

  const handleStart = () => {
    playSFX('click');
    const initialPlayers: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
      const isBot = gameMode === 'solo' && i > 0;
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
    <div
      className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden p-4"
      style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-body)' }}
    >
      {/* Dynamic pattern background */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={{
          backgroundImage: currentTheme.bgPattern,
          backgroundSize: currentTheme.id === 'jakarta-heritage' ? '60px 60px' : '280px 280px',
          backgroundRepeat: 'repeat',
          opacity: currentTheme.bgOpacity,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(30,58,95,0.12) 100%)' }}
      />

      {/* Card Utama */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl transition-all duration-300"
        style={{
          border: '2px solid var(--color-wood)',
          boxShadow: '0 8px 48px rgba(30,58,95,0.18), 0 2px 0 var(--color-gold)',
        }}
      >
        {/* Card Header with optional Gigi Balang trim */}
        <div
          className={`px-8 py-6 text-center relative overflow-hidden transition-all duration-300 ${
            currentTheme.id === 'jakarta-heritage' ? 'gigi-balang-top pt-8' : ''
          }`}
          style={{ backgroundColor: 'var(--color-navy)' }}
        >

          {/* Subtle shine */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: 'linear-gradient(135deg, rgba(201,168,76,0.3) 0%, transparent 50%)',
            }}
          />
          <p
            className="text-xs uppercase tracking-[0.2em] mb-1 relative z-10"
            style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-display)' }}
          >
            Persiapkan Ekspedisi
          </p>
          <h1
            className="text-2xl font-black relative z-10"
            style={{ color: 'var(--color-cream)', fontFamily: 'var(--font-display)' }}
          >
            Ular Tangga Sejarah
          </h1>
          {/* Gold underline */}
          <div
            className="mx-auto mt-3 h-px w-24 relative z-10"
            style={{ background: 'linear-gradient(to right, transparent, var(--color-gold), transparent)' }}
          />
        </div>

        {/* Card Body */}
        <div
          className="px-8 py-6 space-y-6"
          style={{ backgroundColor: 'var(--color-parchment)' }}
        >
          {/* Mode Permainan */}
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: 'var(--color-navy)', fontFamily: 'var(--font-display)' }}
            >
              Mode Permainan
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['multiplayer', 'solo'] as GameMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => { playSFX('click'); handleGameModeChange(mode); }}
                  className="py-3 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:shadow-md active:scale-95"
                  style={gameMode === mode ? {
                    backgroundColor: 'var(--color-navy)',
                    color: 'var(--color-gold-light)',
                    border: '2px solid var(--color-gold)',
                    boxShadow: '0 4px 12px rgba(30,58,95,0.25)',
                    fontFamily: 'var(--font-display)',
                  } : {
                    backgroundColor: 'var(--color-cream)',
                    color: 'var(--color-navy)',
                    border: '2px solid var(--color-cream-dark)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {mode === 'multiplayer' ? '👥 Multiplayer' : '🤖 Solo vs Bot'}
                </button>
              ))}
            </div>
          </div>

          {/* Jumlah Pemain */}
          {gameMode === 'multiplayer' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: 'var(--color-navy)', fontFamily: 'var(--font-display)' }}
              >
                Jumlah Pemain
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[2, 3, 4].map(num => (
                  <button
                    key={num}
                    onClick={() => { playSFX('click'); setPlayerCount(num); }}
                    className="py-2.5 rounded-lg font-bold text-sm transition-all duration-200 cursor-pointer hover:scale-[1.03] active:scale-95"
                    style={playerCount === num ? {
                      backgroundColor: 'var(--color-navy)',
                      color: 'var(--color-gold-light)',
                      border: '2px solid var(--color-gold)',
                      boxShadow: '0 4px 10px rgba(30,58,95,0.2)',
                    } : {
                      backgroundColor: 'var(--color-cream)',
                      color: 'var(--color-navy)',
                      border: '2px solid var(--color-cream-dark)',
                    }}
                  >
                    {num} Pemain
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nama Pemain */}
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: 'var(--color-navy)', fontFamily: 'var(--font-display)' }}
            >
              Penjelajah
            </label>
            <div className="space-y-2">
              {Array.from({ length: playerCount }).map((_, i) => {
                const isBot = gameMode === 'solo' && i > 0;
                const color = PLAYER_COLORS[i];
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 border-2 transition-all duration-300 focus-within:border-[var(--color-gold)] focus-within:shadow-md"
                    style={{
                      backgroundColor: 'var(--color-cream)',
                      borderColor: 'var(--color-cream-dark)',
                    }}
                  >
                    {/* Color dot */}
                    <div
                      className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center"
                      style={{
                        backgroundColor: color.bg,
                        border: `2px solid ${color.border}`,
                        boxShadow: `0 2px 6px ${color.bg}60`,
                      }}
                    >
                      <span className="text-[10px] font-black text-white">{i + 1}</span>
                    </div>

                    <input
                      type="text"
                      value={playerNames[i]}
                      onChange={e => handleNameChange(i, e.target.value)}
                      disabled={isBot}
                      placeholder={`Nama Pemain ${i + 1}`}
                      className="flex-1 text-sm font-semibold bg-transparent border-none outline-none min-w-0 placeholder:italic placeholder:opacity-50"
                      style={{ color: 'var(--color-navy-dark)' }}
                      maxLength={15}
                    />

                    {isBot && (
                      <span
                        className="text-[10px] font-black uppercase px-2 py-1 rounded shrink-0"
                        style={{
                          backgroundColor: 'var(--color-navy)',
                          color: 'var(--color-gold-light)',
                        }}
                      >
                        BOT
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Theme Selector */}
          <ThemeSelector />

          {/* Audio Settings */}
          <AudioSettings />
        </div>


        {/* Card Footer / CTA */}
        <div
          className="px-8 py-5"
          style={{
            backgroundColor: 'var(--color-cream-dark)',
            borderTop: '1px solid var(--color-wood)',
          }}
        >
          <button
            onClick={handleStart}
            className="w-full py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest transition-all duration-200 active:scale-[0.98]"
            style={{
              fontFamily: 'var(--font-display)',
              backgroundColor: 'var(--color-navy)',
              color: 'var(--color-gold-light)',
              border: '2px solid var(--color-gold)',
              boxShadow: '0 4px 20px rgba(30,58,95,0.3), inset 0 1px 0 rgba(201,168,76,0.2)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-navy-dark)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-navy)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            ✦ Mulai Permainan ✦
          </button>
        </div>
      </div>
    </div>
  );
}
