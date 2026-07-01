import React, { useState, useEffect } from 'react';
import { Question } from '@/types/question';
import { validateAnswer, QuizResult } from '@/lib/quiz';
import { useAudio } from '@/contexts/AudioContext';

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
  const { playSFX } = useAudio();
  const botHasAnsweredRef = React.useRef(false);

  // Reset internal state when modal closes or question changes
  useEffect(() => {
    if (!isOpen) {
      botHasAnsweredRef.current = false;
      setTimeout(() => {
        setSelectedOption(null);
        setResult(null);
      }, 300);
    }
  }, [isOpen, question]);

  // Logika simulasi bot menjawab kuis (Visual Automation)
  useEffect(() => {
    if (isOpen && isBotTurn && question && !selectedOption && !result && !botHasAnsweredRef.current) {
      botHasAnsweredRef.current = true;
      
      // Delay 1: Pura-pura membaca soal
      const thinkTimer = setTimeout(() => {
        let pickedAnswer = "";
        const isCorrect = Math.random() < 0.25; // 25% akurasi bot
        if (isCorrect) {
          pickedAnswer = question.correctAnswer;
        } else {
          const wrongOptions = question.options.filter(o => o !== question.correctAnswer);
          pickedAnswer = wrongOptions[Math.floor(Math.random() * wrongOptions.length)] || wrongOptions[0];
        }

        // Animasi UI bot mengeklik pilihan
        playSFX('click');
        setSelectedOption(pickedAnswer);

        // Delay 2: Jeda agar pemain bisa melihat apa yang diklik bot sebelum divalidasi
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
    if (result || isBotTurn) return; // Mencegah pilihan berubah jika sudah disubmit atau bot
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header Kuis */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h2 className="font-bold text-lg">Tantangan Pengetahuan</h2>
          <span className="text-xs font-semibold bg-blue-800 px-2 py-1 rounded-full uppercase tracking-wider">
            {question.difficulty}
          </span>
        </div>
        
        <div className="p-6">
          {/* Pertanyaan */}
          <p className="text-lg font-medium text-slate-800 mb-6">
            {question.question}
          </p>

          {/* Opsi Jawaban */}
          <div className="flex flex-col gap-3 mb-6">
            {question.options.map((option, index) => {
              const isSelected = selectedOption === option;
              
              let buttonStyle = "border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-700";
              
              if (result) {
                if (option === result.correctAnswer) {
                  buttonStyle = "border-green-500 bg-green-50 text-green-800 font-semibold";
                } else if (isSelected && !result.isCorrect) {
                  buttonStyle = "border-red-500 bg-red-50 text-red-800 font-semibold";
                } else {
                  buttonStyle = "border-slate-200 opacity-50 text-slate-500 cursor-not-allowed";
                }
              } else if (isSelected) {
                buttonStyle = "border-blue-500 bg-blue-50 text-blue-800 font-semibold ring-2 ring-blue-200";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectOption(option)}
                  disabled={result !== null || isBotTurn}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${buttonStyle} disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-current text-xs font-bold shrink-0">
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
            <div className={`p-4 rounded-xl mb-6 ${result.isCorrect ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>
              <h3 className="font-bold flex items-center gap-2 mb-1">
                {result.isCorrect ? '✨ Jawaban Benar!' : '❌ Jawaban Kurang Tepat'}
              </h3>
              <p className="text-sm opacity-90">{result.explanation}</p>
            </div>
          )}
        </div>

        {/* Footer / Aksi */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
          {!result ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption || isBotTurn}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
            >
              {isBotTurn ? 'Bot Sedang Berpikir...' : 'Jawab'}
            </button>
          ) : (
            <button
              onClick={handleContinue}
              disabled={isBotTurn}
              className="px-6 py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
            >
              {isBotTurn ? 'Bot Membaca Hasil...' : 'Lanjutkan Permainan'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
