import React, { useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  speed: number;
  delay: number;
}

export const Confetti: React.FC = () => {
  const [pieces] = useState<ConfettiPiece[]>(() => {
    const newPieces: ConfettiPiece[] = [];
    // Pilih warna tema kebangsaan/sejarah
    const colors = ['#ef4444', '#facc15', '#ffffff', '#c2410c', '#b91c1c'];
    
    // Buat 100 kepingan konfeti
    for (let i = 0; i < 100; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100, // persentase posisi X
        y: -10 - Math.random() * 20, // mulai dari atas layar
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 6, // 6px - 14px
        rotation: Math.random() * 360,
        speed: Math.random() * 2 + 2.5, // kecepatan jatuh
        delay: Math.random() * 3, // delay mulainya
      });
    }
    return newPieces;
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-[150] overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute rounded-sm"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size * 0.8}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            animation: `confetti-fall ${piece.speed}s linear ${piece.delay}s infinite`
          }}
        />
      ))}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
        }
      `}} />
    </div>
  );
};
