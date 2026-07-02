"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIMATION_GUIDELINES } from '@/constants/animation';

type ParticleType = 'dust' | 'confetti' | 'sparkle';

interface Particle {
  id: string;
  type: ParticleType;
  x: number; // Viewport X or relative to container
  y: number; // Viewport Y or relative to container
  createdAt: number;
}

interface ParticleContextType {
  spawnParticle: (type: ParticleType, x: number, y: number) => void;
}

const ParticleContext = createContext<ParticleContextType>({
  spawnParticle: () => {},
});

export const useParticles = () => useContext(ParticleContext);

export const ParticleManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const spawnParticle = useCallback((type: ParticleType, x: number, y: number) => {
    const newParticle: Particle = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      x,
      y,
      createdAt: Date.now(),
    };

    setParticles(prev => [...prev, newParticle]);

    // Auto cleanup after epic duration + buffer
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, ANIMATION_GUIDELINES.CATEGORIES.EPIC.durationMs + 1000);
  }, []);

  return (
    <ParticleContext.Provider value={{ spawnParticle }}>
      {children}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {particles.map(particle => (
            <ParticleEffect key={particle.id} particle={particle} />
          ))}
        </AnimatePresence>
      </div>
    </ParticleContext.Provider>
  );
};

const ParticleEffect = ({ particle }: { particle: Particle }) => {
  if (particle.type === 'dust') {
    return (
      <motion.div
        className="absolute w-8 h-8 rounded-full bg-slate-300/60 blur-sm"
        initial={{ left: particle.x, top: particle.y, scale: 0, opacity: 0.8 }}
        animate={{ scale: [0, 1.5], opacity: [0.8, 0], y: particle.y - 20 }}
        exit={{ opacity: 0 }}
        transition={{ duration: ANIMATION_GUIDELINES.CATEGORIES.QUICK.duration, ease: "easeOut" }}
        style={{ x: '-50%', y: '-50%' }}
      />
    );
  }
  
  // Future implementation for confetti or sparkle
  return null;
};
