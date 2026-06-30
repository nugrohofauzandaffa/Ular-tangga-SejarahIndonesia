import { Player } from '../types/player';

/**
 * Mendapatkan data pemain yang sedang memiliki giliran.
 * @param players Daftar semua pemain
 * @param currentTurnId ID pemain yang saat ini aktif
 * @returns Objek Player yang sedang aktif, atau undefined jika tidak ditemukan
 */
export const getActivePlayer = (
  players: Player[],
  currentTurnId: string
): Player | undefined => {
  return players.find((p) => p.id === currentTurnId);
};

/**
 * Menentukan pemain mana yang akan mendapat giliran selanjutnya secara bergiliran (circular)
 * @param players Daftar semua pemain
 * @param currentTurnId ID pemain yang gilirannya baru saja selesai
 * @returns ID pemain berikutnya (string)
 */
export const advanceTurn = (
  players: Player[],
  currentTurnId: string
): string => {
  if (players.length === 0) {
    throw new Error('Tidak ada pemain dalam permainan.');
  }

  const currentIndex = players.findIndex((p) => p.id === currentTurnId);
  
  if (currentIndex === -1) {
    throw new Error(`Pemain dengan ID ${currentTurnId} tidak ditemukan.`);
  }

  // Menggunakan modulo untuk kembali ke pemain pertama setelah pemain terakhir
  const nextIndex = (currentIndex + 1) % players.length;
  const nextPlayer = players[nextIndex];

  return nextPlayer.id;
};

/**
 * Memeriksa apakah pemain sudah mencapai kondisi menang (mencapai petak akhir)
 * @param player Objek Player yang ingin dicek
 * @param boardSize Ukuran papan permainan (default 100)
 * @returns boolean true jika pemain mencapai atau melewati petak terakhir
 */
export const checkWinCondition = (
  player: Player,
  boardSize: number = 100
): boolean => {
  return player.position >= boardSize;
};
