export type BuffType = 'AntiSnake' | 'DoubleRoll' | 'StealPoint' | 'Cendekiawan' | 'MesinWaktu';
export type DebuffType = 'AbsoluteRoll' | 'Silence' | 'DecreasedRoll' | 'AmnesiaSejarah' | 'PajakKolonial' | 'PhobiaTangga';

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
  isBot?: boolean;
  // [PATCH v1.1 - Double Roll]
  hasExtraTurn?: boolean;           
  disableBonusForThisTurn?: boolean;
  // [PATCH v1.2 - Final Boss]
  failedFinalBossQuizzes?: string[];
}
