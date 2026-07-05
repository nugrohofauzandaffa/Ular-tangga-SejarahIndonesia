import React, { useState, useEffect } from 'react';
import { Question } from '@/types/question';
import { validateAnswer, QuizResult } from '@/lib/quiz';
import { useAudio } from '@/contexts/AudioContext';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

interface QuizModalProps {
  question: Question | null;
  isOpen: boolean;
  onSubmit: (answer: string) => void;
  onComplete: () => void;
  isBotTurn?: boolean;
}

export const QuizModal: React.FC<QuizModalProps> = ({ question, isOpen, onSubmit, onComplete, isBotTurn }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const { playSFX } = useAudio();
  const { currentTheme } = useTheme();
  const botHasAnsweredRef = React.useRef(false);

  // Reset internal state when modal closes or question changes
  useEffect(() => {
    if (isOpen && question) {
      Promise.resolve().then(() => {
        setShuffledOptions([...question.options].sort(() => Math.random() - 0.5));
      });
    } else if (!isOpen) {
      botHasAnsweredRef.current = false;
      setTimeout(() => {
        setSelectedOption(null);
        setResult(null);
        setShuffledOptions([]);
      }, 300);
    }
  }, [isOpen, question]);

  // Logika simulasi bot menjawab kuis (Visual Automation)
  useEffect(() => {
    if (isOpen && isBotTurn && question && !selectedOption && !result && !botHasAnsweredRef.current) {
      botHasAnsweredRef.current = true;
      
      const thinkTimer = setTimeout(() => {
        let pickedAnswer = "";
        const isCorrect = Math.random() < 0.25; // 25% akurasi bot
        if (isCorrect) {
          pickedAnswer = question.correctAnswer;
        } else {
          const wrongOptions = question.options.filter(o => o !== question.correctAnswer);
          pickedAnswer = wrongOptions[Math.floor(Math.random() * wrongOptions.length)] || wrongOptions[0];
        }

        playSFX('click');
        setSelectedOption(pickedAnswer);

        setTimeout(() => {
          const validationResult = validateAnswer(question, pickedAnswer);
          setResult(validationResult);
          
          if (validationResult.isCorrect) playSFX('correct');
          else playSFX('wrong');

          onSubmit(pickedAnswer);
        }, 1500);

      }, 2500);

      return () => clearTimeout(thinkTimer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isBotTurn, question, selectedOption, result]);

  if (!isOpen || !question) return null;

  const handleSelectOption = (option: string) => {
    if (result || isBotTurn) return;
    playSFX('click');
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption || isBotTurn) return;
    playSFX('click');
    
    const validationResult = validateAnswer(question, selectedOption);
    setResult(validationResult);
    
    onSubmit(selectedOption);
  };

  const handleContinue = () => {
    if (result && !isBotTurn) {
      playSFX('click');
      onComplete();
    }
  };

  const isJakarta = currentTheme.id === 'jakarta-heritage';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="w-full max-w-lg bg-[var(--color-parchment)] rounded-2xl shadow-2xl flex flex-col overflow-hidden border-4 border-[var(--color-wood)]"
      >
        
        {/* Header Kuis */}
        <div className={`bg-[var(--color-navy)] text-[var(--color-cream)] p-5 flex justify-between items-center border-b border-[var(--color-gold)] relative ${isJakarta ? 'pt-7' : ''}`}>
          {isJakarta && (
            <div className="absolute top-0 left-0 right-0 h-[10px] bg-repeat-x bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'10\' viewBox=\'0 0 16 10\'%3E%3Cpolygon points=\'0,0 8,8 16,0\' fill=\'%2378350f\'/%3E%3C/svg%3E')] z-10" />
          )}
          <h2 className="font-bold text-lg font-display uppercase tracking-wide">Tantangan Pengetahuan</h2>
          <span className="text-[10px] font-bold bg-[var(--color-navy-dark)] text-[var(--color-gold-light)] border border-[var(--color-gold)] px-2.5 py-1 rounded uppercase tracking-wider">
            {question.difficulty}
          </span>
        </div>
        
        <div className="p-6">
          {/* Pertanyaan */}
          <p className="text-lg font-bold text-[var(--color-navy-dark)] mb-6 leading-relaxed">
            {question.question}
          </p>
 
          {/* Opsi Jawaban */}
          <div className="flex flex-col gap-3 mb-6">
            {shuffledOptions.map((option, index) => {
              const isSelected = selectedOption === option;
              
              let buttonStyle = "border-[var(--color-cream-dark)]/50 bg-[var(--color-cream)]/20 hover:border-[var(--color-gold)] hover:bg-[var(--color-cream-dark)]/15 text-[var(--color-navy-dark)]";
              
              if (result) {
                if (option === result.correctAnswer) {
                  buttonStyle = "border-green-600 bg-green-500/10 text-green-950 font-bold";
                } else if (isSelected && !result.isCorrect) {
                  buttonStyle = "border-red-600 bg-red-500/10 text-red-950 font-bold";
                } else {
                  buttonStyle = "border-[var(--color-cream-dark)]/20 opacity-40 text-slate-500 cursor-not-allowed";
                }
              } else if (isSelected) {
                buttonStyle = "border-[var(--color-gold)] bg-[var(--color-cream)] text-[var(--color-navy-dark)] font-bold ring-2 ring-[var(--color-gold-light)]/40";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectOption(option)}
                  disabled={result !== null || isBotTurn}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${buttonStyle} disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-parchment)] border border-current text-xs font-bold shrink-0">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Area Penjelasan Hasil */}
          {result && (
            <div className={`p-4 rounded-xl mb-6 border ${result.isCorrect ? 'bg-green-500/10 border-green-500/30 text-green-950' : 'bg-red-500/10 border-red-500/30 text-red-950'}`}>
              <h3 className="font-bold flex items-center gap-2 mb-1">
                {result.isCorrect ? '✨ Jawaban Benar!' : '❌ Jawaban Kurang Tepat'}
              </h3>
              <p className="text-sm opacity-90">{result.explanation}</p>
            </div>
          )}
        </div>

        {/* Footer / Aksi */}
        <div className="bg-[var(--color-cream)]/35 p-4 border-t border-[var(--color-cream-dark)]/30 flex justify-end">
          {!result ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption || isBotTurn}
              className="px-6 py-3 bg-[var(--color-navy)] text-[var(--color-cream)] hover:bg-[var(--color-navy-dark)] border-2 border-[var(--color-gold)] hover:border-[var(--color-gold-light)] font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full sm:w-auto uppercase text-xs tracking-wider"
            >
              {isBotTurn ? 'Bot Sedang Berpikir...' : 'Jawab'}
            </button>
          ) : (
            <button
              onClick={handleContinue}
              disabled={isBotTurn}
              className="px-6 py-3 bg-[var(--color-wood)] text-[var(--color-cream)] hover:bg-[var(--color-wood-light)] border border-[var(--color-gold)] font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full sm:w-auto uppercase text-xs tracking-wider"
            >
              {isBotTurn ? 'Bot Membaca Hasil...' : 'Lanjutkan Permainan'}
            </button>
          )}
        </div>

      </motion.div>
    </div>
  );
};
