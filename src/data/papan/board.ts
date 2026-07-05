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
  const zone1: number[] = []; // 2-20
  const zone2: number[] = []; // 21-70
  const zone3: number[] = []; // 71-99

  for (let i = 1; i < GAME_CONSTANTS.BOARD_SIZE - 1; i++) {
    if (baseBoard[i].type === 'Normal') {
      const pos = i + 1;
      if (pos <= 20) zone1.push(i);
      else if (pos <= 70) zone2.push(i);
      else zone3.push(i);
    }
  }

  // Helper untuk mengacak array
  const shuffle = <T,>(array: T[]) => array.sort(() => Math.random() - 0.5);

  shuffle(zone1);
  shuffle(zone2);
  shuffle(zone3);

  // Helper mendapatkan pertanyaan acak berdasarkan list difficulty (Tanpa duplikasi)
  let availableQuestions = [...questions];
  const getQuestion = (difficulties: string[]) => {
    const validQuestions = availableQuestions.filter(q => difficulties.includes(q.difficulty));
    if (validQuestions.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * validQuestions.length);
    const selectedQuestion = validQuestions[randomIndex];
    
    // Hapus soal yang terpilih agar tidak muncul lagi
    availableQuestions = availableQuestions.filter(q => q.id !== selectedQuestion.id);
    return selectedQuestion;
  };

  // 2. Distribusi Kuis (Total 35 Kuis)
  const distributeQuizzes = (zone: number[], count: number, difficulties: string[]) => {
    let placed = 0;
    for (let i = 0; i < zone.length && placed < count; i++) {
      const question = getQuestion(difficulties);
      if (question) {
        const idx = zone[i];
        baseBoard[idx].type = 'Quiz';
        baseBoard[idx].contentId = question.id;
        placed++;
      }
    }
  };

  distributeQuizzes(zone1, 10, ['Easy']);
  distributeQuizzes(zone2, 15, ['Medium', 'Hard']);
  distributeQuizzes(zone3, 10, ['Extreme']);

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
