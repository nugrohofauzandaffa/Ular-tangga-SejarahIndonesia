import React from 'react';
import { Tile as TileType } from '@/types/board';
import { Player } from '@/types/player';
import PlayerToken from '../player/PlayerToken';

interface TileProps {
  tile: TileType;
  players?: Player[];
}

export default function Tile({ tile, players = [] }: TileProps) {
  // Tentukan warna berdasarkan tipe tile
  let bgClass = "bg-white";
  let textClass = "text-slate-400";
  
  switch (tile.type) {
    case 'Quiz':
      bgClass = "bg-blue-50";
      textClass = "text-blue-500 font-bold";
      break;
    case 'Fact':
      bgClass = "bg-green-50";
      textClass = "text-green-500 font-bold";
      break;
    case 'Bonus':
      bgClass = "bg-yellow-50";
      textClass = "text-yellow-600 font-bold";
      break;
    case 'Penalty':
      bgClass = "bg-red-50";
      textClass = "text-red-500 font-bold";
      break;
    case 'Snake':
      bgClass = "bg-red-100";
      textClass = "text-red-700 font-bold";
      break;
    case 'Ladder':
      bgClass = "bg-emerald-100";
      textClass = "text-emerald-700 font-bold";
      break;
  }

  return (
    <div 
      className={`border border-slate-200 relative flex flex-col items-center justify-center p-1 ${bgClass}`}
    >
      {/* Nomor Petak */}
      <span className="absolute top-0.5 left-1 text-[8px] sm:text-[10px] font-semibold text-slate-500 z-10">
        {tile.position}
      </span>
      
      {/* Indikator Tipe */}
      <span className={`text-[9px] sm:text-[11px] text-center z-10 ${textClass}`}>
        {tile.type !== 'Normal' ? tile.type : ''}
      </span>
      
      {/* Area untuk Player Token */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" id={`tile-${tile.position}-tokens`}>
        {players.map((player, index) => (
          <PlayerToken 
            key={player.id} 
            player={player} 
            index={index} 
            totalTokens={players.length} 
          />
        ))}
      </div>
    </div>
  );
}
