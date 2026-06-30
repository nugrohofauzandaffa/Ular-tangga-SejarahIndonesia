export type TileType = 'Normal' | 'Quiz' | 'Snake' | 'Ladder' | 'Bonus' | 'Penalty' | 'Fact';

export interface Tile {
  position: number;
  type: TileType;
  contentId?: string; // Opsional: ID untuk referensi Soal Quiz atau Fakta
  effectValue?: number; // Opsional: Nilai efek untuk Bonus/Penalty
}

export interface Snake {
  head: number;
  tail: number;
}

export interface Ladder {
  start: number;
  end: number;
}
