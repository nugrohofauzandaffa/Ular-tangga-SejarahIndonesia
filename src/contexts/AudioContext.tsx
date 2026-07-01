'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Howl, Howler } from 'howler';

type SFXType = 'dice' | 'correct' | 'wrong' | 'snake' | 'ladder' | 'click';

interface AudioContextType {
  volume: number;
  isMuted: boolean;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  playSFX: (type: SFXType) => void;
  playBGM: (type?: 'menu' | 'game') => void;
  stopBGM: (type?: 'menu' | 'game' | 'all') => void;
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
};

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [volume, setVolumeState] = useState<number>(0.5); // 0.0 to 1.0
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Instance for BGM so we can start/stop it specifically
  const bgmRefs = useRef<{ game: Howl | null; menu: Howl | null }>({
    game: null,
    menu: null,
  });

  // References to all SFX Howl instances
  const sfxRefs = useRef<Record<SFXType, Howl | null>>({
    dice: null,
    correct: null,
    wrong: null,
    snake: null,
    ladder: null,
    click: null,
  });

  // Load saved settings on mount
  useEffect(() => {
    try {
      const savedVolume = localStorage.getItem('game_volume');
      const savedMute = localStorage.getItem('game_muted');

      let initialVolume = 0.5;
      if (savedVolume !== null) {
        initialVolume = parseFloat(savedVolume);
        setVolumeState(initialVolume);
      }

      let initialMute = false;
      if (savedMute !== null) {
        initialMute = savedMute === 'true';
        setIsMuted(initialMute);
      }

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

      // Initialize SFX
      (Object.keys(sfxAssets) as SFXType[]).forEach((type) => {
        sfxRefs.current[type] = new Howl({
          src: [sfxAssets[type]],
          preload: true,
        });
      });

      // We don't auto-play BGM here because browsers block autoplay without user interaction.
      // We'll expose playBGM for the UI to call after interaction.
    } catch (e) {
      console.warn('Failed to load audio settings from localStorage', e);
    }
  }, []);

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    Howler.volume(newVolume);
    try {
      localStorage.setItem('game_volume', newVolume.toString());
    } catch (e) {
      // Ignore localStorage errors
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    Howler.mute(newMuted);
    try {
      localStorage.setItem('game_muted', newMuted.toString());
    } catch (e) {
      // Ignore localStorage errors
    }
  };

  const playSFX = (type: SFXType) => {
    if (!isMuted && sfxRefs.current[type]) {
      sfxRefs.current[type]?.play();
    }
  };

  const playBGM = (type: 'menu' | 'game' = 'game') => {
    const targetBgm = type === 'game' ? bgmRefs.current.game : bgmRefs.current.menu;
    if (targetBgm && !targetBgm.playing()) {
      targetBgm.play();
    }
  };

  const stopBGM = (type: 'menu' | 'game' | 'all' = 'all') => {
    if ((type === 'game' || type === 'all') && bgmRefs.current.game && bgmRefs.current.game.playing()) {
      bgmRefs.current.game.stop();
    }
    if ((type === 'menu' || type === 'all') && bgmRefs.current.menu && bgmRefs.current.menu.playing()) {
      bgmRefs.current.menu.stop();
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
