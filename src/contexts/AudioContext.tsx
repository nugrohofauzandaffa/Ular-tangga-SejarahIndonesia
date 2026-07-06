'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Howl, Howler } from 'howler';

export type SFXType = 'dice' | 'correct' | 'wrong' | 'snake' | 'ladder' | 'click' | 'hop' | 'popup_quiz' | 'popup_effect' | 'popup_dicemod' | 'popup_crisis' | 'popup_result' | 'popup_bonus' | 'popup_penalty';

interface AudioContextType {
  volume: number;
  isMuted: boolean;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  playSFX: (type: SFXType) => void;
  playBGM: (type?: 'menu' | 'game' | 'game_jakarta') => void;
  stopBGM: (type?: 'menu' | 'game' | 'game_jakarta' | 'all') => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

// Define sound assets
const sfxAssets: Record<SFXType, string> = {
  dice: '/assets/audio/dice.mp3',
  correct: '/assets/audio/correct.mp3',
  wrong: '/assets/audio/wrong.mp3',
  snake: '/assets/audio/snake.mp3',
  ladder: '/assets/audio/ladder.mp3',
  click: '/assets/audio/click.mp3',
  hop: '/assets/audio/hop.wav',
  popup_quiz: '/assets/audio/popup_quiz.wav',
  popup_effect: '/assets/audio/popup_effect.wav',
  popup_dicemod: '/assets/audio/popup_dicemod.wav',
  popup_crisis: '/assets/audio/popup_crisis.wav',
  popup_result: '/assets/audio/popup_result.wav',
  popup_bonus: '/assets/audio/popup_bonus.wav',
  popup_penalty: '/assets/audio/popup_penalty.wav',
};

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [volume, setVolumeState] = useState<number>(0.5); // 0.0 to 1.0
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Instance for BGM so we can start/stop it specifically
  const bgmRefs = useRef<{ game: Howl | null; menu: Howl | null; game_jakarta: Howl | null }>({
    menu: null,
    game: null,
    game_jakarta: null,
  });

  // References to all SFX Howl instances
  const sfxRefs = useRef<Record<SFXType, Howl | null>>({
    dice: null,
    correct: null,
    wrong: null,
    snake: null,
    ladder: null,
    click: null,
    hop: null,
    popup_quiz: null,
    popup_effect: null,
    popup_dicemod: null,
    popup_crisis: null,
    popup_result: null,
    popup_bonus: null,
    popup_penalty: null,
  });

  // Load saved settings on mount
  useEffect(() => {
    try {
      const savedVolume = localStorage.getItem('game_volume');
      const savedMute = localStorage.getItem('game_muted');

      let initialVolume = 0.5;
      if (savedVolume !== null) {
        initialVolume = parseFloat(savedVolume);
      }

      let initialMute = false;
      if (savedMute !== null) {
        initialMute = savedMute === 'true';
      }

      Promise.resolve().then(() => {
        setVolumeState(initialVolume);
        setIsMuted(initialMute);
      });

      // Initialize Howler global settings
      Howler.volume(initialVolume);
      Howler.mute(initialMute);

      // Initialize BGM
      const bgmGame = new Howl({
        src: ['/assets/audio/bgm.mp3'],
        loop: true,
        volume: 0.3, // BGM slightly lower than master volume
        preload: true,
      });
      bgmRefs.current.game = bgmGame;

      const bgmMenu = new Howl({
        src: ['/assets/audio/bgm_main.mp3'],
        loop: true,
        volume: 0.3,
        preload: true,
      });
      bgmRefs.current.menu = bgmMenu;

      const bgmGameJakarta = new Howl({
        src: ['/assets/audio/bgm_jakarta.mp3'],
        loop: true,
        volume: 0.3,
        preload: true,
      });
      bgmRefs.current.game_jakarta = bgmGameJakarta;

      // Initialize SFX
      (Object.keys(sfxAssets) as SFXType[]).forEach((type) => {
        sfxRefs.current[type] = new Howl({
          src: [sfxAssets[type]],
          preload: true,
        });
      });
    } catch {
      console.warn('Failed to load audio settings from localStorage');
    }
  }, []);

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    Howler.volume(newVolume);
    try {
      localStorage.setItem('game_volume', newVolume.toString());
    } catch {
      // Ignore localStorage errors
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    Howler.mute(newMuted);
    try {
      localStorage.setItem('game_muted', newMuted.toString());
    } catch {
      // Ignore localStorage errors
    }
  };

  const playSFX = (type: SFXType) => {
    if (!isMuted && sfxRefs.current[type]) {
      sfxRefs.current[type]?.play();
    }
  };

  const playBGM = (type: 'menu' | 'game' | 'game_jakarta' = 'game') => {
    let targetBgm = bgmRefs.current.game;
    if (type === 'menu') targetBgm = bgmRefs.current.menu;
    if (type === 'game_jakarta') targetBgm = bgmRefs.current.game_jakarta;

    if (targetBgm && !targetBgm.playing()) {
      targetBgm.play();
    }
  };

  const stopBGM = (type: 'menu' | 'game' | 'game_jakarta' | 'all' = 'all') => {
    const currentBgmRefs = bgmRefs.current;
    if ((type === 'game' || type === 'all') && currentBgmRefs.game && currentBgmRefs.game.playing()) {
      currentBgmRefs.game.stop();
    }
    if ((type === 'menu' || type === 'all') && currentBgmRefs.menu && currentBgmRefs.menu.playing()) {
      currentBgmRefs.menu.stop();
    }
    if ((type === 'game_jakarta' || type === 'all') && currentBgmRefs.game_jakarta && currentBgmRefs.game_jakarta.playing()) {
      currentBgmRefs.game_jakarta.stop();
    }
  };

  return (
    <AudioContext.Provider
      value={{
        volume,
        isMuted,
        setVolume,
        toggleMute,
        playSFX,
        playBGM,
        stopBGM,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
