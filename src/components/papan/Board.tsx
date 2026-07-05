import React from 'react';
import { Tile as TileType } from '@/types/board';
import { Player } from '@/types/player';
import Tile from './Tile';
import PlayerToken, { AnimationStyle } from '../player/PlayerToken';
import { snakes } from '@/data/papan/snakes';
import { ladders } from '@/data/papan/ladders';
import { getCoordinates, getSnakeCurveParams } from '@/utils/geometry';
import { useTheme } from '@/contexts/ThemeContext';

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
  animationStyle?: AnimationStyle;
}

export default function Board({ tiles, players, transitioningPlayers = {}, animationStyle = 'hop' }: BoardProps) {
  const orderedTiles = getOrderedTiles(tiles);
  const { currentTheme } = useTheme();
  const isJakarta = currentTheme.id === 'jakarta-heritage';

  return (
    <div 
      className={`w-full max-w-2xl aspect-square grid grid-cols-10 grid-rows-10 relative overflow-hidden transition-all duration-300 ${
        currentTheme.id === 'jakarta-heritage' ? 'gigi-balang-top gigi-balang-bottom border-y-8 pt-2 pb-2' : 'border-4 rounded-xl'
      }`}
      style={{
        backgroundColor: currentTheme.board.gridBg,
        borderColor: currentTheme.board.borderColor,
        boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 4px ${currentTheme.board.ringColor}`,
        backgroundImage: currentTheme.bgPattern,
        backgroundSize: currentTheme.id === 'jakarta-heritage' ? '60px 60px' : 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: currentTheme.id === 'jakarta-heritage' ? 'normal' : 'multiply'
      }}
    >
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
            <stop offset="0%" stopColor={currentTheme.board.snakeGrad.start} />
            <stop offset="100%" stopColor={currentTheme.board.snakeGrad.end} />
          </linearGradient>
          <linearGradient id="ladderGrad" x1="0%" y1="100%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={currentTheme.board.ladderGrad.start} />
            <stop offset="100%" stopColor={currentTheme.board.ladderGrad.end} />
          </linearGradient>
          {/* SVG drop shadow filter for ladders depth */}
          <filter id="shadowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0.4" dy="0.6" stdDeviation="0.4" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>


        {/* Render Snakes */}
        {snakes.map((snake, i) => {
          const { head, tail, cx1, cy1, cx2, cy2 } = getSnakeCurveParams(snake.head, snake.tail);
          const pathData = `M ${head.x} ${head.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tail.x} ${tail.y}`;

          // Kalkulasi rotasi kepala & ekor ular
          const headAngle = Math.atan2(head.y - cy1, head.x - cx1) * (180 / Math.PI) + 90;
          const tailAngle = Math.atan2(tail.y - cy2, tail.x - cx2) * (180 / Math.PI) - 90;

          return (
            <g key={`snake-${i}`}>
              {/* Shadow of the snake body */}
              {isJakarta && (
                <path
                  d={pathData}
                  stroke="rgba(0, 0, 0, 0.15)"
                  strokeWidth="4.2"
                  fill="none"
                  strokeLinecap="round"
                  transform="translate(0.4, 0.6)"
                />
              )}

              {/* Badan Ular */}
              <path
                d={pathData}
                stroke="url(#snakeGrad)"
                strokeWidth={isJakarta ? "3.2" : "2.0"}
                fill="none"
                strokeLinecap="round"
              />

              {/* Sisik/Pola Ular */}
              {isJakarta ? (
                <>
                  <path
                    d={pathData}
                    stroke="var(--color-gold-light)"
                    strokeWidth="1.2"
                    fill="none"
                    strokeDasharray="1.5, 3"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                  <path
                    d={pathData}
                    stroke="var(--color-gold-dark)"
                    strokeWidth="0.4"
                    fill="none"
                    opacity="0.8"
                  />
                </>
              ) : (
                <path
                  d={pathData}
                  stroke="#fca5a5"
                  strokeWidth="0.3"
                  fill="none"
                  strokeDasharray="1, 2"
                />
              )}

              {/* Ekor Naga (Kembang Kelapa fan) */}
              {isJakarta && (
                <g transform={`translate(${tail.x}, ${tail.y}) rotate(${tailAngle})`}>
                  {/* Left tail leaf */}
                  <path d="M 0,0 C -1.5,-0.8 -2.2,-2.2 -0.8,-3.2 C 0,-2.5 0,-0.8 0,0" fill="var(--color-gold)" stroke="var(--color-gold-dark)" strokeWidth="0.15" />
                  {/* Right tail leaf */}
                  <path d="M 0,0 C 1.5,-0.8 2.2,-2.2 0.8,-3.2 C 0,-2.5 0,-0.8 0,0" fill="var(--color-gold)" stroke="var(--color-gold-dark)" strokeWidth="0.15" />
                  {/* Center spike */}
                  <path d="M 0,0 C 0,-1.5 0,-3.2 0,-3.5 C 0,-3.2 0,-1.5 0,0" fill="var(--color-gold-light)" stroke="var(--color-gold-dark)" strokeWidth="0.15" />
                  <circle cx="0" cy="-3.5" r="0.25" fill="#ef4444" />
                </g>
              )}

              {/* Kepala Ular / Naga Betawi */}
              <g transform={`translate(${head.x}, ${head.y}) rotate(${headAngle})`}>
                {isJakarta ? (
                  <>
                    {/* Shadow of the head */}
                    <path d="M-2,1.5 C-2,-0.5 -1,-2.5 0,-2.5 C1,-2.5 2,-0.5 2,1.5 L1.5,2.5 L-1.5,2.5 Z" fill="rgba(0,0,0,0.15)" transform="translate(0.3, 0.4)" />
                    
                    {/* Crown / Mahkota Naga */}
                    <path d="M-0.8,-2.5 L0,-4.2 L0.8,-2.5 L0,-1.8 Z" fill="var(--color-gold-light)" stroke="var(--color-gold-dark)" strokeWidth="0.15" />
                    <circle cx="0" cy="-4.2" r="0.3" fill="#ef4444" />
                    
                    {/* Jaw Back / Mane (Wood Carving Details) */}
                    <path d="M-1.8,0.8 C-2.5,-0.8 -2.5,1.2 -1.8,2 M1.8,0.8 C2.5,-0.8 2.5,1.2 1.8,2" stroke="var(--color-gold-dark)" strokeWidth="0.3" fill="var(--color-gold)" />
                    
                    {/* Main Head Base */}
                    <path d="M-1.5,1 C-1.5,-1 -0.8,-2.5 0,-2.5 C0.8,-2.5 1.5,-1 1.5,1 L1.2,2.5 L-1.2,2.5 Z" fill={currentTheme.board.snakeGrad.end} stroke="var(--color-gold-dark)" strokeWidth="0.2" />
                    
                    {/* Eyes */}
                    <circle cx="-0.5" cy="-1" r="0.4" fill="#ffffff" />
                    <circle cx="-0.5" cy="-1" r="0.18" fill="var(--color-navy-dark)" />
                    <circle cx="0.5" cy="-1" r="0.4" fill="#ffffff" />
                    <circle cx="0.5" cy="-1" r="0.18" fill="var(--color-navy-dark)" />
                    
                    {/* Snout/Nose details */}
                    <ellipse cx="0" cy="0.2" rx="0.5" ry="0.8" fill={currentTheme.board.snakeGrad.start} />
                    <circle cx="-0.2" cy="0.2" r="0.15" fill="var(--color-gold-light)" />
                    <circle cx="0.2" cy="0.2" r="0.15" fill="var(--color-gold-light)" />
                    
                    {/* Teeth / Fangs */}
                    <path d="M-0.6,1.2 L-0.4,1.8 L-0.2,1.2 L0.2,1.2 L0.4,1.8 L0.6,1.2" stroke="var(--color-gold-light)" strokeWidth="0.2" fill="none" />
                    
                    {/* Long Red Tongue */}
                    <path d="M 0,1.5 C -0.3,2.5 0.3,3 0,3.8" stroke="#ef4444" strokeWidth="0.2" fill="none" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <polygon points="-1.5,1 1.5,1 0,-2" fill={currentTheme.board.snakeGrad.end} />
                    {/* Mata */}
                    <circle cx="-0.6" cy="-0.5" r="0.3" fill="#fef08a" />
                    <circle cx="0.6" cy="-0.5" r="0.3" fill="#fef08a" />
                    {/* Lidah Bercabang */}
                    <path d="M 0,-2 L -0.5,-3.5 M 0,-2 L 0.5,-3.5" stroke={currentTheme.board.snakeGrad.start} strokeWidth="0.2" fill="none" />
                  </>
                )}
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
            <g key={`ladder-${i}`} transform={`translate(${start.x}, ${start.y}) rotate(${angle})`} filter={isJakarta ? "url(#shadowFilter)" : undefined}>
              {/* Rel Tangga 1 */}
              <line x1="0" y1="-1.6" x2={length} y2="-1.6" stroke={isJakarta ? "#78350f" : "url(#ladderGrad)"} strokeWidth={isJakarta ? "1.4" : "0.8"} strokeLinecap="round" />
              {isJakarta && (
                // Highlight line to give 3D cylindrical shine
                <line x1="0" y1="-1.8" x2={length} y2="-1.8" stroke="rgba(253, 211, 77, 0.4)" strokeWidth="0.3" strokeLinecap="round" />
              )}

              {/* Rel Tangga 2 */}
              <line x1="0" y1="1.6" x2={length} y2="1.6" stroke={isJakarta ? "#78350f" : "url(#ladderGrad)"} strokeWidth={isJakarta ? "1.4" : "0.8"} strokeLinecap="round" />
              {isJakarta && (
                <line x1="0" y1="1.4" x2={length} y2="1.4" stroke="rgba(253, 211, 77, 0.4)" strokeWidth="0.3" strokeLinecap="round" />
              )}

              {/* Anak Tangga */}
              {rungs.map((rx, rIndex) => (
                <g key={rIndex}>
                  {/* Underlay dark line for depth */}
                  <line x1={rx} y1="-1.6" x2={rx} y2="1.6" stroke={isJakarta ? "#451a03" : "url(#ladderGrad)"} strokeWidth={isJakarta ? "1.0" : "0.6"} />
                  {isJakarta && (
                    <>
                      {/* Main rung */}
                      <line x1={rx} y1="-1.6" x2={rx} y2="1.6" stroke="var(--color-gold-dark)" strokeWidth="0.8" />
                      {/* Highlight */}
                      <line x1={rx - 0.2} y1="-1.4" x2={rx - 0.2} y2="1.4" stroke="rgba(253, 211, 77, 0.6)" strokeWidth="0.2" />
                      
                      {/* Tali Pengikat (Lashings) - Bamboo rope joints */}
                      <circle cx={rx} cy="-1.6" r="0.4" fill="#1e293b" />
                      <circle cx={rx} cy="1.6" r="0.4" fill="#1e293b" />
                    </>
                  )}
                </g>
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
                animationStyle={animationStyle}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
