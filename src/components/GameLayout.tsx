"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Board from './papan/Board';
import { Dice } from './dice/Dice';
import { HUD } from './ui/HUD';
import { QuizModal } from '@/components/quiz/QuizModal';
import { ResultScreen } from '@/components/ui/ResultScreen';
import { EffectModal } from '@/components/ui/EffectModal';
import { GameLogBox } from '@/components/ui/GameLogBox';
import { FloatingAudioControl } from '@/components/ui/FloatingAudioControl';
import { CrisisAlertModal } from '@/components/ui/CrisisAlertModal';
import { useAudio } from '@/contexts/AudioContext';
import { useTheme } from '@/contexts/ThemeContext';

import { Player, PlayerEffect } from '@/types/player';
import { GameState, GameLog } from '@/types/gameState';
import { Tile } from '@/types/board';

import { generateRandomBoard } from '@/data/papan/board';
import { snakes } from '@/data/papan/snakes';
import { ladders } from '@/data/papan/ladders';
import { questions } from '@/data/questions';

import { GAME_CONSTANTS } from '@/constants/game';
import { getCoordinates, getSnakeCurveParams, getBezierPoint } from '@/utils/geometry';
import { useGameFeedbackPipeline } from '@/hooks/useGameFeedbackPipeline';

import { calculateMovementPath } from '@/lib/movement';
import {
  processTurn,
  submitQuizAnswer,
  acknowledgeQuizResult,
  acknowledgeEffect,
  GameEngineContext,
  ProcessTurnResult
} from '@/lib/gameEngine';
import { DiceModifierModal, DiceModifierInfo } from '@/components/ui/DiceModifierModal';

export interface GameLayoutProps {
  initialPlayers: Player[];
  onMainMenu: () => void;
}

const AMBIENT_PARTICLES = Array.from({ length: 40 }).map((_, i) => ({
  cx: `${Math.floor(Math.random() * 100)}%`,
  cy: `${100 + Math.floor(Math.random() * 50)}%`,
  durY: `${15 + Math.floor(Math.random() * 20)}s`,
  durX: `${10 + Math.floor(Math.random() * 20)}s`,
  durO: `${5 + Math.floor(Math.random() * 10)}s`,
  r: 2 + Math.random() * 6, // Radius 2 - 8
}));

export default function GameLayout({ initialPlayers, onMainMenu }: GameLayoutProps) {
  const [currentBoard, setCurrentBoard] = useState<Tile[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [transitioningPlayers, setTransitioningPlayers] = useState<Record<string, { x: number, y: number, rotation?: number }>>({});

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
  const [latestLog, setLatestLog] = useState<GameLog | null>(null);
  const [latestLogId, setLatestLogId] = useState<string | null>(null);

  useEffect(() => {
    if (gameState.logs && gameState.logs.length > 0) {
      const newLog = gameState.logs[gameState.logs.length - 1];
      
      if (newLog.id !== latestLogId) {
        Promise.resolve().then(() => {
          setLatestLogId(newLog.id);
          
          const isAlertPhase = newLog.message.toLowerCase().includes('seseorang sudah memasuki');
          if (newLog.type === 'bonus' || newLog.type === 'penalty' || isAlertPhase) {
            setLatestLog(newLog);
            setShowHeadline(true);
          }
        });
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
  const { currentTheme } = useTheme();
  const isJakarta = currentTheme.id === 'jakarta-heritage';
  const { triggerLandingFeedback, triggerScreenShake, prefersReducedMotion } = useGameFeedbackPipeline();

  // Memutar BGM saat permainan dimulai
  useEffect(() => {
    const bgmType = isJakarta ? 'game_jakarta' : 'game';
    playBGM(bgmType);
    return () => stopBGM(bgmType);
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

  // Ref untuk mengunci eksekusi dadu agar tidak terjadi race condition (terutama saat bot & autoRoll)
  const isRollingRef = React.useRef(false);

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
        // Gunakan microtask agar tidak memblokir render sinkron React
        Promise.resolve().then(() => setAutoRollDouble(false));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.gameStatus, gameState.currentTurn, activePlayer, gameContext, playSFX, autoRollDouble]);

  // Eksekusi otomatis efek DoubleRoll tanpa perlu diklik player
  useEffect(() => {
    if (activeEffect?.type === 'DoubleRoll') {
      const timer = setTimeout(() => {
        setGameState(prev => acknowledgeEffect(prev));
        setActiveEffect(null);
        setAutoRollDouble(true);
      }, 1500); // Muncul 1.5 detik lalu otomatis roll dadu lagi
      return () => clearTimeout(timer);
    }
  }, [activeEffect]);

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
    } else {
      setActiveEffect(null);
    }
  };

  // Orkestrasi langkah animasi hop-by-hop
  const executeHopAnimation = (result: ProcessTurnResult) => {
    const activePlayerId = gameState.currentTurn;
    const originalPos = gameState.players.find(p => p.id === activePlayerId)?.position || 1;
    const movementSteps = result.movementSteps;
    
    // Generate path
    const path = calculateMovementPath(originalPos, movementSteps);
    
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

        playSFX('hop');
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
        let rotation = 0;
        
        if (isSnake && snakeParams) {
          x = getBezierPoint(easeProgress, snakeParams.head.x, snakeParams.cx1, snakeParams.cx2, snakeParams.tail.x);
          y = getBezierPoint(easeProgress, snakeParams.head.y, snakeParams.cy1, snakeParams.cy2, snakeParams.tail.y);
          
          // Kalkulasi sudut kemiringan (tangent) dari turunan Bezier cubic
          const t = easeProgress;
          const mt = 1 - t;
          const dx = 3 * mt * mt * (snakeParams.cx1 - snakeParams.head.x) + 
                     6 * mt * t * (snakeParams.cx2 - snakeParams.cx1) + 
                     3 * t * t * (snakeParams.tail.x - snakeParams.cx2);
          const dy = 3 * mt * mt * (snakeParams.cy1 - snakeParams.head.y) + 
                     6 * mt * t * (snakeParams.cy2 - snakeParams.cy1) + 
                     3 * t * t * (snakeParams.tail.y - snakeParams.cy2);
                     
          rotation = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        } else {
          // Tangga bergerak lurus
          x = start.x + (end.x - start.x) * easeProgress;
          y = start.y + (end.y - start.y) * easeProgress;
          
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          rotation = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        }

        setTransitioningPlayers(prev => ({
          ...prev,
          [activePlayerId]: { x, y, rotation }
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
  function handleRollDice() {
    // Cegah eksekusi ganda jika sedang rolling atau status tidak idle
    if (gameState.gameStatus !== 'idle' || isRollingRef.current) return;
    
    // Kunci eksekusi
    isRollingRef.current = true;

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

  // Lepas kunci rolling saat status kembali idle
  useEffect(() => {
    if (gameState.gameStatus === 'idle') {
      isRollingRef.current = false;
    }
  }, [gameState.gameStatus]);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-500" style={{ backgroundColor: 'var(--color-cream)', color: 'var(--color-navy)' }}>
        Memuat Permainan...
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen overflow-hidden relative transition-colors duration-300 ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`} style={{ backgroundColor: 'var(--color-cream)', color: 'var(--color-navy-dark)' }}>
      
      {/* Background Ambience Pattern & Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-40" 
        style={{ 
          backgroundImage: currentTheme.bgPattern,
          backgroundSize: isJakarta ? '60px 60px' : '320px 320px',
        }} 
      />
      {/* Spotlight for Jakarta Theme */}
      {isJakarta && (
        <div 
          className="absolute inset-0 pointer-events-none z-0 opacity-60" 
          style={{ background: 'radial-gradient(circle at center, rgba(253,211,77,0.3) 0%, transparent 50%)', mixBlendMode: 'screen' }} 
        />
      )}
      <div 
        className="absolute inset-0 pointer-events-none z-0 mix-blend-multiply" 
        style={{ background: isJakarta 
          ? 'radial-gradient(circle at center, rgba(69,26,3,0) 20%, rgba(69,26,3,0.8) 100%)' 
          : 'radial-gradient(circle at center, rgba(30,58,95,0.1) 0%, rgba(30,58,95,0.6) 100%)' 
        }} 
      />
      <div className="absolute inset-0 pointer-events-none z-0 bg-slate-900/10 mix-blend-multiply" />

      {/* Ambient Floating Particles */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-100" preserveAspectRatio="xMidYMid slice" style={{ filter: 'drop-shadow(0px 0px 4px rgba(255,255,255,0.5))' }}>
        <defs>
          <radialGradient id="ambientParticleGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="30%" stopColor={currentTheme.id === 'jakarta-heritage' ? "#60a5fa" : "#fcd34d"} stopOpacity="0.8" />
            <stop offset="100%" stopColor={currentTheme.id === 'jakarta-heritage' ? "#1e3a8a" : "#b45309"} stopOpacity="0" />
          </radialGradient>
        </defs>
        {!prefersReducedMotion && AMBIENT_PARTICLES.map((p, i) => {
          const cxVal = parseFloat(p.cx);
          return (
            <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="url(#ambientParticleGrad)">
              <animate attributeName="cy" values={`${p.cy}; -10%`} dur={p.durY} repeatCount="indefinite" />
              <animate attributeName="cx" values={`${p.cx}; ${cxVal + 10}%; ${p.cx}`} dur={p.durX} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0; 1; 0" dur={p.durO} repeatCount="indefinite" />
            </circle>
          );
        })}
      </svg>

      {/* Turn Banner Overlay */}
      {showTurnBanner && gameState.gameStatus === 'idle' && (
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 z-[40] animate-in slide-in-from-top-10 fade-in zoom-in duration-300 pointer-events-none">
          <div 
            className="backdrop-blur-sm border-2 font-bold px-4 py-2 sm:px-8 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 sm:gap-3 transition-all duration-300"
            style={{ backgroundColor: 'var(--color-parchment)', borderColor: 'var(--color-gold)', color: 'var(--color-navy-dark)' }}
          >
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
          className={`w-10 h-10 sm:w-12 sm:h-12 bg-[var(--color-parchment)] text-[var(--color-navy)] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center text-lg sm:text-xl pointer-events-auto border border-[var(--color-wood)]/30 transition-transform hover:scale-105 active:scale-95 ${isDesktopLogOpen ? 'lg:hidden' : ''}`}
        >
          📝
        </button>

        {/* Middle: Headline Text */}
        <div className="flex-1 lg:flex-none lg:w-[45%] xl:w-[40%] mx-2 flex justify-center pointer-events-auto overflow-hidden lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          {latestLog && showHeadline && (
            <div className="bg-[var(--color-parchment)]/95 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.1)] border-2 border-[var(--color-wood)]/30 rounded-full py-2 flex w-full overflow-hidden animate-in fade-in slide-in-from-top-4 slide-out-to-top-4">
              <div 
                className="whitespace-nowrap w-full animate-[marquee_8s_linear_forwards] min-w-full px-4 text-xs sm:text-sm font-bold text-[var(--color-navy)]"
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
          <div className="bg-[var(--color-parchment)]/95 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-2xl border-4 border-red-500 flex flex-col items-center animate-in zoom-in duration-300 transform scale-110">
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
          className={`hidden lg:flex absolute top-0 bottom-0 left-0 z-40 transition-transform duration-300 ${isDesktopLogOpen ? 'translate-x-0' : '-translate-x-full'} w-[25%] xl:w-[28%] p-4 flex-col shadow-[4px_0_24px_rgba(30,58,95,0.08)] border-r border-[var(--color-wood)]/20 backdrop-blur-md bg-[var(--color-parchment)]/80`}
          style={{ borderColor: 'rgba(201,168,76,0.3)' }}
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
        <section className="h-[60%] lg:h-auto lg:flex-1 w-full overflow-y-auto p-4 flex flex-col items-center justify-center lg:pb-4 relative z-0">
          {/* Meneruskan referensi data tiles asli, players, dan state animasi per-frame */}
          <Board 
            tiles={currentBoard} 
            players={gameState.players} 
            transitioningPlayers={transitioningPlayers} 
            animationStyle="squash"
          />
        </section>

        {/* Desktop Control Area (Right Side) */}
        <aside 
          className="hidden lg:flex lg:w-[25%] xl:w-[28%] shrink-0 border-l border-[var(--color-wood)]/20 p-6 flex-col gap-6 overflow-y-auto shadow-[-4px_0_24px_rgba(30,58,95,0.08)] z-10 transition-colors duration-300 backdrop-blur-md bg-[var(--color-parchment)]/80"
          style={{ borderColor: 'rgba(201,168,76,0.3)' }}
        >
          <HUD activePlayer={activePlayer} players={gameState.players} layout="desktop" />
          <div 
            className={`mt-auto p-4 rounded-lg text-center border min-h-[150px] flex items-center justify-center shrink-0 transition-colors duration-300 ${isJakarta ? 'shadow-[inset_0_4px_20px_rgba(120,53,15,0.15)] bg-[#fdf6e3]' : 'bg-slate-100 border-slate-200'}`}
            style={isJakarta ? { borderColor: 'var(--color-wood)', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d97706\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' } : {}}
          >
            <Dice
              diceState={gameState.dice}
              onRoll={handleRollDice}
              disabled={gameState.gameStatus !== 'idle' || activePlayer?.isBot || activePlayer?.activeEffects.some(e => e.type === 'Silence')}
              layout="vertical"
            />
          </div>
        </aside>

        {/* Mobile Bottom Panel (Takes remaining vertical space on small screens) */}
        <div 
          className="lg:hidden h-[40%] w-full border-t border-[var(--color-wood)]/20 p-4 pb-safe flex flex-col gap-4 items-center justify-center shadow-[0_-8px_24px_rgba(30,58,95,0.08)] z-20 overflow-y-auto relative transition-colors duration-300 backdrop-blur-md bg-[var(--color-parchment)]/90"
          style={{ borderColor: 'rgba(201,168,76,0.3)' }}
        >
          <div className="w-full">
            <HUD activePlayer={activePlayer} players={gameState.players} layout="mobile" />
          </div>
          <div 
            className={`flex-none flex justify-center mt-2 relative w-full p-2 rounded-lg border ${isJakarta ? 'bg-[#fdf6e3] shadow-[inset_0_2px_10px_rgba(120,53,15,0.15)]' : 'border-transparent'}`}
            style={isJakarta ? { borderColor: 'var(--color-wood)', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d97706\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' } : {}}
          >
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
          <div 
            className="rounded-t-2xl h-[70vh] flex flex-col p-4 shadow-xl border-t-2"
            style={{ backgroundColor: 'var(--color-parchment)', borderColor: 'var(--color-gold)' }}
          >
            <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="font-bold text-lg" style={{ color: 'var(--color-navy-dark)', fontFamily: 'var(--font-display)' }}>Game Log</h2>
              <button
                onClick={() => { playSFX('click'); setIsMobileLogOpen(false); }}
                className="p-2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors animate-in"
                style={{ backgroundColor: 'var(--color-cream)' }}
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
