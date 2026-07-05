'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { THEMES, ThemeConfig } from '../constants/themes';

interface ThemeContextType {
  currentTheme: ThemeConfig;
  setTheme: (themeId: string) => void;
  allThemes: Record<string, ThemeConfig>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeId, setThemeIdState] = useState<string>('classic');

  // Load saved theme on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('game_theme');
      if (savedTheme && THEMES[savedTheme]) {
        Promise.resolve().then(() => {
          setThemeIdState(savedTheme);
        });
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        document.documentElement.setAttribute('data-theme', 'classic');
      }
    } catch {
      console.warn('Failed to load theme from localStorage');
    }
  }, []);

  const setTheme = (id: string) => {
    if (THEMES[id]) {
      setThemeIdState(id);
      try {
        localStorage.setItem('game_theme', id);
      } catch {
        // Ignore localStorage errors
      }
      // Apply theme as data-theme attribute on root element
      document.documentElement.setAttribute('data-theme', id);
    }
  };


  const currentTheme = THEMES[themeId] || THEMES.classic;

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, allThemes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};
