import React from 'react';
import { Player } from '@/types/player';

interface HUDProps {
  activePlayer: Player | null;
  players?: Player[];
  gameStatus?: string;
  layout?: 'desktop' | 'mobile';
}

export const HUD: React.FC<HUDProps> = ({ activePlayer, players = [], gameStatus = 'playing', layout = 'desktop' }) => {
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
            <span key={idx} className="text-xs bg-slate-200 rounded-full px-1.5 py-0.5" title={effect.type}>
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

  if (layout === 'mobile') {
    return (
      <div className="flex-1 flex flex-col justify-center pr-2">
        <div className="flex items-center">
          <span className="text-sm font-semibold truncate text-slate-800">
            Giliran: {activePlayer.name}
          </span>
          {renderEffects()}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
          <span className="text-blue-600 font-bold">{getPlayerRankString(activePlayer.id)}</span>
          <span>&bull;</span>
          <span>Skor: {activePlayer.score}</span>
          <span>&bull;</span>
          <span>Petak {activePlayer.position}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {/* Header Status */}
      <div className="bg-slate-800 text-white p-3 text-center">
        <h2 className="font-bold text-sm uppercase tracking-wider">
          {gameStatus === 'finished' ? 'Permainan Selesai' : 'Informasi Giliran'}
        </h2>
      </div>
      
      {/* Detail Pemain Aktif */}
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center text-blue-700 font-bold text-xl shrink-0">
            {activePlayer.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Pemain Aktif</span>
            <div className="flex items-center">
              <span className="text-lg font-bold text-slate-800 truncate">{activePlayer.name}</span>
            </div>
          </div>
        </div>
        
        {activePlayer.activeEffects && activePlayer.activeEffects.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-2 border border-blue-100 flex items-center justify-center">
            <span className="text-xs text-blue-700 font-semibold mr-2">Status:</span>
            {renderEffects()}
          </div>
        )}
      </div>

      {/* Klasemen (Leaderboard) Panel */}
      <div className="border-t border-slate-200 bg-slate-50">
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Klasemen Sementara</h3>
        </div>
        <div className="flex flex-col p-2 gap-1">
          {sortedPlayers.map((player, index) => {
            const isActive = player.id === activePlayer.id;
            return (
              <div 
                key={player.id} 
                className={`flex items-center justify-between p-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-100 border border-blue-300 shadow-sm' 
                    : 'bg-white border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-6 text-center font-bold text-slate-600 shrink-0">
                    {getRankMedal(index)}
                  </div>
                  <span className={`font-semibold truncate text-sm ${isActive ? 'text-blue-800' : 'text-slate-700'}`}>
                    {player.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm shrink-0 pl-2">
                  <span className="text-slate-500 font-medium" title="Posisi">P{player.position}</span>
                  <div className="flex items-center justify-end w-12 bg-slate-100 px-2 py-0.5 rounded text-blue-700 font-bold border border-slate-200">
                    {player.score}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
