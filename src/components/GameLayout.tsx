"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Board from './papan/Board';
import { Dice } from './dice/Dice';
import { HUD } from './ui/HUD';
import { QuizModal } from './quiz/QuizModal';
import { ResultScreen } from './ui/ResultScreen';
import { EffectModal } from './ui/EffectModal';
import { GameLogBox } from './ui/GameLogBox';
import { FloatingAudioControl } from './ui/FloatingAudioControl';
import { CrisisAlertModal } from './ui/CrisisAlertModal';
import { useAudio } from '@/contexts/AudioContext';

import { Player, PlayerEffect } from '@/types/player';
import { GameState } from '@/types/gameState';
import { Tile } from '@/types/board';

import { generateRandomBoard } from '@/data/papan/board';
import { snakes } from '@/data/papan/snakes';
import { ladders } from '@/data/papan/ladders';
import { questions } from '@/data/questions';

import {
  processTurn,
  submitQuizAnswer,
  acknowledgeQuizResult,
  acknowledgeEffect,
  GameEngineContext,
  ProcessTurnResult
} from '@/lib/gameEngine';
import { DiceModifierModal, DiceModifierInfo } from './ui/DiceModifierModal';

export interface GameLayoutProps {
  initialPlayers: Player[];
  onMainMenu: () => void;
}

export default function GameLayout({ initialPlayers, onMainMenu }: GameLayoutProps) {
  const [currentBoard, setCurrentBoard] = useState<Tile[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const [gameState, setGameState] = useState<GameState>({
    players: initialPlayers,
    currentTurn: initialPlayers[0].id,
    winner: null,
    fastestExplorer: null,
    gameStatus: 'idle',
    dice: { currentValue: 1, isRolling: false },
    logs: [],
  });
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [activeEffect, setActiveEffect] = useState<PlayerEffect | null>(null);
  const [isMobileLogOpen, setIsMobileLogOpen] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const prevCrisisState = React.useRef<boolean>(false);

  // State untuk banner giliran
  const [showTurnBanner, setShowTurnBanner] = useState(true);

  // State untuk Pop-up Modifier Dadu
  const [diceModifierPopup, setDiceModifierPopup] = useState<{
    original: number;
    final: number;
    type: 'DecreasedRoll' | 'AbsoluteRoll';
  } | null>(null);

  // State interceptor untuk efek dadu (DecreasedRoll / AbsoluteRoll)
  const [pendingGameResult, setPendingGameResult] = useState<ProcessTurnResult | null>(null);
  const [showDiceModifierModal, setShowDiceModifierModal] = useState<DiceModifierInfo | null>(null);

  // State untuk toast anti-snake
  const [showAntiSnakeToast, setShowAntiSnakeToast] = useState(false);

  const { playBGM, stopBGM, playSFX } = useAudio();

  // Memutar BGM saat permainan dimulai
  useEffect(() => {
    playBGM('game');
    return () => stopBGM('game');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Inisialisasi Papan
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentBoard(generateRandomBoard());
    setIsMounted(true);
  }, []);

  // Menyusun context yang berisi data statis map/events
  const gameContext = useMemo<GameEngineContext>(() => ({
    board: currentBoard,
    snakes,
    ladders,
    questions,
  }), [currentBoard]);

  const activePlayer = gameState.players.find(p => p.id === gameState.currentTurn) || gameState.players[0];

  // Pantau perubahan Fase Krisis untuk memunculkan modal
  useEffect(() => {
    if (gameState.isCrisisPhaseActive && !prevCrisisState.current) {
      setShowCrisisModal(true);
      playSFX('ladder'); // Suara notifikasi
    }
    prevCrisisState.current = !!gameState.isCrisisPhaseActive;
  }, [gameState.isCrisisPhaseActive, playSFX]);

  // Pantau perubahan giliran untuk menampilkan Turn Banner
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowTurnBanner(true);
    const timer = setTimeout(() => {
      setShowTurnBanner(false);
    }, 1500); // Tampil selama 1.5 detik
    return () => clearTimeout(timer);
  }, [gameState.currentTurn]);

  // Eksekusi otomatis lompat giliran jika terkena Silence
  useEffect(() => {
    if (gameState.gameStatus === 'idle' && activePlayer) {
      const hasSilence = activePlayer.activeEffects.some(e => e.type === 'Silence');
      if (hasSilence) {
        // Tampilkan notifikasi instan dan proses turn
        const timeout = setTimeout(() => {
          setGameState(prev => processTurn(prev, gameContext).newState);
          playSFX('wrong');
        }, 2000);
        return () => clearTimeout(timeout);
      }
    }
  }, [gameState.gameStatus, gameState.currentTurn, activePlayer, gameContext, playSFX]);

  // Fungsi utilitas untuk mengeksekusi hasil permainan ke state utama
  const applyGameResult = (result: ProcessTurnResult) => {
    setGameState(result.newState);

    setTimeout(() => {
      if (result.antiSnakeTriggered) {
        setShowAntiSnakeToast(true);
        playSFX('ladder'); // Suara positif saat selamat
        setTimeout(() => setShowAntiSnakeToast(false), 2500);
      }

      if (result.tileEvent?.type === 'Quiz' && result.tileEvent.contentId) {
        setActiveQuestionId(result.tileEvent.contentId);
      } else {
        setGameState(prev => ({ ...prev, gameStatus: 'idle' }));
      }

      // Tampilkan Pop-up Modifier Dadu jika ada
      if (result.diceModifierInfo) {
        setDiceModifierPopup(result.diceModifierInfo);
        setTimeout(() => setDiceModifierPopup(null), 3500);
      }

      if (result.acquiredEffect) {
        setActiveEffect(result.acquiredEffect);

        const isBuff = ['AntiSnake', 'DoubleRoll', 'StealPoint'].includes(result.acquiredEffect.type);
        if (isBuff) {
          playSFX('ladder');
        } else {
          playSFX('snake');
        }
      } else {
        setActiveEffect(null);
      }
    }, 0);
  };

  // Handler untuk memulai giliran (melempar dadu)
  const handleRollDice = () => {
    if (gameState.gameStatus !== 'idle') return;

    playSFX('dice');

    // Kalkulasi pergerakan secara synchronous di belakang layar menggunakan state saat ini
    const result = processTurn(gameState, gameContext);

    // 1. Ubah state ke rolling untuk trigger animasi dadu di UI
    setGameState(prev => ({
      ...prev,
      gameStatus: 'rolling_dice',
      dice: { currentValue: result.newState.dice.currentValue, isRolling: true }
    }));

    // 2. Tunggu animasi selesai, lalu eksekusi logika permainan atau cegat (intercept) jika ada efek modifikasi dadu
    setTimeout(() => {
      if (result.diceModifierInfo) {
        // Intercept: Tahan pergerakan pion, tampilkan modal animasi matematika
        setPendingGameResult(result);
        setShowDiceModifierModal(result.diceModifierInfo);
      } else {
        // Normal: Terapkan hasil langsung
        applyGameResult(result);
      }
    }, 600);
  };

  const handleAcknowledgeDiceModifier = () => {
    setShowDiceModifierModal(null);
    if (pendingGameResult) {
      applyGameResult(pendingGameResult);
      setPendingGameResult(null);
    }
  };

  // Handler ketika pemain menjawab kuis di Modal
  const handleQuizAnswer = (answer: string) => {
    if (!activeQuestionId) return;

    // Check if correct
    const question = questions.find(q => q.id === activeQuestionId);
    if (question) {
      if (question.correctAnswer === answer) {
        playSFX('correct');
      } else {
        playSFX('wrong');
      }
    }

    setGameState(prev => submitQuizAnswer(prev, gameContext, activeQuestionId, answer));
  };

  // Handler ketika pemain selesai membaca penjelasan kuis dan menutup modal
  const handleAcknowledgeQuiz = () => {
    setGameState(prev => acknowledgeQuizResult(prev));
    setActiveQuestionId(null);
  };

  const handleAcknowledgeEffect = () => {
    setGameState(prev => acknowledgeEffect(prev));
    setActiveEffect(null);
  };

  // Handler restart permainan
  const handlePlayAgain = () => {
    setCurrentBoard(generateRandomBoard());
    const resetPlayers = initialPlayers.map(p => ({
      ...p,
      position: 1,
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      activeEffects: [],
    }));
    setGameState({
      players: resetPlayers,
      currentTurn: resetPlayers[0].id,
      winner: null,
      fastestExplorer: null,
      gameStatus: 'idle',
      dice: { currentValue: 1, isRolling: false },
      logs: [],
    });
    setActiveQuestionId(null);
    setActiveEffect(null);
  };

  // Ambil soal aktif (jika ada) untuk dilempar ke QuizModal
  const activeQuestion = activeQuestionId
    ? questions.find(q => q.id === activeQuestionId) || null
    : null;

  // --- Bot Controller ---
  useEffect(() => {
    if (gameState.gameStatus === 'finished') return;

    if (showCrisisModal && activePlayer?.isBot) {
      const timeoutId = setTimeout(() => {
        setShowCrisisModal(false);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }

    if (showCrisisModal) return; // Jangan lakukan aksi lain jika modal sedang terbuka

    if (activePlayer?.isBot) {
      let timeoutId: NodeJS.Timeout;

      switch (gameState.gameStatus) {
        case 'idle':
          const hasSilence = activePlayer.activeEffects.some(e => e.type === 'Silence');
          if (!hasSilence) {
            timeoutId = setTimeout(() => {
              handleRollDice();
            }, 1500);
          }
          break;
        case 'showing_quiz_result':
          timeoutId = setTimeout(() => {
            handleAcknowledgeQuiz();
          }, 2500);
          break;
        case 'showing_effect':
          timeoutId = setTimeout(() => {
            handleAcknowledgeEffect();
          }, 2500);
          break;
      }

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.gameStatus, gameState.currentTurn, activePlayer, activeQuestion, showCrisisModal]);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 text-slate-500">
        Memuat Permainan...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-900 relative">
      {/* Turn Banner Overlay */}
      {showTurnBanner && gameState.gameStatus === 'idle' && (
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 z-[40] animate-in slide-in-from-top-10 fade-in zoom-in duration-300 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm border-2 border-blue-500 text-blue-800 font-bold px-8 py-3 rounded-full shadow-2xl flex items-center gap-3">
            <span className="text-2xl">{activePlayer?.isBot ? '🤖' : '👤'}</span>
            <span className="text-xl tracking-wide uppercase">Giliran {activePlayer?.name}</span>
          </div>
        </div>
      )}

      {/* Pop-up Modifier Dadu (DecreasedRoll / AbsoluteRoll) */}
      {diceModifierPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white/95 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-2xl border-4 border-red-500 flex flex-col items-center animate-in zoom-in duration-300 transform scale-110">
            <h3 className="text-xl font-extrabold text-red-600 mb-2 uppercase tracking-widest">
              {diceModifierPopup.type === 'DecreasedRoll' ? 'Kelelahan!' : 'Batas Kecepatan!'}
            </h3>
            <div className="flex items-center gap-4 text-4xl font-black">
              <span className="text-slate-400 line-through">{diceModifierPopup.original}</span>
              <span className="text-red-500">➔</span>
              <span className="text-red-600 text-6xl">{diceModifierPopup.final}</span>
            </div>
            <p className="mt-2 text-sm font-bold text-slate-600">
              {diceModifierPopup.type === 'DecreasedRoll' ? 'Hasil dadu dikurangi 2' : 'Hasil dadu dibatasi maksimal 4'}
            </p>
          </div>
        </div>
      )}

      {/* AntiSnake Toast Overlay */}
      {showAntiSnakeToast && (
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 z-[45] animate-in slide-in-from-bottom-10 fade-in duration-300 pointer-events-none">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-6 py-3 rounded-xl shadow-2xl border-2 border-green-300 flex items-center gap-3">
            <span className="text-3xl animate-bounce">🛡️</span>
            <span className="text-lg uppercase tracking-wider">Gigitan Ular Tertahan!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="h-16 shrink-0 bg-white shadow-sm flex flex-col items-center justify-center px-4 z-10 relative">
        <h1 className="text-xl font-bold">Ular Tangga Sejarah Indonesia</h1>
        <p className="text-xs text-slate-500">Belajar Sejarah Sambil Bermain</p>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-0 relative z-0">

        {/* Board Container (Center/Top on Mobile, Center/Left on Desktop) */}
        <section className="h-[60%] lg:h-auto lg:w-[70%] w-full overflow-y-auto p-4 flex flex-col items-center justify-center lg:pb-4">
          {/* Meneruskan referensi data tiles asli dan players yang dinamis */}
          <Board tiles={currentBoard} players={gameState.players} />
        </section>

        {/* Desktop Control Area (Right Side) */}
        <aside className="hidden lg:flex lg:w-[30%] shrink-0 bg-white border-l border-slate-200 p-6 flex-col gap-6 overflow-y-auto shadow-sm z-10">
          <HUD activePlayer={activePlayer} players={gameState.players} layout="desktop" />
          <GameLogBox logs={gameState.logs} className="flex-1 min-h-0" />
          <div className="mt-auto p-4 bg-slate-100 rounded-lg text-center border border-slate-200 min-h-[150px] flex items-center justify-center shrink-0">
            <Dice
              diceState={gameState.dice}
              onRoll={handleRollDice}
              disabled={gameState.gameStatus !== 'idle' || activePlayer?.isBot || activePlayer?.activeEffects.some(e => e.type === 'Silence')}
              layout="vertical"
            />
          </div>
        </aside>

        {/* Mobile Bottom Panel (Takes remaining vertical space on small screens) */}
        <div className="lg:hidden h-[40%] w-full bg-white border-t border-slate-200 p-4 pb-safe flex flex-col gap-4 items-center justify-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 overflow-y-auto relative">
          <div className="w-full">
            <HUD activePlayer={activePlayer} players={gameState.players} layout="mobile" />
          </div>
          <div className="flex-none flex justify-center mt-2 relative w-full">
            <button
              onClick={() => setIsMobileLogOpen(true)}
              className="absolute left-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 shadow-sm border border-slate-200 flex items-center gap-2 text-xs font-semibold transition-colors"
            >
              <span>📝</span> Log
            </button>
            <Dice
              diceState={gameState.dice}
              onRoll={handleRollDice}
              disabled={gameState.gameStatus !== 'idle' || activePlayer?.isBot || activePlayer?.activeEffects.some(e => e.type === 'Silence')}
              layout="vertical"
            />
          </div>
        </div>

      </main>

      {/* Quiz Modal */}
      <QuizModal
        question={activeQuestion}
        isOpen={gameState.gameStatus === 'answering_quiz' || gameState.gameStatus === 'showing_quiz_result'}
        onSubmit={handleQuizAnswer}
        onComplete={() => {
          // Menutup kuis dan berpindah giliran
          handleAcknowledgeQuiz();
        }}
        isBotTurn={activePlayer?.isBot}
      />

      <ResultScreen
        gameState={gameState}
        onPlayAgain={handlePlayAgain}
        onMainMenu={onMainMenu}
      />

      {/* Effect Modal */}
      {gameState.gameStatus === 'showing_effect' && activeEffect && (
        <EffectModal
          effect={activeEffect}
          onAcknowledge={handleAcknowledgeEffect}
          isBotTurn={activePlayer?.isBot}
        />
      )}

      {/* Mobile Log Modal */}
      {isMobileLogOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex flex-col justify-end lg:hidden">
          <div className="bg-white rounded-t-2xl h-[70vh] flex flex-col p-4 shadow-xl">
            <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="font-bold text-lg text-slate-800">Game Log</h2>
              <button
                onClick={() => setIsMobileLogOpen(false)}
                className="p-2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 bg-slate-50 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
            <GameLogBox logs={gameState.logs} className="flex-1 border-none shadow-none" title="" />
          </div>
        </div>
      )}

      {/* Crisis Alert Modal */}
      <CrisisAlertModal
        isOpen={showCrisisModal}
        onAcknowledge={() => setShowCrisisModal(false)}
        isBotTurn={activePlayer?.isBot}
      />

      {/* Dice Modifier Interceptor Modal */}
      <DiceModifierModal
        info={showDiceModifierModal}
        onAcknowledge={handleAcknowledgeDiceModifier}
        isBotTurn={activePlayer?.isBot}
      />

      {/* Floating Audio Control */}
      <FloatingAudioControl />
    </div>
  );
}
