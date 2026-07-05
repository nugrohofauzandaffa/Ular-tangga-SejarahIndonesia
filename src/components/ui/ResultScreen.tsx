import React, { useMemo } from 'react';
import { GameState } from '@/types/gameState';
import { Confetti } from './Confetti';
import { useAudio } from '@/contexts/AudioContext';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { playSFX } = useAudio();
  const { currentTheme } = useTheme();

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

  const isJakarta = currentTheme.id === 'jakarta-heritage';

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto select-none animate-fade-in">
      <Confetti />
      <div 
        className={`w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-500 my-8 transition-all duration-300 ${
          isJakarta ? 'gigi-balang-top gigi-balang-bottom border-y-8 pt-2 pb-2' : 'border-2'
        }`}
        style={{ 
          backgroundColor: 'var(--color-parchment)',
          borderColor: 'var(--color-wood)' 
        }}
      >
        
        {/* Header Hasil - Champion */}
        <div 
          className="text-white p-8 text-center relative overflow-hidden transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, var(--color-navy-dark), var(--color-navy), var(--color-navy-dark))' }}
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse"></div>
          
          {isJakarta && (
            <div className="absolute top-0 left-0 right-0 h-[10px] bg-repeat-x bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'10\' viewBox=\'0 0 16 10\'%3E%3Cpolygon points=\'0,0 8,8 16,0\' fill=\'%2378350f\'/%3E%3C/svg%3E')] z-10" />
          )}

          <h1 
            className="text-sm font-bold uppercase tracking-widest mb-2 relative z-10 font-display"
            style={{ color: 'var(--color-cream-dark)' }}
          >
            Hasil Akhir Permainan
          </h1>
          
          <div className="mt-4 mb-2 relative z-10 flex flex-col items-center">
            <div className="w-28 h-28 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-full border-4 border-[var(--color-cream)] shadow-xl flex items-center justify-center mb-4 relative animate-bounce">
              <span className="text-6xl drop-shadow-md">🏆</span>
              <div className="absolute -bottom-3 bg-[var(--color-cream)] border border-[var(--color-gold)] text-[var(--color-navy-dark)] text-xs font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                Juara
              </div>
            </div>
            <h2 
              className="text-4xl font-extrabold drop-shadow-md mb-2 font-display uppercase tracking-wide"
              style={{ color: 'var(--color-gold)' }}
            >
              {champion?.name}
            </h2>
            <p className="font-semibold text-lg" style={{ color: 'var(--color-cream)' }}>
              Berhasil mengumpulkan {champion?.score} Poin!
            </p>
          </div>
        </div>

        {/* Special Achievements Panel */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 border-b transition-all duration-300"
          style={{ backgroundColor: 'var(--color-cream)/20', borderColor: 'var(--color-cream-dark)/30' }}
        >
          
          {/* Fastest Explorer */}
          <div 
            className="flex items-center p-4 rounded-2xl border transition-all duration-300"
            style={{ backgroundColor: 'var(--color-cream)/30', borderColor: 'var(--color-cream-dark)/30' }}
          >
            <div className="w-12 h-12 bg-[var(--color-parchment)] text-emerald-600 rounded-full border-2 flex items-center justify-center text-2xl mr-4 shrink-0 shadow-inner" style={{ borderColor: 'var(--color-cream-dark)' }}>
              🏃
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-navy)' }}>Fastest Explorer</span>
              <span className="text-lg font-bold leading-tight" style={{ color: 'var(--color-navy-dark)', fontFamily: 'var(--font-display)' }}>
                {fastestExplorer ? fastestExplorer.name : 'Tidak Ada'}
              </span>
              <span className="text-xs text-[var(--color-navy-light)] opacity-70">Pertama mencapai petak 100</span>
            </div>
          </div>

          {/* History Master */}
          <div 
            className="flex items-center p-4 rounded-2xl border transition-all duration-300"
            style={{ backgroundColor: 'var(--color-cream)/30', borderColor: 'var(--color-cream-dark)/30' }}
          >
            <div className="w-12 h-12 bg-[var(--color-parchment)] text-purple-600 rounded-full border-2 flex items-center justify-center text-2xl mr-4 shrink-0 shadow-inner" style={{ borderColor: 'var(--color-cream-dark)' }}>
              🧠
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-navy)' }}>History Master</span>
              <span className="text-lg font-bold leading-tight" style={{ color: 'var(--color-navy-dark)', fontFamily: 'var(--font-display)' }}>
                {historyMaster ? historyMaster.name : 'Tidak Ada'}
              </span>
              <span className="text-xs text-[var(--color-navy-light)] opacity-70">
                {historyMaster ? `Menjawab ${historyMaster.correctAnswers} kuis benar` : 'Belum ada kuis terjawab'}
              </span>
            </div>
          </div>

        </div>
        
        {/* Papan Peringkat (Ranking) */}
        <div 
          className="p-6 md:p-8 flex-1 transition-all duration-300"
          style={{ backgroundColor: 'var(--color-cream)/10' }}
        >
          <h3 
            className="text-sm font-bold uppercase tracking-widest mb-4 px-2 text-center"
            style={{ color: 'var(--color-navy-light)', fontFamily: 'var(--font-display)' }}
          >
            Klasemen Akhir
          </h3>
          
          <div className="flex flex-col gap-3">
            {sortedPlayers.map((player, index) => {
              const isChampion = player.id === champion?.id;
              
              let rowBgStyle = "bg-[var(--color-parchment)]/75 border-[var(--color-cream-dark)]/30 hover:bg-[var(--color-cream)]/15 shadow-sm";
              if (isChampion) {
                rowBgStyle = "bg-[var(--color-cream)] border-[var(--color-gold)] shadow-md transform scale-[1.01]";
              }

              // Themed Rank Medals/Badges
              let medalClass = "bg-[var(--color-cream)]/40 text-[var(--color-navy-light)] border border-[var(--color-cream-dark)]/40";
              if (index === 0) {
                medalClass = "bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold)] text-[var(--color-navy-dark)] border border-[var(--color-gold-dark)]";
              } else if (index === 1) {
                medalClass = "bg-gradient-to-br from-[var(--color-cream-dark)] to-[var(--color-cream)] text-[var(--color-navy-light)] border border-[var(--color-cream-dark)]/50";
              } else if (index === 2) {
                medalClass = "bg-gradient-to-br from-[var(--color-wood-light)] to-[var(--color-wood)] text-[var(--color-cream)] border border-[var(--color-wood)]";
              }

              return (
                <div 
                  key={player.id}
                  className={`flex items-center p-4 rounded-xl border-2 transition-all ${rowBgStyle}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mr-4 shrink-0 shadow-sm ${medalClass}`}>
                    #{index + 1}
                  </div>
                  
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span 
                        className="font-bold text-lg"
                        style={{ color: 'var(--color-navy-dark)', fontFamily: 'var(--font-body)' }}
                      >
                        {player.name}
                        {isChampion && (
                          <span 
                            className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider"
                            style={{ backgroundColor: 'var(--color-cream-dark)/40', borderColor: 'var(--color-gold)', color: 'var(--color-gold-dark)' }}
                          >
                            Juara
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-0.5">
                        <span className="flex items-center gap-1"><span className="text-emerald-600">✓</span> {player.correctAnswers} Benar</span>
                        <span className="flex items-center gap-1"><span className="text-rose-600">✗</span> {player.wrongAnswers} Salah</span>
                        <span className="text-amber-700">Petak {player.position}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-end sm:items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">Skor</span>
                      <span 
                        className="text-3xl font-black"
                        style={{ color: isChampion ? 'var(--color-gold-dark)' : 'var(--color-navy-light)' }}
                      >
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
        <div 
          className="p-6 border-t flex flex-col sm:flex-row gap-4 justify-center transition-all duration-300"
          style={{ backgroundColor: 'var(--color-parchment)', borderColor: 'var(--color-cream-dark)/40' }}
        >
          <button
            onClick={() => { playSFX('click'); onPlayAgain?.(); }}
            className="px-8 py-4 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex-1"
            style={{ 
              backgroundColor: 'var(--color-navy)',
              borderColor: 'var(--color-gold)',
              borderWidth: '2px',
              color: 'var(--color-gold-light)',
              fontFamily: 'var(--font-display)'
            }}
          >
            Main Lagi
          </button>
          
          <button
            onClick={() => { playSFX('click'); onMainMenu?.(); }}
            className="px-8 py-4 font-bold rounded-xl transition-all border shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex-1"
            style={{
              backgroundColor: 'var(--color-cream)',
              borderColor: 'var(--color-cream-dark)',
              borderWidth: '2px',
              color: 'var(--color-navy-dark)',
              fontFamily: 'var(--font-display)'
            }}
          >
            Kembali ke Menu
          </button>
        </div>
        
      </div>
    </div>
  );
};
