import React from 'react';
import { Tile as TileType } from '@/types/board';
import { Player } from '@/types/player';
import Tile from './Tile';
import PlayerToken from '../player/PlayerToken';
import { snakes } from '@/data/papan/snakes';
import { ladders } from '@/data/papan/ladders';
import { getCoordinates, getSnakeCurveParams } from '@/utils/geometry';

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

interface BoardProps {
  tiles: TileType[];
  players: Player[];
  transitioningPlayers?: Record<string, { x: number; y: number }>;
}

export default function Board({ tiles, players, transitioningPlayers = {} }: BoardProps) {
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
      <svg className="absolute inset-0 pointer-events-none w-full h-full z-20 drop-shadow-md" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ef4444" /> {/* red-500 */}
            <stop offset="100%" stopColor="#991b1b" /> {/* red-900 */}
          </linearGradient>
          <linearGradient id="ladderGrad" x1="0%" y1="100%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10b981" /> {/* emerald-500 */}
            <stop offset="100%" stopColor="#047857" /> {/* emerald-700 */}
          </linearGradient>
        </defs>

        {/* Render Snakes */}
        {snakes.map((snake, i) => {
          const { head, tail, cx1, cy1, cx2, cy2 } = getSnakeCurveParams(snake.head, snake.tail);
          const pathData = `M ${head.x} ${head.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tail.x} ${tail.y}`;

          // Kalkulasi rotasi kepala ular
          const headAngle = Math.atan2(head.y - cy1, head.x - cx1) * (180 / Math.PI) + 90;

          return (
            <g key={`snake-${i}`}>
              {/* Badan Ular */}
              <path
                d={pathData}
                stroke="url(#snakeGrad)"
                strokeWidth="2.0"
                fill="none"
                strokeLinecap="round"
              />
              {/* Sisik/Pola Ular */}
              <path
                d={pathData}
                stroke="#fca5a5"
                strokeWidth="0.3"
                fill="none"
                strokeDasharray="1, 2"
              />
              {/* Kepala Ular */}
              <g transform={`translate(${head.x}, ${head.y}) rotate(${headAngle})`}>
                <polygon points="-1.5,1 1.5,1 0,-2" fill="#991b1b" />
                {/* Mata */}
                <circle cx="-0.6" cy="-0.5" r="0.3" fill="#fef08a" />
                <circle cx="0.6" cy="-0.5" r="0.3" fill="#fef08a" />
                {/* Lidah Bercabang */}
                <path d="M 0,-2 L -0.5,-3.5 M 0,-2 L 0.5,-3.5" stroke="#ef4444" strokeWidth="0.2" fill="none" />
              </g>
            </g>
          );
        })}

        {/* Render Ladders */}
        {ladders.map((ladder, i) => {
          const start = getCoordinates(ladder.start);
          const end = getCoordinates(ladder.end);
          
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          
          const numRungs = Math.floor(length / 4);
          const rungs = [];
          for(let r = 1; r < numRungs; r++) {
            rungs.push(r * (length / numRungs));
          }

          return (
            <g key={`ladder-${i}`} transform={`translate(${start.x}, ${start.y}) rotate(${angle})`}>
              {/* Rel Tangga 1 */}
              <line x1="0" y1="-1.5" x2={length} y2="-1.5" stroke="url(#ladderGrad)" strokeWidth="0.8" strokeLinecap="round" />
              {/* Rel Tangga 2 */}
              <line x1="0" y1="1.5" x2={length} y2="1.5" stroke="url(#ladderGrad)" strokeWidth="0.8" strokeLinecap="round" />
              {/* Anak Tangga */}
              {rungs.map((rx, rIndex) => (
                <line key={rIndex} x1={rx} y1="-1.5" x2={rx} y2="1.5" stroke="url(#ladderGrad)" strokeWidth="0.6" />
              ))}
            </g>
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
            const transitionCoord = transitioningPlayers[player.id];
            const coords = transitionCoord || getCoordinates(player.position);
            const isTransitioning = !!transitionCoord;

            return (
              <PlayerToken 
                key={player.id} 
                player={player} 
                index={index} 
                totalTokens={playersOnSameTile.length}
                x={coords.x}
                y={coords.y}
                isTransitioning={isTransitioning}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
