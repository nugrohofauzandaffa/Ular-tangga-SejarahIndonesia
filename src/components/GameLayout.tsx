"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Board from './papan/Board';
import { Dice } from './dice/Dice';
import { HUD } from './ui/HUD';
import { QuizModal } from './quiz/QuizModal';
import { ResultScreen } from './ui/ResultScreen';
import { FactModal } from './ui/FactModal';
import { EffectModal } from './ui/EffectModal';

import { Player, PlayerEffect } from '@/types/player';
import { GameState } from '@/types/gameState';

import { generateRandomBoard } from '@/data/papan/board';
import { snakes } from '@/data/papan/snakes';
import { ladders } from '@/data/papan/ladders';
import { questions } from '@/data/questions';
import { facts } from '@/data/facts/facts';

import {
  processTurn,
  submitQuizAnswer,
  acknowledgeQuizResult,
  acknowledgeFact,
  acknowledgeEffect,
  GameEngineContext
} from '@/lib/gameEngine';

const initialPlayers: Player[] = [
  { id: 'p1', name: 'Pemain 1', position: 1, score: 0, correctAnswers: 0, wrongAnswers: 0, activeEffects: [] },
  { id: 'p2', name: 'Pemain 2', position: 1, score: 0, correctAnswers: 0, wrongAnswers: 0, activeEffects: [] },
];

const initialGameState: GameState = {
  players: initialPlayers,
  currentTurn: 'p1',
  winner: null,
  gameStatus: 'idle',
  dice: { currentValue: 1, isRolling: false },
};

export default function GameLayout() {
  const [currentBoard, setCurrentBoard] = useState<Tile[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [activeFactId, setActiveFactId] = useState<string | null>(null);
  const [activeEffect, setActiveEffect] = useState<PlayerEffect | null>(null);

  useEffect(() => {
    setCurrentBoard(generateRandomBoard(3, 3));
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

  // Handler untuk memulai giliran (melempar dadu)
  const handleRollDice = () => {
    if (gameState.gameStatus !== 'idle') return;

    // 1. Ubah state ke rolling untuk trigger animasi dadu di UI
    setGameState(prev => ({
      ...prev,
      gameStatus: 'rolling_dice',
      dice: { ...prev.dice, isRolling: true }
    }));

    // 2. Tunggu animasi selesai, lalu eksekusi logika permainan
    setTimeout(() => {
      setGameState(prev => {
        const result = processTurn(prev, gameContext);

        // Menyimpan id soal jika petak yang dituju adalah kuis
        if (result.tileEvent?.type === 'Quiz' && result.tileEvent.contentId) {
          setActiveQuestionId(result.tileEvent.contentId);
        } else {
          setActiveQuestionId(null);
        }

        if (result.tileEvent?.type === 'Fact' && result.tileEvent.contentId) {
          setActiveFactId(result.tileEvent.contentId);
        } else {
          setActiveFactId(null);
        }

        if (result.acquiredEffect) {
          setActiveEffect(result.acquiredEffect);
        } else {
          setActiveEffect(null);
        }

        return result.newState;
      });
    }, 600);
  };

  // Handler ketika pemain menjawab kuis di Modal
  const handleQuizAnswer = (answer: string) => {
    if (!activeQuestionId) return;

    // Validasi dan update state (skor, dll) melalui Game Engine
    setGameState(prev => submitQuizAnswer(prev, gameContext, activeQuestionId, answer));
  };

  // Handler ketika pemain selesai membaca penjelasan kuis dan menutup modal
  const handleAcknowledgeQuiz = () => {
    setGameState(prev => acknowledgeQuizResult(prev));
    setActiveQuestionId(null);
  };

  const handleAcknowledgeFact = () => {
    setGameState(prev => acknowledgeFact(prev));
    setActiveFactId(null);
  };

  const handleAcknowledgeEffect = () => {
    setGameState(prev => acknowledgeEffect(prev));
    setActiveEffect(null);
  };

  // Handler restart permainan
  const handlePlayAgain = () => {
    setCurrentBoard(generateRandomBoard(3, 3));
    setGameState(initialGameState);
    setActiveQuestionId(null);
    setActiveFactId(null);
    setActiveEffect(null);
  };

  // Ambil soal aktif (jika ada) untuk dilempar ke QuizModal
  const activeQuestion = activeQuestionId
    ? questions.find(q => q.id === activeQuestionId) || null
    : null;

  const activeFact = activeFactId
    ? facts.find(f => f.id === activeFactId) || null
    : null;
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 text-slate-500">
        Memuat Permainan...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-900 relative">
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
          <HUD activePlayer={activePlayer} layout="desktop" />

          <div className="mt-auto p-4 bg-slate-100 rounded-lg text-center border border-slate-200 min-h-[150px] flex items-center justify-center">
            <Dice
              diceState={gameState.dice}
              onRoll={handleRollDice}
              disabled={gameState.gameStatus !== 'idle'}
              layout="vertical"
            />
          </div>
        </aside>

        {/* Mobile Bottom Panel (Takes remaining vertical space on small screens) */}
        <div className="lg:hidden h-[40%] w-full bg-white border-t border-slate-200 p-4 pb-safe flex flex-col gap-4 items-center justify-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 overflow-y-auto">
          <div className="w-full">
            <HUD activePlayer={activePlayer} layout="mobile" />
          </div>
          <div className="flex-none flex justify-center mt-2">
            <Dice
              diceState={gameState.dice}
              onRoll={handleRollDice}
              disabled={gameState.gameStatus !== 'idle'}
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
      />

      {/* Result Screen Modal */}
      <ResultScreen
        gameState={gameState}
        onPlayAgain={handlePlayAgain}
        onMainMenu={handlePlayAgain} // Sementara samakan fungsinya
      />

      {/* Fact Modal */}
      {gameState.gameStatus === 'showing_fact' && activeFact && (
        <FactModal
          fact={activeFact}
          onAcknowledge={handleAcknowledgeFact}
        />
      )}

      {/* Effect Modal */}
      {gameState.gameStatus === 'showing_effect' && activeEffect && (
        <EffectModal
          effect={activeEffect}
          onAcknowledge={handleAcknowledgeEffect}
        />
      )}
    </div>
  );
}
