import { Tile, TileType } from '@/types/board';
import { snakes } from '@/data/papan/snakes';
import { ladders } from '@/data/papan/ladders';
import { GAME_CONSTANTS } from '@/constants/game';
import { questions } from '@/data/questions';

export const generateRandomBoard = (bonusCount: number = 4, penaltyCount: number = 4): Tile[] => {
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

  // Kumpulkan semua normal tiles berdasarkan zona
  const zone1: number[] = []; // 2-30
  const zone2: number[] = []; // 31-70
  const zone3: number[] = []; // 71-90
  const zone4: number[] = []; // 91-99

  for (let i = 1; i < GAME_CONSTANTS.BOARD_SIZE - 1; i++) {
    if (baseBoard[i].type === 'Normal') {
      const pos = i + 1;
      if (pos <= 30) zone1.push(i);
      else if (pos <= 70) zone2.push(i);
      else if (pos <= 90) zone3.push(i);
      else zone4.push(i);
    }
  }

  // Helper untuk mengacak array
  const shuffle = <T,>(array: T[]) => array.sort(() => Math.random() - 0.5);

  shuffle(zone1);
  shuffle(zone2);
  shuffle(zone3);
  shuffle(zone4);

  // Helper mendapatkan pertanyaan acak berdasarkan list difficulty
  const getQuestion = (difficulties: string[]) => {
    const validQuestions = questions.filter(q => difficulties.includes(q.difficulty));
    return validQuestions[Math.floor(Math.random() * validQuestions.length)];
  };

  // 2. Distribusi Kuis (Total ~25 Kuis)
  const distributeQuizzes = (zone: number[], count: number, difficulties: string[]) => {
    for (let i = 0; i < count && i < zone.length; i++) {
      const idx = zone[i];
      baseBoard[idx].type = 'Quiz';
      baseBoard[idx].contentId = getQuestion(difficulties).id;
    }
  };

  distributeQuizzes(zone1, 7, ['Easy']);
  distributeQuizzes(zone2, 10, ['Easy', 'Medium']);
  distributeQuizzes(zone3, 5, ['Medium', 'Hard']);
  distributeQuizzes(zone4, 3, ['Hard', 'Extreme']);

  // Kumpulkan sisa Normal tiles untuk Bonus dan Penalty
  const remainingNormals: number[] = [];
  for (let i = 1; i < GAME_CONSTANTS.BOARD_SIZE - 1; i++) {
    if (baseBoard[i].type === 'Normal') remainingNormals.push(i);
  }
  shuffle(remainingNormals);

  // 3. Distribusi Bonus
  for (let i = 0; i < bonusCount && i < remainingNormals.length; i++) {
    baseBoard[remainingNormals[i]].type = 'Bonus';
  }

  // 4. Distribusi Penalty
  for (let i = bonusCount; i < bonusCount + penaltyCount && i < remainingNormals.length; i++) {
    baseBoard[remainingNormals[i]].type = 'Penalty';
  }

  return baseBoard;
};

// Ekspor default sementara
export const board: Tile[] = generateRandomBoard();
