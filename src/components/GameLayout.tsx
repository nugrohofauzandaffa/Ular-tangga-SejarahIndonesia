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

import { GAME_CONSTANTS } from '@/constants/game';
import { getCoordinates, getSnakeCurveParams, getBezierPoint } from '@/utils/geometry';
import { useGameFeedbackPipeline } from '@/hooks/useGameFeedbackPipeline';

import { calculateMovement, calculateMovementPath } from '@/lib/movement';
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
  const [transitioningPlayers, setTransitioningPlayers] = useState<Record<string, { x: number, y: number }>>({});

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
  const [autoRollDouble, setAutoRollDouble] = useState(false);
  
  const [showHeadline, setShowHeadline] = useState(false);
  const [latestLog, setLatestLog] = useState<any>(null);
  const [latestLogId, setLatestLogId] = useState<string | null>(null);

  useEffect(() => {
    if (gameState.logs && gameState.logs.length > 0) {
      const newLog = gameState.logs[gameState.logs.length - 1];
      
      if (newLog.id !== latestLogId) {
        setLatestLogId(newLog.id);
        
        const isAlertPhase = newLog.message.toLowerCase().includes('seseorang sudah memasuki');
        if (newLog.type === 'bonus' || newLog.type === 'penalty' || isAlertPhase) {
          setLatestLog(newLog);
          setShowHeadline(true);
        }
      }
    }
  }, [gameState.logs, latestLogId]);

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
  const [isDesktopLogOpen, setIsDesktopLogOpen] = useState(false);

  const { playBGM, stopBGM, playSFX } = useAudio();
  const { triggerLandingFeedback, triggerScreenShake, prefersReducedMotion } = useGameFeedbackPipeline();

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
      triggerScreenShake(); // Screen shake effect untuk Game Juice
    }
    prevCrisisState.current = !!gameState.isCrisisPhaseActive;
  }, [gameState.isCrisisPhaseActive, playSFX, triggerScreenShake]);

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
      if (autoRollDouble) {
        setAutoRollDouble(false);
        const timer = setTimeout(() => {
          handleRollDice();
        }, 1000); // Tunggu 1 detik agar pemain sempat melihat log
        return () => clearTimeout(timer);
      }

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

  const triggerPostEffects = (result: ProcessTurnResult) => {
    if (result.antiSnakeTriggered) {
      setShowAntiSnakeToast(true);
      playSFX('ladder'); // Suara positif saat selamat
      setTimeout(() => setShowAntiSnakeToast(false), 2500);
    }

    if (result.tileEvent?.type === 'Quiz' && result.tileEvent.contentId) {
      setActiveQuestionId(result.tileEvent.contentId);
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
  };

  // Orkestrasi langkah animasi hop-by-hop
  const executeHopAnimation = (result: ProcessTurnResult) => {
    const activePlayerId = gameState.currentTurn;
    const originalPos = gameState.players.find(p => p.id === activePlayerId)?.position || 1;
    const diceValue = result.newState.dice.currentValue;
    
    // Generate path
    const path = calculateMovementPath(originalPos, diceValue);
    
    if (path.length === 0) {
       applyGameResult(result, originalPos);
       return;
    }

    let step = 0;
    const hopNext = () => {
      if (step < path.length) {
        // PENTING: capture nilai step saat ini ke konstanta lokal.
        // setGameState menerima updater function yang dipanggil secara async oleh React.
        // Tanpa ini, 'step' sudah ter-increment saat updater berjalan → urutan petak acak.
        const currentStep = step;
        const isLanding = currentStep === path.length - 1;

        setGameState(prev => {
          const newPlayers = prev.players.map(p =>
            p.id === activePlayerId ? { ...p, position: path[currentStep] } : p
          );
          return { ...prev, players: newPlayers };
        });

        playSFX('click');
        if (isLanding) {
          triggerLandingFeedback(0, 0, true);
        }

        step++;
        setTimeout(hopNext, GAME_CONSTANTS.ANIMATION.HOP_DURATION_MS);
      } else {
        // Seluruh langkah selesai — terapkan hasil permainan (ular/tangga/event)
        setTimeout(() => {
          applyGameResult(result, path[path.length - 1]);
        }, GAME_CONSTANTS.ANIMATION.HOP_DELAY_MS);
      }
    };
    
    hopNext();
  };

  // Fungsi utilitas untuk mengeksekusi hasil akhir permainan ke state utama
  const applyGameResult = (result: ProcessTurnResult, landedPos?: number) => {
    // Cek apakah ada perpindahan karena ular atau tangga
    if (result.pathEvent && !result.antiSnakeTriggered) {
      const isSnake = result.pathEvent.type === 'Snake';
      playSFX(isSnake ? 'snake' : 'ladder');
      
      const activePlayerId = gameState.currentTurn;
      // Pion seharusnya sudah berada di petak event karena executeHopAnimation
      const startPos = landedPos || gameState.players.find(p => p.id === activePlayerId)?.position || 1; 
      const endPos = result.pathEvent.end || 1;
      
      const start = getCoordinates(startPos);
      const end = getCoordinates(endPos);
      
      let snakeParams: ReturnType<typeof getSnakeCurveParams> | null = null;
      if (isSnake) {
        snakeParams = getSnakeCurveParams(startPos, endPos);
      }

      // Bypass manual animation for Reduced Motion
      if (prefersReducedMotion) {
        setGameState(result.newState);
        setTimeout(() => triggerPostEffects(result), 100);
        return;
      }

      const duration = GAME_CONSTANTS.ANIMATION.SNAKE_LADDER_DURATION_MS;
      const startTime = performance.now();

      const animate = (time: number) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-in-out quadratic)
        const easeProgress = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        let x: number, y: number;
        
        if (isSnake && snakeParams) {
          x = getBezierPoint(easeProgress, snakeParams.head.x, snakeParams.cx1, snakeParams.cx2, snakeParams.tail.x);
          y = getBezierPoint(easeProgress, snakeParams.head.y, snakeParams.cy1, snakeParams.cy2, snakeParams.tail.y);
        } else {
          // Tangga bergerak lurus
          x = start.x + (end.x - start.x) * easeProgress;
          y = start.y + (end.y - start.y) * easeProgress;
        }

        setTransitioningPlayers(prev => ({
          ...prev,
          [activePlayerId]: { x, y }
        }));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Animasi Selesai
          setTransitioningPlayers(prev => {
            const next = { ...prev };
            delete next[activePlayerId];
            return next;
          });
          
          setGameState(result.newState);
          setTimeout(() => triggerPostEffects(result), GAME_CONSTANTS.ANIMATION.POST_EVENT_DELAY_MS);
        }
      };

      requestAnimationFrame(animate);
      
    } else {
      // Normal movement
      setGameState(result.newState);
      setTimeout(() => triggerPostEffects(result), 0);
    }
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

    // 2. Tunggu durasi rolling (400ms), lalu hentikan animasi dadu untuk menampilkan hasilnya
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        dice: { ...prev.dice, isRolling: false }
      }));

      // 3. Beri jeda 600ms agar pemain dapat membaca angka dadu, lalu eksekusi pergerakan pion
      setTimeout(() => {
        if (result.diceModifierInfo) {
          // Intercept: Tahan pergerakan pion, tampilkan modal animasi matematika
          setPendingGameResult(result);
          setShowDiceModifierModal(result.diceModifierInfo);
        } else {
          // Normal: Mulai animasi hop-by-hop
          executeHopAnimation(result);
        }
      }, 600);
    }, 400);
  };

  const handleAcknowledgeDiceModifier = () => {
    setShowDiceModifierModal(null);
    if (pendingGameResult) {
      executeHopAnimation(pendingGameResult);
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
    const wasPlayer = gameState.currentTurn;
    const hasDoubleRoll = gameState.players.find(p => p.id === wasPlayer)?.activeEffects.some(e => e.type === 'DoubleRoll');

    setGameState(prev => acknowledgeEffect(prev));
    setActiveEffect(null);
    
    if (hasDoubleRoll) {
      setAutoRollDouble(true);
    }
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

  // State untuk efek screen shake
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const handleShake = () => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500); // Shake duration
    };
    window.addEventListener('game:screenshake', handleShake);
    return () => window.removeEventListener('game:screenshake', handleShake);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 text-slate-500">
        Memuat Permainan...
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-900 relative ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
      {/* Turn Banner Overlay */}
      {showTurnBanner && gameState.gameStatus === 'idle' && (
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 z-[40] animate-in slide-in-from-top-10 fade-in zoom-in duration-300 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm border-2 border-blue-500 text-blue-800 font-bold px-4 py-2 sm:px-8 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl">{activePlayer?.isBot ? '🤖' : '👤'}</span>
            <span className="text-sm sm:text-xl tracking-wide uppercase">Giliran {activePlayer?.name}</span>
          </div>
        </div>
      )}

      {/* Top Bar Overlay (Log Button & Headline) */}
      <div className="fixed top-[64px] sm:top-[72px] left-0 right-0 z-[48] pointer-events-none flex justify-between items-start px-2 sm:px-4">
        {/* Left: Log Button */}
        <button
          onClick={() => {
            playSFX('click');
            if (window.innerWidth >= 1024) setIsDesktopLogOpen(!isDesktopLogOpen);
            else setIsMobileLogOpen(true);
          }}
          className={`w-10 h-10 sm:w-12 sm:h-12 bg-white text-slate-700 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center text-lg sm:text-xl pointer-events-auto border border-slate-200 transition-transform hover:scale-105 active:scale-95 ${isDesktopLogOpen ? 'lg:hidden' : ''}`}
        >
          📝
        </button>

        {/* Middle: Headline Text */}
        <div className="flex-1 mx-2 flex justify-center pointer-events-auto overflow-hidden">
          {latestLog && showHeadline && (
            <div className="bg-white/95 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.1)] border-2 border-blue-100 rounded-full py-2 flex w-full overflow-hidden animate-in fade-in slide-in-from-top-4 slide-out-to-top-4">
              <div 
                className="whitespace-nowrap w-full animate-[marquee_8s_linear_forwards] min-w-full px-4 text-xs sm:text-sm font-bold text-slate-700"
                onAnimationEnd={() => setShowHeadline(false)}
              >
                {latestLog.message}
              </div>
            </div>
          )}
        </div>

        {/* Right: Settings Placeholder (Occupied by FloatingAudioControl) */}
        <div className="w-10 sm:w-12 shrink-0" />
      </div>

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
      <header
        className="h-14 shrink-0 flex items-center justify-center px-4 z-10 relative"
        style={{
          backgroundColor: 'var(--color-navy)',
          borderBottom: '2px solid var(--color-gold)',
          boxShadow: '0 2px 12px rgba(30,58,95,0.3)',
        }}
      >
        <div className="flex flex-col items-center">
          <h1
            className="text-base font-black tracking-wide leading-none"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold-light)' }}
          >
            Ular Tangga Sejarah
          </h1>
          <p className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: 'rgba(201,168,76,0.6)' }}>
            Nusantara
          </p>
        </div>
      </header>


      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-0 relative z-0">

        {/* Desktop Game Log Sidebar */}
        <aside 
          className={`hidden lg:flex absolute top-0 bottom-0 left-0 z-40 transition-transform duration-300 ${isDesktopLogOpen ? 'translate-x-0' : '-translate-x-full'} w-[25%] xl:w-[28%] bg-[#fdf6e3] border-r border-[#e0d6b8] p-4 flex-col shadow-2xl`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-slate-800">Game Log</h2>
            <button
              onClick={() => { playSFX('click'); setIsDesktopLogOpen(false); }}
              className="p-2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>
          <GameLogBox logs={gameState.logs} className="flex-1 min-h-0 shadow-none bg-transparent" title="" />
        </aside>

        {/* Board Container (Center) */}
        <section className="h-[60%] lg:h-auto lg:flex-1 w-full overflow-y-auto p-4 flex flex-col items-center justify-center lg:pb-4 relative">
          {/* Meneruskan referensi data tiles asli, players, dan state animasi per-frame */}
          <Board 
            tiles={currentBoard} 
            players={gameState.players} 
            transitioningPlayers={transitioningPlayers} 
          />
        </section>

        {/* Desktop Control Area (Right Side) */}
        <aside className="hidden lg:flex lg:w-[25%] xl:w-[28%] shrink-0 bg-white border-l border-slate-200 p-6 flex-col gap-6 overflow-y-auto shadow-sm z-10">
          <HUD activePlayer={activePlayer} players={gameState.players} layout="desktop" />
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
                onClick={() => { playSFX('click'); setIsMobileLogOpen(false); }}
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
