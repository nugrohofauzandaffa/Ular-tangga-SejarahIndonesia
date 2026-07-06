import React, { useMemo, useEffect } from 'react';
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

  useEffect(() => {
    if (gameState.gameStatus === 'finished') {
      playSFX('popup_result');
    }
  }, [gameState.gameStatus, playSFX]);

  // 1. Leaderboard Ranking & Champion
  const sortedPlayers = useMemo(() => [...gameState.players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.correctAnswers !== a.correctAnswers) return b.correctAnswers - a.correctAnswers;
    return b.position - a.position;
  }), [gameState.players]);

  if (gameState.gameStatus !== 'finished') {
    return null;
  }
  
  const champion = sortedPlayers[0];

  // 2. Fastest Explorer
  const fastestExplorerRaw = gameState.players.find(p => p.id === gameState.fastestExplorer);
  const isChampionFastest = champion.id === fastestExplorerRaw?.id;
  const actualFastestExplorer = isChampionFastest ? null : fastestExplorerRaw;

  // 3. History Master & Sharpshooter Candidates
  const historyMasterCandidates = [...gameState.players].sort((a, b) => {
    if (b.correctAnswers !== a.correctAnswers) return b.correctAnswers - a.correctAnswers;
    const accA = a.correctAnswers + a.wrongAnswers >= 3 ? (a.correctAnswers / (a.correctAnswers + a.wrongAnswers)) * 100 : 0;
    const accB = b.correctAnswers + b.wrongAnswers >= 3 ? (b.correctAnswers / (b.correctAnswers + b.wrongAnswers)) * 100 : 0;
    if (accB !== accA) return accB - accA;
    return b.score - a.score;
  });
  
  const sharpshooterCandidates = [...gameState.players]
    .filter(p => (p.correctAnswers + p.wrongAnswers) >= 3)
    .sort((a, b) => {
      const accA = (a.correctAnswers / (a.correctAnswers + a.wrongAnswers)) * 100;
      const accB = (b.correctAnswers / (b.correctAnswers + b.wrongAnswers)) * 100;
      if (accB !== accA) return accB - accA;
      const totalA = a.correctAnswers + a.wrongAnswers;
      const totalB = b.correctAnswers + b.wrongAnswers;
      if (totalB !== totalA) return totalB - totalA;
      return b.score - a.score;
    });

  // Alokasi Gelar
  const actualHistoryMaster = historyMasterCandidates.find(p => p.id !== champion.id && p.correctAnswers > 0);
  const actualSharpshooter = sharpshooterCandidates.find(p => p.id !== champion.id && p.id !== actualHistoryMaster?.id);

  // Penentuan Slot Panel 1 & 2
  let slot1 = null;
  let slot2 = null;

  if (isChampionFastest) {
    // Skenario A
    if (actualHistoryMaster) slot1 = { type: 'history', player: actualHistoryMaster };
    if (actualSharpshooter) slot2 = { type: 'sharpshooter', player: actualSharpshooter };
  } else {
    // Skenario B
    if (actualFastestExplorer) slot1 = { type: 'fastest', player: actualFastestExplorer };
    if (actualHistoryMaster) slot2 = { type: 'history', player: actualHistoryMaster };
    else if (actualSharpshooter) slot2 = { type: 'sharpshooter', player: actualSharpshooter };
  }

  const isJakarta = currentTheme.id === 'jakarta-heritage';

  // Helper: Render Kartu Achievement
  const renderAchievementCard = (slot: { type: string, player: any } | null) => {
    if (!slot) {
      return (
        <div className="flex items-center p-3 sm:p-4 rounded-2xl border transition-all duration-300 opacity-60" style={{ backgroundColor: 'var(--color-cream)/30', borderColor: 'var(--color-cream-dark)/30' }}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--color-parchment)] text-slate-400 rounded-full border-2 flex items-center justify-center text-xl sm:text-2xl mr-3 shrink-0 shadow-inner" style={{ borderColor: 'var(--color-cream-dark)' }}>
            -
          </div>
          <div className="flex flex-col">
             <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-navy)' }}>Slot Kosong</span>
             <span className="text-sm font-bold leading-tight" style={{ color: 'var(--color-navy-dark)' }}>Tidak Ada yang Memenuhi Syarat</span>
          </div>
        </div>
      );
    }

    if (slot.type === 'fastest') {
      return (
        <div className="flex items-center p-3 sm:p-4 rounded-2xl border transition-all duration-300" style={{ backgroundColor: 'var(--color-cream)/30', borderColor: 'var(--color-cream-dark)/30' }}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--color-parchment)] text-emerald-600 rounded-full border-2 flex items-center justify-center text-xl sm:text-2xl mr-3 shrink-0 shadow-inner" style={{ borderColor: 'var(--color-cream-dark)' }}>
            🏃
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-navy)' }}>Fastest Explorer</span>
            <span className="text-base sm:text-lg font-bold leading-tight" style={{ color: 'var(--color-navy-dark)', fontFamily: 'var(--font-display)' }}>
              {slot.player.name}
            </span>
            <span className="text-[10px] sm:text-xs text-[var(--color-navy-light)] opacity-70">Pertama mencapai petak 100</span>
          </div>
        </div>
      );
    }

    if (slot.type === 'history') {
      return (
        <div className="flex items-center p-3 sm:p-4 rounded-2xl border transition-all duration-300" style={{ backgroundColor: 'var(--color-cream)/30', borderColor: 'var(--color-cream-dark)/30' }}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--color-parchment)] text-purple-600 rounded-full border-2 flex items-center justify-center text-xl sm:text-2xl mr-3 shrink-0 shadow-inner" style={{ borderColor: 'var(--color-cream-dark)' }}>
            🧠
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-navy)' }}>History Master</span>
            <span className="text-base sm:text-lg font-bold leading-tight" style={{ color: 'var(--color-navy-dark)', fontFamily: 'var(--font-display)' }}>
              {slot.player.name}
            </span>
            <span className="text-[10px] sm:text-xs text-[var(--color-navy-light)] opacity-70">Menjawab {slot.player.correctAnswers} kuis benar</span>
          </div>
        </div>
      );
    }

    if (slot.type === 'sharpshooter') {
      const acc = Math.round((slot.player.correctAnswers / (slot.player.correctAnswers + slot.player.wrongAnswers)) * 100);
      return (
        <div className="flex items-center p-3 sm:p-4 rounded-2xl border transition-all duration-300" style={{ backgroundColor: 'var(--color-cream)/30', borderColor: 'var(--color-cream-dark)/30' }}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--color-parchment)] text-orange-600 rounded-full border-2 flex items-center justify-center text-xl sm:text-2xl mr-3 shrink-0 shadow-inner" style={{ borderColor: 'var(--color-cream-dark)' }}>
            🎯
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-navy)' }}>The Sharpshooter</span>
            <span className="text-base sm:text-lg font-bold leading-tight" style={{ color: 'var(--color-navy-dark)', fontFamily: 'var(--font-display)' }}>
              {slot.player.name}
            </span>
            <span className="text-[10px] sm:text-xs text-[var(--color-navy-light)] opacity-70">Akurasi tebakan {acc}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none animate-fade-in">
      <Confetti />
      <div 
        className={`w-full max-w-2xl max-h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-500 transition-all duration-300 ${
          isJakarta ? 'gigi-balang-top gigi-balang-bottom border-y-8 pt-1 pb-1' : 'border-2'
        }`}
        style={{ 
          backgroundColor: 'var(--color-parchment)',
          borderColor: 'var(--color-wood)' 
        }}
      >
        
        {/* Header Hasil - Champion */}
        <div 
          className="text-white p-4 sm:p-6 text-center relative overflow-hidden transition-all duration-300 shrink-0"
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
          
          <div className="mt-2 mb-1 relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-full border-4 border-[var(--color-cream)] shadow-xl flex items-center justify-center mb-3 relative animate-bounce">
              <span className="text-4xl sm:text-5xl drop-shadow-md">🏆</span>
              <div className="absolute -bottom-2 bg-[var(--color-cream)] border border-[var(--color-gold)] text-[var(--color-navy-dark)] text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                Juara
              </div>
            </div>
            <h2 
              className="text-2xl sm:text-3xl font-extrabold drop-shadow-md mb-1 font-display uppercase tracking-wide"
              style={{ color: 'var(--color-gold)' }}
            >
              {champion?.name}
            </h2>
            
            {/* Bypass Visual: Jika Juara Utama juga adalah Fastest Explorer (Skenario A) */}
            {isChampionFastest && (
              <div className="flex items-center gap-1.5 mb-2 bg-[var(--color-navy-dark)]/50 border border-[var(--color-gold)]/50 px-3 py-1 rounded-full shadow-inner">
                <span className="text-emerald-400 text-sm">🏃</span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--color-cream)]">Fastest Explorer</span>
              </div>
            )}

            <p className="font-semibold text-sm sm:text-base" style={{ color: 'var(--color-cream)' }}>
              Berhasil mengumpulkan {champion?.score} Poin!
            </p>
          </div>
        </div>

        {/* Special Achievements Panel */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 p-3 sm:p-4 border-b transition-all duration-300 shrink-0"
          style={{ backgroundColor: 'var(--color-cream)/20', borderColor: 'var(--color-cream-dark)/30' }}
        >
          {/* Dynamic Slots based on Allocation */}
          {renderAchievementCard(slot1)}
          {renderAchievementCard(slot2)}
        </div>
        
        {/* Papan Peringkat (Ranking) */}
        <div 
          className="p-2 sm:p-4 flex-1 flex flex-col transition-all duration-300 overflow-hidden"
          style={{ backgroundColor: 'var(--color-cream)/10' }}
        >
          <h3 
            className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2 px-2 text-center shrink-0"
            style={{ color: 'var(--color-navy-light)', fontFamily: 'var(--font-display)' }}
          >
            Klasemen Akhir
          </h3>
          
          <div className="flex flex-col gap-1.5 overflow-y-auto hide-scrollbar pr-1 pb-1">
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
                  className={`flex items-center p-1.5 sm:p-2.5 rounded-xl border-2 transition-all ${rowBgStyle}`}
                >
                  <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs mr-2 sm:mr-3 shrink-0 shadow-sm ${medalClass}`}>
                    #{index + 1}
                  </div>
                  
                  <div className="flex-1 flex flex-row items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span 
                        className="font-bold text-sm sm:text-base leading-tight"
                        style={{ color: 'var(--color-navy-dark)', fontFamily: 'var(--font-body)' }}
                      >
                        {player.name}
                        {isChampion && (
                          <span 
                            className="ml-1.5 text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider"
                            style={{ backgroundColor: 'var(--color-cream-dark)/40', borderColor: 'var(--color-gold)', color: 'var(--color-gold-dark)' }}
                          >
                            Juara
                          </span>
                        )}
                      </span>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] sm:text-[11px] text-slate-500 font-medium mt-0.5">
                        <span className="flex items-center gap-0.5"><span className="text-emerald-600">✓</span> {player.correctAnswers} Benar</span>
                        <span className="flex items-center gap-0.5"><span className="text-rose-600">✗</span> {player.wrongAnswers} Salah</span>
                        {player.correctAnswers + player.wrongAnswers > 0 && (
                          <span className="text-orange-600 font-bold">🎯 {Math.round((player.correctAnswers / (player.correctAnswers + player.wrongAnswers)) * 100)}%</span>
                        )}
                        <span className="text-amber-700">Petak {player.position}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">Skor</span>
                      <span 
                        className="text-xl sm:text-2xl font-black"
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
          className="p-4 border-t flex flex-col sm:flex-row gap-3 justify-center transition-all duration-300 shrink-0"
          style={{ backgroundColor: 'var(--color-parchment)', borderColor: 'var(--color-cream-dark)/40' }}
        >
          <button
            onClick={() => { playSFX('click'); onPlayAgain?.(); }}
            className="px-6 py-3 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex-1 text-sm"
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
