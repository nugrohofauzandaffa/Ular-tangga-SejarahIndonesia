export type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Extreme';

export interface Question {
  id: string;
  category: string;
  difficulty: QuestionDifficulty;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}
