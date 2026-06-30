import { Tile, TileType } from '@/types/board';
import { snakes } from '@/data/papan/snakes';
import { ladders } from '@/data/papan/ladders';
import { GAME_CONSTANTS } from '@/constants/game';

// Konfigurasi petak-petak spesial (TANPA Bonus & Penalty)
const specialTiles: Record<number, { type: TileType; contentId?: string; effectValue?: number }> = {
  5: { type: 'Quiz', contentId: 'q1' },
  10: { type: 'Fact', contentId: 'f1' },
  25: { type: 'Quiz', contentId: 'q2' },
  30: { type: 'Fact', contentId: 'f2' },
  35: { type: 'Quiz', contentId: 'q3' },
  45: { type: 'Quiz', contentId: 'q4' },
  50: { type: 'Fact', contentId: 'f3' },
  75: { type: 'Quiz', contentId: 'q5' },
  85: { type: 'Fact', contentId: 'f4' },
  90: { type: 'Quiz', contentId: 'q6' },
};

export const generateRandomBoard = (bonusCount: number = 3, penaltyCount: number = 3): Tile[] => {
  // 1. Buat papan dasar dengan elemen statis
  const baseBoard: Tile[] = Array.from({ length: GAME_CONSTANTS.BOARD_SIZE }, (_, i) => {
    const position = i + 1;
    let type: TileType = 'Normal';

    if (snakes.some(s => s.head === position)) {
      type = 'Snake';
    } else if (ladders.some(l => l.start === position)) {
      type = 'Ladder';
    } else if (specialTiles[position]) {
      type = specialTiles[position].type;
    }

    const baseTile: Tile = { position, type };

    if (specialTiles[position]) {
      baseTile.contentId = specialTiles[position].contentId;
      baseTile.effectValue = specialTiles[position].effectValue;
    }

    return baseTile;
  });

  // 2. Kumpulkan kandidat posisi (Normal tile, kecuali start dan end)
  const candidateIndices: number[] = [];
  for (let i = 1; i < GAME_CONSTANTS.BOARD_SIZE - 1; i++) {
    if (baseBoard[i].type === 'Normal') {
      candidateIndices.push(i);
    }
  }

  // Acak array menggunakan Fisher-Yates
  for (let i = candidateIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidateIndices[i], candidateIndices[j]] = [candidateIndices[j], candidateIndices[i]];
  }

  // 3. Ambil posisi acak untuk Bonus
  for (let i = 0; i < bonusCount && i < candidateIndices.length; i++) {
    const idx = candidateIndices[i];
    baseBoard[idx].type = 'Bonus';
    baseBoard[idx].effectValue = 0; // Value efek sudah ditangani secara acak di GameEngine
  }

  // 4. Ambil sisa posisi acak untuk Penalty
  const startIndexForPenalty = bonusCount;
  for (let i = 0; i < penaltyCount && (startIndexForPenalty + i) < candidateIndices.length; i++) {
    const idx = candidateIndices[startIndexForPenalty + i];
    baseBoard[idx].type = 'Penalty';
    baseBoard[idx].effectValue = 0; // Value efek sudah ditangani secara acak di GameEngine
  }

  return baseBoard;
};

// Ekspor default sementara agar file lama yang mengimpor `board` tidak error (walau tidak lagi murni statis)
export const board: Tile[] = generateRandomBoard();
