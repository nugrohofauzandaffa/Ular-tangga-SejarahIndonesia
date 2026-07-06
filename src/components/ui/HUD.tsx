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
  const { currentTheme } = useTheme();
  const [showMobileLeaderboard, setShowMobileLeaderboard] = useState(false);
  const isJakarta = currentTheme.id === 'jakarta-heritage';

  if (!activePlayer) {
    return (
      <div className="text-center text-slate-400 p-4">
        Menunggu pemain...
      </div>
    );
  }

  const getEffectIcon = (type: string) => {
    switch(type) {
      case 'AntiSnake': return '🛡️';
      case 'AbsoluteRoll': return '⛓️';
      case 'Silence': return '🚫';
      case 'DecreasedRoll': return '📉';
      case 'DoubleRoll': return '🎲';
      case 'StealPoint': return '🥷';
      case 'Cendekiawan': return '📜';
      case 'MesinWaktu': return '🕰️';
      case 'AmnesiaSejarah': return '⏪';
      case 'PajakKolonial': return '🪙';
      case 'PhobiaTangga': return '🚧';
      default: return '✨';
    }
  };

  const renderPlayerEffects = (player: Player) => {
    if (!player.activeEffects || player.activeEffects.length === 0) return null;
    return (
      <div className="flex gap-1 ml-2">
        {player.activeEffects.map((effect, idx) => (
          <span key={idx} className="relative text-[10px] font-bold bg-[var(--color-cream-dark)]/40 text-[var(--color-navy-dark)] border border-[var(--color-gold)]/20 rounded-full px-1.5 py-0.5" title={effect.type}>
            {getEffectIcon(effect.type)}
            {/* [EXPERIMENT: Stacking System] Badge untuk durasi > 1 */}
            {effect.duration > 1 && (
              <span className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[7px] leading-none rounded-full w-3 h-3 flex items-center justify-center font-bold shadow-sm border border-[var(--color-parchment)]">
                {effect.duration}
              </span>
            )}
          </span>
        ))}
      </div>
    );
  };

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
    <div className="flex flex-col p-2 gap-2 bg-transparent">
      {sortedPlayers.map((player, index) => {
        const isActive = player.id === activePlayer.id;
        return (
          <div 
            key={player.id} 
            className={`flex items-center justify-between p-2.5 rounded-lg transition-all duration-300 border ${
              isActive 
                ? 'shadow-md scale-[1.02]' 
                : 'bg-[var(--color-parchment)]/80 border-[var(--color-cream-dark)]/40 hover:bg-[var(--color-cream)]/20'
            }`}
            style={isActive ? {
              backgroundColor: 'var(--color-cream)',
              borderColor: 'var(--color-gold)',
              boxShadow: isJakarta ? '0 4px 12px rgba(249, 115, 22, 0.15), inset 0 0 0 1px var(--color-gold-light)' : undefined
            } : undefined}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-6 text-center font-bold text-slate-600 shrink-0 drop-shadow-sm">
                {getRankMedal(index)}
              </div>
              <span 
                className={`font-bold truncate text-sm`}
                style={{ color: isActive ? 'var(--color-navy-dark)' : 'var(--color-navy-light)' }}
              >
                {player.name}
              </span>
              {renderPlayerEffects(player)}
            </div>
            <div className="flex items-center gap-3 text-sm shrink-0 pl-2">
              <span className="text-slate-500 font-medium" title="Posisi">P{player.position}</span>
              <div 
                className="flex items-center justify-end w-12 px-2 py-0.5 rounded font-bold border transition-all duration-300 shadow-inner"
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

  // Styling khusus Jakarta untuk layout utama HUD
  const jakartaHUDContainerClass = isJakarta 
    ? "bg-[#fdf6e3] rounded-xl shadow-[0_8px_30px_rgba(120,53,15,0.15)] border-4 overflow-hidden flex flex-col transition-all duration-300 relative shrink-0"
    : "bg-[var(--color-parchment)] rounded-xl shadow-md border-2 overflow-hidden flex flex-col transition-all duration-300 shrink-0";

  const jakartaHUDContainerStyle = isJakarta 
    ? { 
        borderColor: 'var(--color-wood)',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d97706\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")'
      }
    : { borderColor: 'var(--color-cream-dark)' };

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
              {renderPlayerEffects(activePlayer)}
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
                className={isJakarta ? "bg-[#fdf6e3] rounded-2xl shadow-2xl border-[6px] w-full max-w-sm overflow-hidden" : "bg-[var(--color-parchment)] rounded-2xl shadow-2xl border-4 w-full max-w-sm overflow-hidden"}
                style={{ 
                  borderColor: 'var(--color-wood)',
                  backgroundImage: isJakarta ? 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d97706\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' : undefined
                }}
              >
                <div 
                  className={`px-4 py-4 border-b flex justify-between items-center ${isJakarta ? 'bg-[#78350f] gigi-balang-bottom pb-6' : 'bg-[var(--color-navy)]'}`}
                  style={{ borderColor: 'var(--color-gold)' }}
                >
                  <h3 
                    className="text-sm font-bold uppercase tracking-wider text-[var(--color-cream)] drop-shadow-md"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Klasemen Sementara
                  </h3>
                  <button 
                    onClick={() => setShowMobileLeaderboard(false)}
                    className="text-[var(--color-cream)] hover:text-white bg-white/10 rounded-full w-7 h-7 flex items-center justify-center z-10 relative"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-2" style={{ backgroundColor: isJakarta ? 'transparent' : 'var(--color-cream)/30' }}>
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
    <div className={jakartaHUDContainerClass} style={jakartaHUDContainerStyle}>
      {/* Ornamen Pojok Jakarta */}
      {isJakarta && (
        <>
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 rounded-tl-lg pointer-events-none z-10 opacity-50" style={{ borderColor: 'var(--color-gold-dark)' }}></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 rounded-tr-lg pointer-events-none z-10 opacity-50" style={{ borderColor: 'var(--color-gold-dark)' }}></div>
        </>
      )}

      {/* Header Status */}
      <div 
        className={`text-white p-3 text-center transition-all duration-300 relative ${isJakarta ? 'gigi-balang-bottom pb-5 bg-[#78350f] border-b-2' : ''}`}
        style={{ backgroundColor: isJakarta ? '#78350f' : 'var(--color-navy)', borderColor: isJakarta ? 'var(--color-gold)' : undefined }}
      >
        <h2 
          className={`font-bold text-sm uppercase tracking-wider ${isJakarta ? 'drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]' : ''}`}
          style={{ fontFamily: 'var(--font-display)', color: isJakarta ? 'var(--color-gold-light)' : 'var(--color-cream)' }}
        >
          {gameStatus === 'finished' ? 'Permainan Selesai' : 'Informasi Giliran'}
        </h2>
      </div>
      
      {/* Detail Pemain Aktif */}
      <div className="p-5 flex flex-col gap-4 relative z-0">
        <div className="flex items-center gap-4">
          <div 
            className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-black text-2xl shrink-0 transition-all duration-300 ${isJakarta ? 'shadow-[0_4px_10px_rgba(217,119,6,0.3)]' : ''}`}
            style={{ 
              backgroundColor: 'var(--color-cream)', 
              borderColor: 'var(--color-gold)', 
              color: 'var(--color-navy-dark)' 
            }}
          >
            {activePlayer.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Pemain Aktif</span>
            <div className="flex items-center">
              <span 
                className="text-xl font-black truncate drop-shadow-sm"
                style={{ color: 'var(--color-navy-dark)' }}
              >
                {activePlayer.name}
              </span>
            </div>
          </div>
        </div>
        
        {activePlayer.activeEffects && activePlayer.activeEffects.length > 0 && (
          <div 
            className={`rounded-lg p-2 border flex items-center justify-center transition-all duration-300 ${isJakarta ? 'shadow-inner' : ''}`}
            style={{ 
              backgroundColor: isJakarta ? 'rgba(253, 211, 77, 0.15)' : 'var(--color-cream)/10', 
              borderColor: isJakarta ? 'var(--color-gold)' : 'var(--color-gold-light)/40' 
            }}
          >
            <span 
              className="text-xs font-bold mr-2 uppercase tracking-wide"
              style={{ color: 'var(--color-navy)' }}
            >
              Status:
            </span>
            {renderPlayerEffects(activePlayer)}
          </div>
        )}
      </div>

      {/* Klasemen (Leaderboard) Panel */}
      <div 
        className="border-t transition-all duration-300 flex-1 flex flex-col"
        style={{ 
          borderColor: isJakarta ? 'var(--color-gold)' : 'var(--color-cream-dark)/50',
          backgroundColor: isJakarta ? 'rgba(255,255,255,0.4)' : 'var(--color-cream)/30'
        }}
      >
        <div 
          className="px-4 py-3 border-b flex justify-between items-center"
          style={{ borderColor: isJakarta ? 'var(--color-gold-light)' : 'var(--color-cream-dark)/40' }}
        >
          <h3 
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--color-navy-dark)', fontFamily: 'var(--font-display)' }}
          >
            Klasemen Sementara
          </h3>
          {isJakarta && (
            <span className="text-[10px] text-[var(--color-gold-dark)]">🏆</span>
          )}
        </div>
        <div className="flex-1 pb-2">
          {renderLeaderboardList()}
        </div>
      </div>
    </div>
  );
};
