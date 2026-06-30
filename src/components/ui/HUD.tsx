import React from 'react';
import { Player } from '@/types/player';

interface HUDProps {
  activePlayer: Player | null;
  gameStatus?: string;
  layout?: 'desktop' | 'mobile';
}

export const HUD: React.FC<HUDProps> = ({ activePlayer, gameStatus = 'playing', layout = 'desktop' }) => {
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

  if (layout === 'mobile') {
    return (
      <div className="flex-1 flex flex-col justify-center pr-2">
        <div className="flex items-center">
          <span className="text-sm font-semibold truncate text-slate-800">
            Giliran: {activePlayer.name}
          </span>
          {renderEffects()}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Petak: {activePlayer.position}</span>
          <span>&bull;</span>
          <span>Skor: {activePlayer.score}</span>
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
          <div className="w-12 h-12 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center text-blue-700 font-bold text-xl">
            {activePlayer.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Pemain Aktif</span>
            <div className="flex items-center">
              <span className="text-lg font-bold text-slate-800">{activePlayer.name}</span>
            </div>
          </div>
        </div>
        
        {activePlayer.activeEffects && activePlayer.activeEffects.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-2 border border-blue-100 flex items-center justify-center">
            <span className="text-xs text-blue-700 font-semibold mr-2">Status:</span>
            {renderEffects()}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <span className="block text-xs text-slate-500 mb-1">Posisi</span>
            <span className="block text-xl font-bold text-slate-700">{activePlayer.position}</span>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <span className="block text-xs text-slate-500 mb-1">Skor</span>
            <span className="block text-xl font-bold text-blue-600">{activePlayer.score}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
