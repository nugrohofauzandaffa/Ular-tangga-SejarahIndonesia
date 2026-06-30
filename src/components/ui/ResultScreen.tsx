import React from 'react';
import { GameState } from '@/types/gameState';

interface ResultScreenProps {
  gameState: GameState;
  onPlayAgain?: () => void;
  onMainMenu?: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ 
  gameState, 
  onPlayAgain, 
  onMainMenu 
}) => {
  if (gameState.gameStatus !== 'finished') {
    return null;
  }

  // Mengurutkan pemain berdasarkan skor tertinggi
  // Jika game mendukung posisi finish sebagai prioritas, bisa disesuaikan,
  // namun berdasarkan instruksi UI, kita tampilkan peringkat skor.
  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
  
  // Menemukan pemenang berdasarkan gameState.winner (berisi ID pemenang)
  const winnerId = gameState.winner;
  const winner = gameState.players.find(p => p.id === winnerId) || sortedPlayers[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header Hasil */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          
          <h1 className="text-3xl font-extrabold mb-2 relative z-10 tracking-tight">Permainan Selesai!</h1>
          
          <div className="mt-6 mb-2 relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-yellow-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-3">
              <span className="text-4xl">👑</span>
            </div>
            <h2 className="text-2xl font-bold text-yellow-300 drop-shadow-md">
              {winner?.name}
            </h2>
            <p className="text-blue-100 font-medium">Memenangkan Pertandingan!</p>
          </div>
        </div>
        
        {/* Papan Peringkat */}
        <div className="p-6 md:p-8 bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">Papan Peringkat</h3>
          
          <div className="flex flex-col gap-3">
            {sortedPlayers.map((player, index) => {
              const isWinner = player.id === winner?.id;
              
              return (
                <div 
                  key={player.id}
                  className={`flex items-center p-4 rounded-xl border-2 transition-all
                    ${isWinner ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-100'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4 shrink-0
                    ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                      index === 1 ? 'bg-slate-200 text-slate-700' : 
                      index === 2 ? 'bg-orange-100 text-orange-800' : 
                      'bg-slate-100 text-slate-500'}`}
                  >
                    #{index + 1}
                  </div>
                  
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-lg">{player.name}</span>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <span>✅ {player.correctAnswers} Benar</span>
                        <span>❌ {player.wrongAnswers} Salah</span>
                      </div>
                    </div>
                    
                    <div className="flex items-end sm:items-center gap-1 sm:gap-2">
                      <span className="text-sm font-semibold text-slate-500 uppercase">Skor</span>
                      <span className={`text-2xl font-black ${isWinner ? 'text-blue-700' : 'text-slate-700'}`}>
                        {player.score}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer / Aksi */}
        <div className="bg-white p-6 border-t border-slate-200 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onPlayAgain}
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex-1 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Main Lagi
          </button>
          
          <button
            onClick={onMainMenu}
            className="px-8 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors flex-1"
          >
            Kembali ke Menu
          </button>
        </div>

      </div>
    </div>
  );
};
