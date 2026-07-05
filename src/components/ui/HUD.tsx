import React, { useState } from 'react';
import { Player } from '@/types/player';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface HUDProps {
  activePlayer: Player | null;
  players?: Player[];
  gameStatus?: string;
  layout?: 'desktop' | 'mobile';
}

export const HUD: React.FC<HUDProps> = ({ activePlayer, players = [], gameStatus = 'playing', layout = 'desktop' }) => {
  useTheme();
  const [showMobileLeaderboard, setShowMobileLeaderboard] = useState(false);

  if (!activePlayer) {
    return (
      <div className="text-center text-slate-400 p-4">
        Menunggu pemain...
      </div>
    );
  }

  const renderEffects = () => {
    if (!activePlayer.activeEffects || activePlayer.activeEffects.length === 0) return null;
    return (
      <div className="flex gap-1 ml-2">
        {activePlayer.activeEffects.map((effect, idx) => {
          let icon = '✨';
          if (effect.type === 'AntiSnake') icon = '🛡️';
          if (effect.type === 'AbsoluteRoll') icon = '⛓️';
          if (effect.type === 'Silence') icon = '🚫';
          if (effect.type === 'DecreasedRoll') icon = '📉';
          return (
            <span key={idx} className="text-[10px] font-bold bg-[var(--color-cream-dark)]/40 text-[var(--color-navy-dark)] border border-[var(--color-gold)]/20 rounded-full px-1.5 py-0.5" title={effect.type}>
              {icon}
            </span>
          );
        })}
      </div>
    );
  };

  // Logic untuk Leaderboard
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.position - a.position;
  });

  const getRankMedal = (index: number) => {
    if (index === 0) return '👑';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}th`;
  };

  const getPlayerRankString = (playerId: string) => {
    const index = sortedPlayers.findIndex(p => p.id === playerId);
    if (index === 0) return '👑 1st';
    if (index === 1) return '🥈 2nd';
    if (index === 2) return '🥉 3rd';
    return `${index + 1}th`;
  };

  const renderLeaderboardList = () => (
    <div className="flex flex-col p-2 gap-1 bg-transparent">
      {sortedPlayers.map((player, index) => {
        const isActive = player.id === activePlayer.id;
        return (
          <div 
            key={player.id} 
            className={`flex items-center justify-between p-2.5 rounded-lg transition-all duration-200 border ${
              isActive 
                ? 'shadow-sm' 
                : 'bg-[var(--color-parchment)]/70 border-[var(--color-cream-dark)]/30 hover:bg-[var(--color-cream)]/10'
            }`}
            style={isActive ? {
              backgroundColor: 'var(--color-cream)',
              borderColor: 'var(--color-gold)',
            } : undefined}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-6 text-center font-bold text-slate-600 shrink-0">
                {getRankMedal(index)}
              </div>
              <span 
                className={`font-semibold truncate text-sm`}
                style={{ color: isActive ? 'var(--color-navy-dark)' : 'var(--color-navy-light)' }}
              >
                {player.name}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm shrink-0 pl-2">
              <span className="text-slate-500 font-medium" title="Posisi">P{player.position}</span>
              <div 
                className="flex items-center justify-end w-12 px-2 py-0.5 rounded font-bold border transition-all duration-300"
                style={{
                  backgroundColor: 'var(--color-cream-dark)',
                  borderColor: 'var(--color-gold-light)',
                  color: 'var(--color-navy-dark)'
                }}
              >
                {player.score}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (layout === 'mobile') {
    return (
      <div className="flex-1 flex flex-col justify-center pr-2">
        <button 
          onClick={() => setShowMobileLeaderboard(true)}
          className="flex flex-col text-left focus:outline-none w-full p-2 -ml-2 rounded-lg active:bg-black/5 transition-colors"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <span 
                className="text-sm font-semibold truncate"
                style={{ color: 'var(--color-navy-dark)', fontFamily: 'var(--font-body)' }}
              >
                Giliran: {activePlayer.name}
              </span>
              {renderEffects()}
            </div>
            <span className="text-[10px] font-bold text-[var(--color-navy)] border border-[var(--color-gold)] bg-[var(--color-cream)] px-2 py-1 rounded-full whitespace-nowrap shadow-sm ml-2">
              Klasemen 🏆
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
            <span className="font-bold" style={{ color: 'var(--color-gold-dark)' }}>{getPlayerRankString(activePlayer.id)}</span>
            <span>&bull;</span>
            <span>Skor: {activePlayer.score}</span>
            <span>&bull;</span>
            <span>Petak {activePlayer.position}</span>
          </div>
        </button>

        <AnimatePresence>
          {showMobileLeaderboard && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="bg-[var(--color-parchment)] rounded-2xl shadow-2xl border-4 w-full max-w-sm overflow-hidden"
                style={{ borderColor: 'var(--color-wood)' }}
              >
                <div 
                  className="px-4 py-4 border-b flex justify-between items-center bg-[var(--color-navy)]"
                  style={{ borderColor: 'var(--color-gold)' }}
                >
                  <h3 
                    className="text-sm font-bold uppercase tracking-wider text-[var(--color-cream)]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Klasemen Sementara
                  </h3>
                  <button 
                    onClick={() => setShowMobileLeaderboard(false)}
                    className="text-[var(--color-cream)] hover:text-white bg-white/10 rounded-full w-7 h-7 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-2" style={{ backgroundColor: 'var(--color-cream)/30' }}>
                  {renderLeaderboardList()}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div 
      className="bg-[var(--color-parchment)] rounded-xl shadow-md border-2 overflow-hidden flex flex-col transition-all duration-300"
      style={{ borderColor: 'var(--color-cream-dark)' }}
    >
      {/* Header Status */}
      <div 
        className="text-white p-3 text-center transition-all duration-300"
        style={{ backgroundColor: 'var(--color-navy)' }}
      >
        <h2 
          className="font-bold text-sm uppercase tracking-wider"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}
        >
          {gameStatus === 'finished' ? 'Permainan Selesai' : 'Informasi Giliran'}
        </h2>
      </div>
      
      {/* Detail Pemain Aktif */}
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-xl shrink-0 transition-all duration-300"
            style={{ 
              backgroundColor: 'var(--color-cream)', 
              borderColor: 'var(--color-gold)', 
              color: 'var(--color-navy-dark)' 
            }}
          >
            {activePlayer.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Pemain Aktif</span>
            <div className="flex items-center">
              <span 
                className="text-lg font-bold truncate"
                style={{ color: 'var(--color-navy-dark)' }}
              >
                {activePlayer.name}
              </span>
            </div>
          </div>
        </div>
        
        {activePlayer.activeEffects && activePlayer.activeEffects.length > 0 && (
          <div 
            className="rounded-lg p-2 border flex items-center justify-center transition-all duration-300"
            style={{ 
              backgroundColor: 'var(--color-cream)/10', 
              borderColor: 'var(--color-gold-light)/40' 
            }}
          >
            <span 
              className="text-xs font-semibold mr-2"
              style={{ color: 'var(--color-navy)' }}
            >
              Status:
            </span>
            {renderEffects()}
          </div>
        )}
      </div>

      {/* Klasemen (Leaderboard) Panel */}
      <div 
        className="border-t transition-all duration-300"
        style={{ 
          borderColor: 'var(--color-cream-dark)/50',
          backgroundColor: 'var(--color-cream)/30'
        }}
      >
        <div 
          className="px-4 py-3 border-b"
          style={{ borderColor: 'var(--color-cream-dark)/40' }}
        >
          <h3 
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--color-navy-light)', fontFamily: 'var(--font-display)' }}
          >
            Klasemen Sementara
          </h3>
        </div>
        {renderLeaderboardList()}
      </div>
    </div>
  );
};

