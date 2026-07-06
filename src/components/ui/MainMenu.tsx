'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Player } from '@/types/player';
import { useAudio } from '@/contexts/AudioContext';
import { useTheme } from '@/contexts/ThemeContext';
import { AudioSettings } from './AudioSettings';
import { AboutModal } from './AboutModal';

type SetupStep = 'mode' | 'players' | 'theme';
type GameMode = 'multiplayer' | 'solo';

interface MainMenuProps {
  onStartGame: (players: Player[]) => void;
}

// ==========================================
// DUMMY ART COMPONENTS (Dynamic by Step)
// ==========================================
const ArtStepMode = () => (
  <svg viewBox="0 0 400 800" className="absolute inset-0 w-full h-full opacity-40 object-cover" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 0,100 L 400,100 M 0,200 L 400,200 M 0,300 L 400,300 M 0,400 L 400,400 M 0,500 L 400,500" stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.4" strokeDasharray="4 4" />
    <path d="M 100,0 L 100,800 M 200,0 L 200,800 M 300,0 L 300,800" stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.4" strokeDasharray="4 4" />
    
    <g transform="translate(200, 350) scale(1.8)" className="origin-center">
      <circle cx="0" cy="0" r="45" stroke="var(--color-gold)" strokeWidth="1" opacity="0.5" />
      <circle cx="0" cy="0" r="40" stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.3" strokeDasharray="2 3" />
      <path d="M 0,-55 L 10,-18 L 25,-25 L 18,-10 L 55,0 L 18,10 L 25,25 L 10,18 L 0,55 L -10,18 L -25,25 L -18,10 L -55,0 L -18,-10 L -25,-25 L -10,-18 Z" fill="var(--color-gold)" opacity="0.4" stroke="var(--color-gold-dark)" strokeWidth="0.5" />
      <circle cx="0" cy="0" r="8" fill="var(--color-navy-dark)" stroke="var(--color-gold)" strokeWidth="2" />
    </g>
    <path d="M 150,300 C 180,250 250,250 280,200 C 310,150 280,100 320,50" stroke="var(--color-gold)" strokeWidth="2" strokeDasharray="5 5" fill="none" opacity="0.5" />
  </svg>
);

const ArtStepPlayers = () => (
  <svg viewBox="0 0 400 800" className="absolute inset-0 w-full h-full opacity-30 object-cover" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="50" y="150" width="200" height="280" rx="8" fill="var(--color-parchment)" opacity="0.1" stroke="var(--color-gold)" strokeWidth="1" transform="rotate(-5 200 300)" />
    <rect x="80" y="180" width="220" height="300" rx="8" fill="var(--color-parchment)" opacity="0.15" stroke="var(--color-gold)" strokeWidth="1" transform="rotate(3 200 300)" />
    
    <g transform="translate(180, 320) rotate(3) scale(1.2)">
      <path d="M -50,-80 L 50,-80 L 50,80 L -50,80 Z" stroke="var(--color-gold)" strokeWidth="2" fill="none" />
      <circle cx="0" cy="-50" r="15" stroke="var(--color-gold)" strokeWidth="1" fill="none" />
      <path d="M -30,0 L 30,0 M -30,20 L 30,20 M -30,40 L 10,40" stroke="var(--color-gold)" strokeWidth="1" opacity="0.6" />
      <rect x="-10" y="-85" width="20" height="10" fill="var(--color-gold)" opacity="0.8" />
    </g>
  </svg>
);

const ArtStepThemeJakarta = () => (
  <svg viewBox="0 0 400 800" className="absolute inset-0 w-full h-full opacity-40 object-cover" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 0,600 L 400,600" stroke="var(--color-gold)" strokeWidth="1" opacity="0.5" />
    <g transform="translate(200, 600) scale(2.5)">
      <path d="M -30,0 L 30,0 L 25,-10 L -25,-10 Z" fill="var(--color-gold)" opacity="0.4" />
      <path d="M -20,-10 L 20,-10 L 15,-20 L -15,-20 Z" fill="var(--color-gold)" opacity="0.5" />
      <path d="M -10,-20 L 10,-20 L 8,-80 L -8,-80 Z" fill="var(--color-gold)" opacity="0.6" />
      <path d="M -12,-80 L 12,-80 L 10,-85 L -10,-85 Z" fill="var(--color-gold)" opacity="0.7" />
      <polygon points="0,-110 -5,-85 5,-85" fill="var(--color-gold)" opacity="0.9" />
    </g>
  </svg>
);

const ArtStepThemeClassic = () => (
  <svg viewBox="0 0 400 800" className="absolute inset-0 w-full h-full opacity-40 object-cover" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 0,600 L 400,600" stroke="var(--color-gold)" strokeWidth="1" opacity="0.5" />
    <path d="M 0,620 Q 100,580 200,620 T 400,620" stroke="var(--color-gold)" strokeWidth="1" fill="none" opacity="0.3" />
    <g transform="translate(200, 580) scale(1.5)">
      <path d="M -40,20 C -20,25 20,25 40,20 L 30,0 C 10,5 -10,5 -30,0 Z" fill="var(--color-gold)" opacity="0.6" />
      <path d="M -20,0 L -20,-60 L 0,-60 Z" fill="var(--color-gold)" opacity="0.5" />
      <path d="M 5,0 L 5,-40 L 20,-40 Z" fill="var(--color-gold)" opacity="0.4" />
      <line x1="-20" y1="0" x2="-20" y2="-65" stroke="var(--color-gold)" strokeWidth="2" />
      <line x1="5" y1="0" x2="5" y2="-45" stroke="var(--color-gold)" strokeWidth="2" />
    </g>
  </svg>
);

// Framer Motion Variants
const containerVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5, 
      ease: 'easeOut',
      staggerChildren: 0.1 
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export function MainMenu({ onStartGame }: MainMenuProps) {
  const { playSFX, playBGM, stopBGM } = useAudio();
  const { currentTheme, setTheme, allThemes } = useTheme();

  const [currentStep, setCurrentStep] = useState<SetupStep>('mode');
  const [activeMode, setActiveMode] = useState<GameMode | null>(null);
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '', '']);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  useEffect(() => {
    playBGM('menu');
    return () => stopBGM('menu');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectMode = (mode: GameMode) => {
    playSFX('click');
    setActiveMode(mode);
    setPlayerCount(mode === 'solo' ? 2 : 2);
    if (mode === 'solo') {
      setPlayerNames(prev => {
        const n = [...prev];
        n[1] = 'Bot 1 (AI)';
        n[2] = 'Bot 2 (AI)';
        n[3] = 'Bot 3 (AI)';
        return n;
      });
    } else {
      setPlayerNames(['', '', '', '']);
    }
    setCurrentStep('players');
  };

  const handleNameChange = (index: number, val: string) => {
    const newNames = [...playerNames];
    newNames[index] = val;
    setPlayerNames(newNames);
  };

  const checkNamesFilled = () => {
    playSFX('click');
    setCurrentStep('theme');
  };

  const handleStart = () => {
    playSFX('click');
    const initialPlayers: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
      const isBot = activeMode === 'solo' && i > 0;
      initialPlayers.push({
        id: `p${i + 1}`,
        name: playerNames[i] || (isBot ? `Bot ${i} (AI)` : `Penjelajah ${i + 1}`),
        position: 1,
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        activeEffects: [],
        isBot,
      });
    }
    onStartGame(initialPlayers);
  };

  // Render Helpers
  const renderSummaryCard = (title: string, value: string, stepTarget: SetupStep) => (
    <motion.button 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => { playSFX('click'); setCurrentStep(stepTarget); }}
      className="group w-full flex items-center justify-between px-5 py-3 mb-3 rounded-xl border border-[var(--color-wood)] bg-[var(--color-parchment)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_4px_10px_rgba(30,58,95,0.08)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_6px_15px_rgba(30,58,95,0.12)] transition-all text-left relative overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-gold)] opacity-50 group-hover:opacity-100 transition-opacity" />
      <div>
        <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-wood)] opacity-80 mb-0.5">{title}</div>
        <div className="text-sm font-bold text-[var(--color-navy-dark)] font-display tracking-wide">{value}</div>
      </div>
      <div className="w-8 h-8 rounded-full border border-[var(--color-cream-dark)] bg-white flex items-center justify-center group-hover:border-[var(--color-gold)] transition-colors shadow-sm">
        <span className="text-xs text-[var(--color-wood)]">✎</span>
      </div>
    </motion.button>
  );

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-[var(--color-navy-dark)] overflow-hidden font-body text-[var(--color-navy-dark)] select-none">
      
      {/* 
        HERO PANEL
      */}
      <div className="relative w-full md:w-[45%] h-[28vh] md:h-screen bg-[var(--color-navy)] flex flex-col items-center justify-center overflow-hidden shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-20 transition-all duration-700 ease-in-out">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a182b] via-[#112a4a] to-[#0a182b] z-0 opacity-90 transition-colors duration-1000" />
        <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none mix-blend-color-dodge" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />

        <div className="absolute inset-0 z-10 transition-opacity duration-1000">
          <AnimatePresence mode="wait">
            {currentStep === 'mode' && (
               <motion.div key="mode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
                 <ArtStepMode />
               </motion.div>
            )}
            {currentStep === 'players' && (
               <motion.div key="players" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
                 <ArtStepPlayers />
               </motion.div>
            )}
            {currentStep === 'theme' && (
               <motion.div key="theme" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
                 {currentTheme.id === 'jakarta-heritage' ? <ArtStepThemeJakarta /> : <ArtStepThemeClassic />}
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_120px_rgba(0,0,0,0.8)]" />
        <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-gradient-to-bl from-[var(--color-gold)] to-transparent opacity-5 mix-blend-overlay pointer-events-none" />

        <div className="relative z-20 text-center px-6 flex flex-col items-center justify-center w-full h-full drop-shadow-2xl">
          <div className="mb-2 md:mb-5 flex items-center gap-2 md:gap-4">
            <div className="h-px w-6 md:w-16 bg-[var(--color-gold)] opacity-60" />
            <span className="text-[7px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--color-gold)] font-display drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              {currentStep === 'mode' ? 'Tentukan Arah' : currentStep === 'players' ? 'Kumpulkan Tim' : 'Tentukan Destinasi'}
            </span>
            <div className="h-px w-6 md:w-16 bg-[var(--color-gold)] opacity-60" />
          </div>
          <h1 className="text-3xl md:text-6xl font-black text-[var(--color-cream)] font-display leading-none tracking-wide mb-1" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.4), 0 1px 2px rgba(201,168,76,0.5)' }}>
            ULAR TANGGA
          </h1>
          <h2 className="text-xs md:text-xl font-bold font-display tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-gold-dark)] via-[var(--color-gold-light)] to-[var(--color-gold-dark)] animate-shimmer" style={{ backgroundSize: '200% auto' }}>
            SEJARAH NUSANTARA
          </h2>
        </div>

        {/* Top Right Actions (About & Settings) */}
        <div className="absolute top-4 md:top-6 right-4 md:right-6 z-30 flex items-center gap-3">
           <button 
             onClick={() => { playSFX('click'); setShowAboutModal(true); }}
             className="w-10 h-10 rounded-full border border-[var(--color-gold)]/20 bg-[#0a182b]/50 backdrop-blur-md flex items-center justify-center text-[var(--color-gold)]/70 hover:bg-[#112a4a] hover:text-[var(--color-gold)] hover:border-[var(--color-gold)] transition-all shadow-lg"
             title="Tentang Game"
           >
             <span className="text-lg">❓</span>
           </button>

           <div className="relative">
             <button 
               onClick={() => { playSFX('click'); setShowAudioSettings(!showAudioSettings); }}
               className="w-10 h-10 rounded-full border border-[var(--color-gold)]/20 bg-[#0a182b]/50 backdrop-blur-md flex items-center justify-center text-[var(--color-gold)]/70 hover:bg-[#112a4a] hover:text-[var(--color-gold)] hover:border-[var(--color-gold)] transition-all shadow-lg"
               title="Pengaturan"
             >
               <span className="text-lg">⚙️</span>
             </button>
             
             <AnimatePresence>
               {showAudioSettings && (
                 <motion.div 
                   initial={{ opacity: 0, y: -10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: -10, scale: 0.95 }}
                   className="absolute top-14 right-0 w-64 origin-top-right z-40"
                 >
                   <AudioSettings />
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </div>
      </div>

      {/* 
        WIZARD FORM AREA
      */}
      <div className="flex-1 h-[72vh] md:h-screen bg-[#fdfbf7] relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }} />
        
        <div className="relative z-10 w-full max-w-lg mx-auto px-6 py-6 md:py-12 flex flex-col h-full overflow-y-auto hide-scrollbar">
          
          {/* EXPEDITION PATH */}
          <div className="flex items-center justify-between mb-8 md:mb-12 relative px-4 shrink-0">
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 border-t-2 border-dashed border-[var(--color-cream-dark)] z-0" />
            
            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-md ${currentStep === 'mode' ? 'bg-[var(--color-navy)] border-2 border-[var(--color-gold)] text-[var(--color-gold)] scale-110 shadow-[0_0_15px_rgba(201,168,76,0.3)]' : 'bg-[var(--color-gold)] border border-[var(--color-gold-dark)] text-white'}`}>
              <span className="text-sm">🧭</span>
            </div>
            
            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-md ${currentStep === 'players' ? 'bg-[var(--color-navy)] border-2 border-[var(--color-gold)] text-[var(--color-gold)] scale-110 shadow-[0_0_15px_rgba(201,168,76,0.3)]' : ['theme'].includes(currentStep) ? 'bg-[var(--color-gold)] border border-[var(--color-gold-dark)] text-white' : 'bg-white border-2 border-[var(--color-cream-dark)] text-gray-300'}`}>
              <span className="text-sm">🎫</span>
            </div>
            
            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-md ${currentStep === 'theme' ? 'bg-[var(--color-navy)] border-2 border-[var(--color-gold)] text-[var(--color-gold)] scale-110 shadow-[0_0_15px_rgba(201,168,76,0.3)]' : 'bg-white border-2 border-[var(--color-cream-dark)] text-gray-300'}`}>
              <span className="text-sm">🗺️</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col relative">
            
            {/* SUMMARIES */}
            <div className="shrink-0">
              {currentStep !== 'mode' && activeMode && renderSummaryCard(
                "Mode Ekspedisi", 
                activeMode === 'multiplayer' ? '👥 Multiplayer Lokal' : '🧭 Solo (Lawan AI)',
                'mode'
              )}
              {currentStep === 'theme' && renderSummaryCard(
                "Manifes Kru Terdaftar", 
                activeMode === 'solo' ? '1 Penjelajah vs AI' : `${playerCount} Penjelajah Siap`,
                'players'
              )}
            </div>

            {/* ACTIVE STEPS */}
            <AnimatePresence mode="wait">
              {currentStep === 'mode' && (
                <motion.div 
                  key="mode"
                  variants={containerVariants}
                  initial="hidden" animate="visible" exit="exit"
                  className="flex-1 flex flex-col justify-center"
                >
                  <motion.h3 variants={itemVariants} className="text-2xl font-bold font-display text-[var(--color-navy-dark)] mb-2 tracking-wide">Pilih Mode Ekspedisi</motion.h3>
                  <motion.p variants={itemVariants} className="text-xs text-[var(--color-wood)] mb-8 font-medium">Tentukan bagaimana Anda ingin menelusuri lorong waktu.</motion.p>
                  
                  <div className="flex flex-col gap-4">
                    <motion.button 
                      variants={itemVariants}
                      onClick={() => handleSelectMode('multiplayer')}
                      className="group relative overflow-hidden p-6 rounded-xl border border-[var(--color-wood)] bg-[var(--color-parchment)] shadow-[0_8px_16px_rgba(30,58,95,0.06),inset_0_2px_4px_rgba(255,255,255,1)] hover:shadow-[0_12px_24px_rgba(30,58,95,0.12),inset_0_2px_4px_rgba(255,255,255,1),inset_0_0_0_2px_var(--color-gold)] transition-all text-left flex items-center gap-5 translate-y-0 hover:-translate-y-1"
                    >
                      <div className="absolute -right-6 -top-6 w-24 h-24 bg-[var(--color-gold)]/5 rounded-full blur-xl group-hover:bg-[var(--color-gold)]/10 transition-colors" />
                      <div className="relative w-14 h-14 rounded-full border border-[var(--color-gold)] bg-[var(--color-cream)] flex items-center justify-center text-3xl shadow-inner group-hover:bg-[var(--color-navy)] transition-colors duration-500">
                        <span className="group-hover:scale-110 transition-transform duration-500">👥</span>
                      </div>
                      <div className="relative">
                        <h4 className="font-display font-bold text-[var(--color-navy)] text-lg mb-1 tracking-wide">Multiplayer</h4>
                        <p className="text-xs text-[var(--color-wood-light)] leading-relaxed">Bersaing dengan 2-4 pemain secara lokal di satu perangkat.</p>
                      </div>
                    </motion.button>
                    
                    <motion.button 
                      variants={itemVariants}
                      onClick={() => handleSelectMode('solo')}
                      className="group relative overflow-hidden p-6 rounded-xl border border-[var(--color-wood)] bg-[var(--color-parchment)] shadow-[0_8px_16px_rgba(30,58,95,0.06),inset_0_2px_4px_rgba(255,255,255,1)] hover:shadow-[0_12px_24px_rgba(30,58,95,0.12),inset_0_2px_4px_rgba(255,255,255,1),inset_0_0_0_2px_var(--color-gold)] transition-all text-left flex items-center gap-5 translate-y-0 hover:-translate-y-1"
                    >
                      <div className="absolute -right-6 -top-6 w-24 h-24 bg-[var(--color-gold)]/5 rounded-full blur-xl group-hover:bg-[var(--color-gold)]/10 transition-colors" />
                      <div className="relative w-14 h-14 rounded-full border border-[var(--color-gold)] bg-[var(--color-cream)] flex items-center justify-center text-3xl shadow-inner group-hover:bg-[var(--color-navy)] transition-colors duration-500">
                        <span className="group-hover:scale-110 transition-transform duration-500">🤖</span>
                      </div>
                      <div className="relative">
                        <h4 className="font-display font-bold text-[var(--color-navy)] text-lg mb-1 tracking-wide">Solo vs AI</h4>
                        <p className="text-xs text-[var(--color-wood-light)] leading-relaxed">Latih pengetahuanmu melawan mesin waktu otomatis.</p>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {currentStep === 'players' && (
                <motion.div 
                  key="players"
                  variants={containerVariants}
                  initial="hidden" animate="visible" exit="exit"
                  className="flex-1 flex flex-col pb-8 mt-4"
                >
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <motion.h3 variants={itemVariants} className="text-2xl font-bold font-display text-[var(--color-navy-dark)] mb-1 tracking-wide">Manifes Kru</motion.h3>
                      <motion.p variants={itemVariants} className="text-xs text-[var(--color-wood)] font-medium">Tuliskan identitas para penjelajah.</motion.p>
                    </div>
                    
                    {activeMode === 'multiplayer' && (
                      <motion.div variants={itemVariants} className="flex items-center bg-[var(--color-cream)] rounded-lg p-1 border border-[var(--color-wood)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                        {[2,3,4].map(num => (
                          <button 
                            key={num}
                            onClick={() => { playSFX('click'); setPlayerCount(num); }}
                            className={`w-10 h-8 rounded text-xs font-bold transition-all font-display ${playerCount === num ? 'bg-[var(--color-navy)] text-[var(--color-gold)] shadow-md' : 'text-[var(--color-navy-light)] hover:bg-[var(--color-parchment)]'}`}
                          >
                            {num} Kru
                          </button>
                        ))}
                      </motion.div>
                    )}
                    {activeMode === 'solo' && (
                      <motion.div variants={itemVariants} className="flex items-center bg-[var(--color-cream)] rounded-lg p-1 border border-[var(--color-wood)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                        {[1,2,3].map(num => (
                          <button 
                            key={num}
                            onClick={() => { playSFX('click'); setPlayerCount(num + 1); }}
                            className={`w-10 h-8 rounded text-xs font-bold transition-all font-display ${playerCount === num + 1 ? 'bg-[var(--color-navy)] text-[var(--color-gold)] shadow-md' : 'text-[var(--color-navy-light)] hover:bg-[var(--color-parchment)]'}`}
                          >
                            {num} AI
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-4 flex-1 overflow-y-auto pr-2 hide-scrollbar">
                    {Array.from({ length: playerCount }).map((_, i) => {
                      const isBot = activeMode === 'solo' && i > 0;
                      const colors = ['#1d4ed8', '#b91c1c', '#047857', '#b45309', '#6d28d9'];
                      const badges = ['I', 'II', 'III', 'IV', 'V'];
                      return (
                        <motion.div variants={itemVariants} key={i} className="relative group flex items-stretch rounded-xl border border-[var(--color-wood)] bg-[var(--color-parchment)] overflow-hidden transition-all focus-within:border-[var(--color-navy)] focus-within:shadow-[0_8px_20px_rgba(30,58,95,0.15)] hover:shadow-md">
                          <div className="w-2 self-stretch" style={{ backgroundColor: colors[i] }} />
                          <div className="flex-1 p-3 flex items-center gap-4 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] bg-opacity-50">
                            <div className="w-10 h-10 rounded border border-dashed border-[var(--color-wood)]/30 flex items-center justify-center shrink-0">
                              <span className="font-display font-bold text-lg text-[var(--color-wood)]/50">{badges[i]}</span>
                            </div>
                            <div className="flex-1 flex flex-col justify-center border-b-2 border-dotted border-[var(--color-wood)]/20 focus-within:border-[var(--color-navy)]/50 transition-colors pb-1">
                              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-wood-light)] mb-1">
                                ID Penjelajah {isBot ? '[AUTO]' : ''}
                              </label>
                              <input 
                                type="text"
                                placeholder={isBot ? `Bot ${i} (AI)` : `Masukkan Nama...`}
                                value={isBot ? `Bot ${i} (AI)` : playerNames[i]}
                                onChange={(e) => handleNameChange(i, e.target.value)}
                                disabled={isBot}
                                className="w-full bg-transparent border-none outline-none text-base font-bold text-[var(--color-navy)] placeholder:opacity-30 disabled:opacity-50 font-display tracking-wider"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  <motion.div variants={itemVariants} className="mt-6 pt-4 border-t border-[var(--color-wood)]/20 shrink-0">
                    <button 
                      onClick={checkNamesFilled}
                      className="w-full relative overflow-hidden rounded-xl bg-[var(--color-parchment)] border border-[var(--color-navy)] text-[var(--color-navy)] py-3 font-display font-bold text-sm tracking-[0.2em] uppercase hover:bg-[var(--color-navy)] hover:text-[var(--color-gold-light)] hover:shadow-[0_8px_20px_rgba(30,58,95,0.2)] transition-all duration-300"
                    >
                      Setujui Manifes
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {currentStep === 'theme' && (
                <motion.div 
                  key="theme"
                  variants={containerVariants}
                  initial="hidden" animate="visible" exit="exit"
                  className="flex-1 flex flex-col justify-between mt-4"
                >
                  <div>
                    <motion.h3 variants={itemVariants} className="text-2xl font-bold font-display text-[var(--color-navy-dark)] mb-1 tracking-wide">Pilih Rute</motion.h3>
                    <motion.p variants={itemVariants} className="text-xs text-[var(--color-wood)] mb-6 font-medium">Tentukan estetika dan era peta yang akan dikunjungi.</motion.p>
                    
                    <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
                      {Object.values(allThemes).map((theme) => {
                        const isActive = currentTheme.id === theme.id;
                        const isJakarta = theme.id === 'jakarta-heritage';
                        return (
                          <button 
                            key={theme.id}
                            onClick={() => { playSFX('click'); setTheme(theme.id); }}
                            className={`relative group rounded-xl overflow-hidden border transition-all duration-300 text-left h-40 ${isActive ? 'border-[var(--color-gold)] ring-2 ring-[var(--color-gold)]/50 shadow-[0_12px_24px_rgba(30,58,95,0.2)] scale-[1.02]' : 'border-[var(--color-wood)] hover:border-[var(--color-gold)] opacity-70 hover:opacity-100 hover:shadow-lg bg-black/5'}`}
                          >
                            <div className="absolute inset-0 z-0" style={{ backgroundColor: isJakarta ? '#0f766e' : '#8B4513' }} />
                            
                            {/* SVG Dummy Icon */}
                            {isJakarta ? (
                              <svg viewBox="0 0 100 100" className="absolute bottom-0 right-0 w-24 h-24 opacity-20 group-hover:opacity-40 transition-opacity">
                                 <path d="M 40,100 L 60,100 L 55,20 L 45,20 Z" fill="var(--color-gold)" />
                                 <polygon points="50,0 40,20 60,20" fill="var(--color-gold)" />
                              </svg>
                            ) : (
                              <svg viewBox="0 0 100 100" className="absolute bottom-2 right-2 w-20 h-20 opacity-20 group-hover:opacity-40 transition-opacity">
                                 <path d="M 20,80 C 40,90 60,90 80,80 L 90,60 C 60,70 40,70 10,60 Z" fill="var(--color-gold)" />
                                 <line x1="50" y1="70" x2="50" y2="20" stroke="var(--color-gold)" strokeWidth="4" />
                                 <path d="M 50,25 C 30,35 30,55 50,60 Z" fill="var(--color-gold)" />
                              </svg>
                            )}
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                            
                            <div className="absolute bottom-0 left-0 p-3 z-20">
                              <div className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-2">
                                 {isActive && <div className="w-3 h-3 rounded-full bg-[var(--color-gold)]" />}
                              </div>
                              <h4 className="font-display font-bold text-white text-sm tracking-wide leading-tight">{theme.name}</h4>
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants} className="mt-8 pb-4">
                    <button 
                      onClick={handleStart}
                      className="w-full relative group overflow-hidden rounded-xl bg-[var(--color-navy)] text-[var(--color-gold-light)] py-4 border-2 border-[var(--color-gold)] shadow-[0_8px_32px_rgba(30,58,95,0.4),inset_0_2px_4px_rgba(255,255,255,0.2)] transition-all hover:scale-[1.03] active:scale-[0.98] animate-pulse-glow"
                    >
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-color-dodge pointer-events-none" />
                      <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 group-hover:animate-[shimmer_1.5s_infinite]" />
                      
                      <div className="relative z-10 flex flex-col items-center justify-center gap-1">
                        <span className="font-display font-black text-xl uppercase tracking-[0.2em] drop-shadow-md text-white group-hover:text-[var(--color-gold-light)] transition-colors">
                          Mulai Ekspedisi
                        </span>
                        <span className="text-[8px] font-bold tracking-[0.4em] opacity-60 uppercase">
                          Sistem Siap Dijalankan
                        </span>
                      </div>
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <AboutModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} />
    </div>
  );
}
