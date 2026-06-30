import React from 'react';
import { Tile as TileType } from '@/types/board';
import { Player } from '@/types/player';
import Tile from './Tile';

/**
 * Helper untuk menyusun urutan tile menjadi pola zig-zag (snake pattern)
 * Bawah ke atas, kiri ke kanan -> kanan ke kiri
 */
const getOrderedTiles = (tiles: TileType[]): TileType[] => {
  const ordered: TileType[] = [];

  // Board memiliki 10 baris (indeks 0 hingga 9), dimana baris 0 adalah petak 1-10
  for (let row = 9; row >= 0; row--) {
    const start = row * 10;
    const rowTiles = tiles.slice(start, start + 10);

    // Baris ganjil (seperti 11-20, 31-40) diurutkan terbalik (kanan ke kiri)
    // Baris genap (seperti 1-10, 21-30) normal (kiri ke kanan)
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
}

export default function Board({ tiles, players }: BoardProps) {
  const orderedTiles = getOrderedTiles(tiles);

  return (
    <div className="w-full max-w-2xl aspect-square bg-slate-100 rounded-xl shadow-lg border-[3px] border-slate-700 grid grid-cols-10 grid-rows-10 relative overflow-hidden">
      {orderedTiles.map((tile) => {
        // Filter pemain yang berada di posisi petak ini
        const playersOnTile = players.filter(p => p.position === tile.position);
        
        return (
          <Tile key={tile.position} tile={tile} players={playersOnTile} />
        );
      })}

      {/* SVG Overlay layer untuk koneksi ular dan tangga di phase mendatang */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full z-20">
        {/* Garis ular dan tangga akan digambar di sini */}
      </svg>
    </div>
  );
}
