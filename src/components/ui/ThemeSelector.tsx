import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeSelector() {
  const { currentTheme, setTheme, allThemes } = useTheme();

  return (
    <div className="space-y-3">
      <label
        className="block text-xs font-bold uppercase tracking-widest"
        style={{ color: 'var(--color-navy)', fontFamily: 'var(--font-display)' }}
      >
        Pilih Tema Game
      </label>
      <div className="grid grid-cols-1 gap-2.5">
        {Object.values(allThemes).map((theme) => {
          const isActive = theme.id === currentTheme.id;

          // Theme-specific border/accent styles for the selector card
          const activeStyle = isActive
            ? {
                borderColor: 'var(--color-gold)',
                backgroundColor: 'rgba(201, 168, 76, 0.08)',
                boxShadow: '0 4px 12px rgba(201,168,76,0.15), inset 0 0 0 1px var(--color-gold)',
              }
            : {
                borderColor: 'var(--color-cream-dark)',
                backgroundColor: 'var(--color-cream)',
              };

          return (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className="flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer group"
              style={{
                ...activeStyle,
                fontFamily: 'var(--font-body)',
              }}
            >
              {/* Theme Color Dots / Swatches */}
              <div className="flex flex-col gap-1 items-center justify-center shrink-0 mt-0.5">
                <div className="flex gap-1">
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-black/10"
                    style={{ backgroundColor: theme.board.gridBg }}
                  />
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-black/10"
                    style={{ backgroundColor: theme.board.borderColor }}
                  />
                </div>
                <div className="flex gap-1">
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-black/10"
                    style={{ backgroundColor: theme.board.snakeGrad.start }}
                  />
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-black/10"
                    style={{ backgroundColor: theme.board.ladderGrad.start }}
                  />
                </div>
              </div>

              {/* Theme Metadata */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className="font-bold text-sm"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: isActive ? 'var(--color-gold-dark)' : 'var(--color-navy-dark)',
                    }}
                  >
                    {theme.name}
                  </span>
                  {isActive && (
                    <span
                      className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider bg-[#c9a84c]/20"
                      style={{ color: 'var(--color-gold-dark)' }}
                    >
                      Aktif
                    </span>
                  )}
                </div>
                <p
                  className="text-xs mt-1 leading-relaxed line-clamp-2"
                  style={{ color: 'var(--color-navy-light)' }}
                >
                  {theme.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
