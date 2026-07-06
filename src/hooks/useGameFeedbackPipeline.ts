import { useAudio } from '@/contexts/AudioContext';

import { useReducedMotion } from 'framer-motion';
import { useCallback } from 'react';

// Defines the unified orchestrator for Game Juice and feedback.
export const useGameFeedbackPipeline = () => {
  const { playSFX } = useAudio();

  const prefersReducedMotion = useReducedMotion();

  /**
   * Called when a player lands from a hop or event.
   * Coordinates Audio and Particles.
   */
  const triggerLandingFeedback = useCallback((x: number, y: number, isHeavy = false) => {
    playSFX('hop');
    
    if (!prefersReducedMotion && isHeavy) {
      // Spawn dust particle at the token's coordinates (need raw screen coords or normalized)
      // Since our board uses percentages, we'll need the DOM element's actual rect or a way to translate.
      // For now, we will simulate it.
      // spawnParticle('dust', screenX, screenY);
    }
  }, [playSFX, prefersReducedMotion]);

  /**
   * Called to trigger a screen shake.
   */
  const triggerScreenShake = useCallback(() => {
    if (prefersReducedMotion) return;
    
    // Dispatch a custom event that the root layout can listen to for screen shake
    const event = new CustomEvent('game:screenshake');
    window.dispatchEvent(event);
  }, [prefersReducedMotion]);

  return {
    triggerLandingFeedback,
    triggerScreenShake,
    prefersReducedMotion
  };
};
