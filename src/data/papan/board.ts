import { Tile, TileType } from '@/types/board';
import { snakes } from '@/data/papan/snakes';
import { ladders } from '@/data/papan/ladders';
import { GAME_CONSTANTS } from '@/constants/game';
import { questions } from '@/data/questions';

export const generateRandomBoard = (quizCount: number = 10, bonusCount: number = 3, penaltyCount: number = 3): Tile[] => {
  // 1. Buat papan dasar dengan ular dan tangga
  const baseBoard: Tile[] = Array.from({ length: GAME_CONSTANTS.BOARD_SIZE }, (_, i) => {
    const position = i + 1;
    let type: TileType = 'Normal';

    if (snakes.some(s => s.head === position)) {
      type = 'Snake';
    } else if (ladders.some(l => l.start === position)) {
      type = 'Ladder';
    }

    return { position, type };
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

  // 3. Ambil posisi acak untuk Kuis
  let currentIndex = 0;
  
  // Shuffle ID soal agar soal yang muncul bervariasi
  const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < quizCount && currentIndex < candidateIndices.length; i++) {
    const idx = candidateIndices[currentIndex++];
    baseBoard[idx].type = 'Quiz';
    baseBoard[idx].contentId = shuffledQuestions[i % shuffledQuestions.length].id;
  }

  // 4. Ambil posisi acak untuk Bonus
  for (let i = 0; i < bonusCount && currentIndex < candidateIndices.length; i++) {
    const idx = candidateIndices[currentIndex++];
    baseBoard[idx].type = 'Bonus';
  }

  // 5. Ambil posisi acak untuk Penalty
  for (let i = 0; i < penaltyCount && currentIndex < candidateIndices.length; i++) {
    const idx = candidateIndices[currentIndex++];
    baseBoard[idx].type = 'Penalty';
  }

  return baseBoard;
};

// Ekspor default sementara
export const board: Tile[] = generateRandomBoard();
