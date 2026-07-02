/**
 * Utility untuk menghitung posisi dan bentuk visual di atas papan.
 * Memisahkan logika presentasi (UI) dari logika bisnis (Game Engine).
 */

/**
 * Helper untuk mendapatkan koordinat tengah (persentase) dari sebuah petak di Grid 10x10.
 * Asumsi: Kiri atas adalah X:0, Y:0
 */
export const getCoordinates = (position: number) => {
  const row_bottom = Math.floor((position - 1) / 10);
  const row_top = 9 - row_bottom;
  const col = row_bottom % 2 === 0 
    ? (position - 1) % 10 
    : 9 - ((position - 1) % 10);
  
  return {
    x: col * 10 + 5,
    y: row_top * 10 + 5
  };
};

/**
 * Helper untuk menghitung parameter kurva Bezier S-Curve untuk ular
 */
export const getSnakeCurveParams = (headPos: number, tailPos: number) => {
  const head = getCoordinates(headPos);
  const tail = getCoordinates(tailPos);
  
  const dx = tail.x - head.x;
  const dy = tail.y - head.y;
  
  const perpX = -dy * 0.15;
  const perpY = dx * 0.15;
  
  const cx1 = head.x + dx * 0.3 + perpX;
  const cy1 = head.y + dy * 0.3 + perpY;
  const cx2 = head.x + dx * 0.7 - perpX;
  const cy2 = head.y + dy * 0.7 - perpY;

  return { head, tail, cx1, cy1, cx2, cy2 };
};

/**
 * Menghitung posisi (X, Y) di suatu titik t (0 hingga 1) sepanjang Cubic Bezier Curve.
 */
export const getBezierPoint = (t: number, p0: number, p1: number, p2: number, p3: number) => {
  const cT = 1 - t;
  return (
    Math.pow(cT, 3) * p0 +
    3 * Math.pow(cT, 2) * t * p1 +
    3 * cT * Math.pow(t, 2) * p2 +
    Math.pow(t, 3) * p3
  );
};
