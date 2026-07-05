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
  colorIndex?: number;
  angle?: number;
  distance?: number;
  radian?: number;
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
    // Impure generations are safe inside hooks/callbacks, not in the direct render cycle
    const newParticle: Particle = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      x,
      y,
      createdAt: Date.now(),
      colorIndex: Math.floor(Math.random() * 6),
      angle: Math.random() * 360,
      distance: 30 + Math.random() * 50,
      radian: (Math.random() * 360 * Math.PI) / 180,
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
      <div className="fixed inset-0 pointer-events-none z-[120] overflow-hidden">
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

  if (particle.type === 'confetti') {
    const colors = ['#fcd34d', '#34d399', '#f87171', '#60a5fa', '#c084fc', '#f97316'];
    const color = colors[(particle.colorIndex ?? 0) % colors.length];
    const angle = particle.angle ?? 0;
    const distance = particle.distance ?? 50;
    const radian = particle.radian ?? 0;
    const destX = Math.cos(radian) * distance;
    const destY = Math.sin(radian) * distance + 50; // falls down slightly

    return (
      <motion.div
        className="absolute w-2 h-2 rounded-sm"
        initial={{ left: particle.x, top: particle.y, rotate: 0, scale: 0.2, opacity: 1 }}
        animate={{ 
          x: destX, 
          y: destY,
          rotate: angle, 
          scale: [0.2, 1.2, 0.7], 
          opacity: [1, 1, 0] 
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ backgroundColor: color, x: '-50%', y: '-50%' }}
      />
    );
  }

  if (particle.type === 'sparkle') {
    const radian = particle.radian ?? 0;
    const distance = particle.distance ?? 30;
    const destX = Math.cos(radian) * distance;
    const destY = Math.sin(radian) * distance;

    return (
      <motion.div
        className="absolute w-2 h-2"
        initial={{ left: particle.x, top: particle.y, scale: 0.2, opacity: 1, rotate: 45 }}
        animate={{ 
          x: destX, 
          y: destY,
          scale: [0.2, 1.3, 0], 
          opacity: [1, 1, 0] 
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ 
          backgroundColor: '#fcd34d', 
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          x: '-50%', 
          y: '-50%' 
        }}
      />
    );
  }
  
  return null;
};
