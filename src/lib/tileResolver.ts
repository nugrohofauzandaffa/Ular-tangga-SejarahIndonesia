import { Tile, TileType, Snake, Ladder } from '../types/board';

export interface TileEvent {
  type: TileType;
  contentId?: string; // Berisi ID soal kuis atau ID fakta sejarah
  destination?: number; // Posisi tujuan untuk ular/tangga
  scoreDelta?: number; // Jumlah skor/langkah bonus/penalti
}

/**
 * Menganalisa tile (petak) dan mengembalikan informasi event yang ada di petak tersebut
 * @param tile Data petak tempat pemain berhenti
 * @param snakes Daftar ular di papan permainan (untuk injeksi dependensi)
 * @param ladders Daftar tangga di papan permainan (untuk injeksi dependensi)
 * @returns Informasi TileEvent mengenai apa yang harus terjadi
 */
export const resolveTile = (
  tile: Tile,
  snakes: Snake[],
  ladders: Ladder[]
): TileEvent => {
  switch (tile.type) {
    case 'Normal':
      return { type: 'Normal' };

    case 'Quiz':
      return {
        type: 'Quiz',
        contentId: tile.contentId,
      };

    case 'Fact':
      return {
        type: 'Fact',
        contentId: tile.contentId,
      };

    case 'Bonus':
      return {
        type: 'Bonus',
        scoreDelta: tile.effectValue,
      };

    case 'Penalty':
      return {
        type: 'Penalty',
        scoreDelta: tile.effectValue, // scoreDelta bisa berupa angka negatif atau positif tergantung definisi
      };

    case 'Snake': {
      const snake = snakes.find((s) => s.head === tile.position);
      return {
        type: 'Snake',
        destination: snake?.tail,
      };
    }

    case 'Ladder': {
      const ladder = ladders.find((l) => l.start === tile.position);
      return {
        type: 'Ladder',
        destination: ladder?.end,
      };
    }

    default:
      return { type: 'Normal' };
  }
};
