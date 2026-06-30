export type BuffType = 'AntiSnake' | 'DoubleRoll' | 'StealPoint';
export type DebuffType = 'AbsoluteRoll' | 'FactBanned' | 'DecreasedRoll';

export interface PlayerEffect {
  type: BuffType | DebuffType;
  duration: number; // Sisa giliran efek bertahan (-1 jika instant)
  value?: number; // Nilai bantuan/pengurang
}

export interface Player {
  id: string;
  name: string;
  position: number;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  activeEffects: PlayerEffect[];
}
