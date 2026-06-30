import { Tile, TileType } from '../types/board';
import { snakes } from './snakes';
import { ladders } from './ladders';

// Konfigurasi petak-petak spesial
const specialTiles: Record<number, { type: TileType; contentId?: string; effectValue?: number }> = {
  5: { type: 'Quiz', contentId: 'q1' },
  10: { type: 'Fact', contentId: 'f1' },
  15: { type: 'Bonus', effectValue: 3 }, // Maju 3 langkah
  20: { type: 'Penalty', effectValue: -2 }, // Mundur 2 langkah
  25: { type: 'Quiz', contentId: 'q2' },
  30: { type: 'Fact', contentId: 'f2' },
  35: { type: 'Quiz', contentId: 'q3' },
  45: { type: 'Quiz', contentId: 'q4' },
  50: { type: 'Fact', contentId: 'f3' },
  55: { type: 'Bonus', effectValue: 2 },
  65: { type: 'Penalty', effectValue: -3 },
  75: { type: 'Quiz', contentId: 'q5' },
  85: { type: 'Fact', contentId: 'f4' },
  90: { type: 'Quiz', contentId: 'q6' },
};

import { GAME_CONSTANTS } from '../constants/game';

export const board: Tile[] = Array.from({ length: GAME_CONSTANTS.BOARD_SIZE }, (_, i) => {
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
