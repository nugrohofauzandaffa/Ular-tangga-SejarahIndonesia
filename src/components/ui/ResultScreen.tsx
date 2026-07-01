import React, { useMemo } from 'react';
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
  // 1. Leaderboard Ranking
  const sortedPlayers = useMemo(() => [...gameState.players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.correctAnswers !== a.correctAnswers) return b.correctAnswers - a.correctAnswers;
    return b.position - a.position;
  }), [gameState.players]);
  
  // 4. History Master (Pemain dengan jawaban benar terbanyak)
  const historyMaster = useMemo(() => {
    if (!sortedPlayers || sortedPlayers.length === 0) return null;
    let bestPlayer = sortedPlayers[0];
    let maxCorrect = -1;
    for (const player of sortedPlayers) {
      if (player.correctAnswers > maxCorrect) {
        maxCorrect = player.correctAnswers;
        bestPlayer = player;
      }
    }
    return maxCorrect > 0 ? bestPlayer : null;
  }, [sortedPlayers]);

  if (gameState.gameStatus !== 'finished') {
    return null;
  }
  
  // 2. Champion (Pemenang Utama berdasarkan skor tertinggi)
  const championId = gameState.winner;
  const champion = gameState.players.find(p => p.id === championId) || sortedPlayers[0];

  // 3. Fastest Explorer (Pemain yang menyentuh petak 100)
  const fastestExplorerId = gameState.fastestExplorer;
  const fastestExplorer = gameState.players.find(p => p.id === fastestExplorerId);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-50 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 my-8">
        
        {/* Header Hasil - Champion */}
        <div className="bg-gradient-to-br from-indigo-700 via-blue-700 to-blue-900 text-white p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          
          <h1 className="text-sm font-bold uppercase tracking-widest text-blue-200 mb-2 relative z-10">Hasil Akhir Permainan</h1>
          
          <div className="mt-4 mb-2 relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center mb-4 relative">
              <span className="text-5xl drop-shadow-md">🏆</span>
              <div className="absolute -bottom-3 bg-white text-blue-800 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                Champion
              </div>
            </div>
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 drop-shadow-md mb-2">
              {champion?.name}
            </h2>
            <p className="text-blue-100 font-medium">Berhasil mengumpulkan {champion?.score} Poin!</p>
          </div>
        </div>

        {/* Special Achievements Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-white border-b border-slate-200">
          
          {/* Fastest Explorer */}
          <div className="flex items-center p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mr-4 shrink-0 shadow-sm">
              🏃
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Fastest Explorer</span>
              <span className="text-lg font-bold text-slate-800 leading-tight">
                {fastestExplorer ? fastestExplorer.name : 'Tidak Ada'}
              </span>
              <span className="text-xs text-slate-500">Pertama mencapai petak 100</span>
            </div>
          </div>

          {/* History Master */}
          <div className="flex items-center p-4 bg-purple-50 border border-purple-100 rounded-2xl">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl mr-4 shrink-0 shadow-sm">
              🧠
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">History Master</span>
              <span className="text-lg font-bold text-slate-800 leading-tight">
                {historyMaster ? historyMaster.name : 'Tidak Ada'}
              </span>
              <span className="text-xs text-slate-500">
                {historyMaster ? `Menjawab ${historyMaster.correctAnswers} kuis dengan benar` : 'Belum ada kuis terjawab'}
              </span>
            </div>
          </div>

        </div>
        
        {/* Papan Peringkat (Ranking) */}
        <div className="p-6 md:p-8 bg-slate-50 flex-1">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-2 text-center">Klasemen Akhir</h3>
          
          <div className="flex flex-col gap-3">
            {sortedPlayers.map((player, index) => {
              const isChampion = player.id === champion?.id;
              
              return (
                <div 
                  key={player.id}
                  className={`flex items-center p-4 rounded-xl border-2 transition-all
                    ${isChampion ? 'bg-white border-yellow-300 shadow-md transform scale-[1.02]' : 'bg-white border-slate-100 shadow-sm'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mr-4 shrink-0 shadow-inner
                    ${index === 0 ? 'bg-gradient-to-br from-yellow-200 to-yellow-400 text-yellow-900 border border-yellow-500' : 
                      index === 1 ? 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 border border-slate-400' : 
                      index === 2 ? 'bg-gradient-to-br from-orange-200 to-orange-300 text-orange-900 border border-orange-400' : 
                      'bg-slate-100 text-slate-500 border border-slate-200'}`}
                  >
                    #{index + 1}
                  </div>
                  
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className={`font-bold text-lg ${isChampion ? 'text-blue-900' : 'text-slate-700'}`}>
                        {player.name}
                        {isChampion && <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full border border-yellow-300">Juara</span>}
                      </span>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-0.5">
                        <span className="flex items-center gap-1"><span className="text-emerald-500">✓</span> {player.correctAnswers} Benar</span>
                        <span className="flex items-center gap-1"><span className="text-rose-500">✗</span> {player.wrongAnswers} Salah</span>
                      </div>
                    </div>
                    
                    <div className="flex items-end sm:items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">Skor</span>
                      <span className={`text-3xl font-black ${isChampion ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600' : 'text-slate-600'}`}>
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
