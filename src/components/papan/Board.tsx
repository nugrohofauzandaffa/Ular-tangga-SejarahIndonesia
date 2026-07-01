import React from 'react';
import { Tile as TileType } from '@/types/board';
import { Player } from '@/types/player';
import Tile from './Tile';
import PlayerToken from '../player/PlayerToken';
import { snakes } from '@/data/papan/snakes';
import { ladders } from '@/data/papan/ladders';

/**
 * Helper untuk menyusun urutan tile menjadi pola zig-zag (snake pattern)
 * Bawah ke atas, kiri ke kanan -> kanan ke kiri
 */
const getOrderedTiles = (tiles: TileType[]): TileType[] => {
  const ordered: TileType[] = [];

  for (let row = 9; row >= 0; row--) {
    const start = row * 10;
    const rowTiles = tiles.slice(start, start + 10);

    if (row % 2 !== 0) {
      rowTiles.reverse();
    }
    ordered.push(...rowTiles);
  }

  return ordered;
};

/**
 * Helper untuk mendapatkan koordinat tengah (persentase) dari sebuah petak di Grid 10x10.
 * Asumsi: Kiri atas adalah X:0, Y:0
 */
const getCoordinates = (position: number) => {
  const row_bottom = Math.floor((position - 1) / 10);
  const row_top = 9 - row_bottom;
  const col = row_bottom % 2 === 0 
    ? (position - 1) % 10 
    : 9 - ((position - 1) % 10);
  
  return {
    x: col * 10 + 5,
    y: row_top * 10 + 5
  };
};

interface BoardProps {
  tiles: TileType[];
  players: Player[];
}

export default function Board({ tiles, players }: BoardProps) {
  const orderedTiles = getOrderedTiles(tiles);

  return (
    <div className="w-full max-w-2xl aspect-square bg-[#f4ebd0] rounded-xl shadow-2xl border-4 border-[#8B4513] grid grid-cols-10 grid-rows-10 relative overflow-hidden ring-4 ring-[#cd853f] ring-opacity-50">
      {orderedTiles.map((tile) => {
        const playersOnTile = players.filter(p => p.position === tile.position);
        
        return (
          <Tile key={tile.position} tile={tile} players={playersOnTile} />
        );
      })}

      {/* SVG Overlay layer untuk koneksi ular dan tangga */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full z-20 drop-shadow-md">
        <defs>
          <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" /> {/* red-500 */}
            <stop offset="100%" stopColor="#7f1d1d" /> {/* red-900 */}
          </linearGradient>
          <linearGradient id="ladderGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" /> {/* emerald-500 */}
            <stop offset="100%" stopColor="#047857" /> {/* emerald-700 */}
          </linearGradient>
        </defs>

        {/* Render Snakes */}
        {snakes.map((snake, i) => {
          const head = getCoordinates(snake.head);
          const tail = getCoordinates(snake.tail);
          return (
            <line
              key={`snake-${i}`}
              x1={`${head.x}%`}
              y1={`${head.y}%`}
              x2={`${tail.x}%`}
              y2={`${tail.y}%`}
              stroke="url(#snakeGrad)"
              strokeWidth="4"
              strokeDasharray="6,4"
              strokeLinecap="round"
            />
          );
        })}

        {ladders.map((ladder, i) => {
          const start = getCoordinates(ladder.start);
          const end = getCoordinates(ladder.end);
          return (
            <line
              key={`ladder-${i}`}
              x1={`${start.x}%`}
              y1={`${start.y}%`}
              x2={`${end.x}%`}
              y2={`${end.y}%`}
              stroke="url(#ladderGrad)"
              strokeWidth="7"
              strokeLinecap="square"
            />
          );
        })}
      </svg>

      {/* Layer Animasi Pion Pemain (Absolute Position) */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {Object.values(
          players.reduce((acc, player) => {
            if (!acc[player.position]) acc[player.position] = [];
            acc[player.position].push(player);
            return acc;
          }, {} as Record<number, Player[]>)
        ).flatMap((playersOnSameTile) => 
          playersOnSameTile.map((player, index) => {
            const coords = getCoordinates(player.position);
            return (
              <PlayerToken 
                key={player.id} 
                player={player} 
                index={index} 
                totalTokens={playersOnSameTile.length}
                x={coords.x}
                y={coords.y}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
