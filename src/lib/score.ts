export interface ScoreResult {
  newScore: number;
}

/**
 * Menambahkan poin ke skor pemain saat ini.
 * 
 * @param currentScore Skor pemain saat ini
 * @param points Poin yang akan ditambahkan
 * @returns Object berisi skor terbaru
 */
export function addScore(currentScore: number, points: number): ScoreResult {
  return {
    newScore: currentScore + Math.abs(points),
  };
}

/**
 * Mengurangi poin dari skor pemain saat ini.
 * 
 * @param currentScore Skor pemain saat ini
 * @param points Poin yang akan dikurangi
 * @param allowNegative Apakah skor diizinkan menjadi negatif (default: false)
 * @returns Object berisi skor terbaru
 */
export function reduceScore(currentScore: number, points: number, allowNegative: boolean = false): ScoreResult {
  const newScore = currentScore - Math.abs(points);
  return {
    newScore: allowNegative ? newScore : Math.max(0, newScore),
  };
}

/**
 * Menghitung total skor pemain berdasarkan statistik jawaban secara keseluruhan.
 * Fungsi ini berguna untuk menghitung ulang skor (re-calculate) dari awal.
 * 
 * @param baseScore Skor dasar atau skor dari bonus/penalti (selain kuis)
 * @param correctAnswers Jumlah jawaban benar
 * @param wrongAnswers Jumlah jawaban salah
 * @param pointsPerCorrect Poin yang didapat untuk setiap jawaban benar (default: 10)
 * @param pointsPerWrong Poin yang dikurangi untuk setiap jawaban salah (default: 5)
 * @param allowNegative Apakah skor akhir diizinkan menjadi negatif (default: false)
 * @returns Total skor keseluruhan
 */
export function calculateTotalScore(
  baseScore: number,
  correctAnswers: number,
  wrongAnswers: number,
  pointsPerCorrect: number = 10,
  pointsPerWrong: number = 5,
  allowNegative: boolean = false
): number {
  const total = baseScore + (correctAnswers * pointsPerCorrect) - (wrongAnswers * pointsPerWrong);
  return allowNegative ? total : Math.max(0, total);
}
