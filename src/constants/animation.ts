export const ANIMATION_GUIDELINES = {
  CATEGORIES: {
    QUICK: {
      duration: 0.2, // seconds (framer motion uses seconds)
      durationMs: 200,
      ease: 'easeOut',
    },
    NORMAL: {
      duration: 0.4,
      durationMs: 400,
      ease: 'easeInOut',
    },
    HEAVY: {
      duration: 0.7,
      durationMs: 700,
      ease: 'backOut',
    },
    EPIC: {
      duration: 1.2,
      durationMs: 1200,
    }
  },
  SPRINGS: {
    BOUNCY: {
      type: 'spring',
      stiffness: 300,
      damping: 15,
    },
    GENTLE: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
    STIFF: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
    }
  }
};
