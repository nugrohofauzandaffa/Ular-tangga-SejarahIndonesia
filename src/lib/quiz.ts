import { Question } from '../types/question';

export interface QuizResult {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
}

/**
 * Mengambil data soal berdasarkan ID dari sebuah kumpulan array soal
 * @param id ID soal yang ingin dicari
 * @param questionsList Daftar soal untuk dicari
 * @returns Data soal atau undefined jika tidak ditemukan
 */
export const getQuestionById = (id: string, questionsList: Question[]): Question | undefined => {
  return questionsList.find((q) => q.id === id);
};

/**
 * Memvalidasi jawaban pemain terhadap soal tertentu
 * @param question Data soal secara lengkap
 * @param selectedAnswer Jawaban yang dipilih oleh pemain
 * @returns Hasil validasi (QuizResult) yang mencakup status kebenaran, jawaban yang benar, dan penjelasan
 */
export const validateAnswer = (question: Question, selectedAnswer: string): QuizResult => {
  const isCorrect = question.correctAnswer === selectedAnswer;

  return {
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
  };
};
