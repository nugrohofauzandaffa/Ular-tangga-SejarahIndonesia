import React, { useEffect, useRef } from 'react';
import { GameLog } from '@/types/gameState';

interface GameLogBoxProps {
  logs: GameLog[];
  title?: string;
  className?: string;
}

export const GameLogBox: React.FC<GameLogBoxProps> = ({ logs, title = "Game Log", className = "" }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className={`flex flex-col bg-[var(--color-parchment)] rounded-xl shadow-sm border border-[var(--color-wood)]/20 overflow-hidden ${className}`}>
      <div className="bg-[var(--color-cream)] px-4 py-2 border-b border-[var(--color-wood)]/20">
        <h3 className="font-semibold text-[var(--color-navy)] text-sm">{title}</h3>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 max-h-64 scroll-smooth"
      >
        {logs.length === 0 ? (
          <p className="text-slate-400 text-sm text-center italic">Belum ada aktivitas tercatat.</p>
        ) : (
          logs.map((log) => {
            const time = new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            
            let badgeColor = "bg-slate-100 text-slate-600";
            let badgeIcon = "ℹ️";
            
            if (log.type === 'bonus') {
              badgeColor = "bg-yellow-100 text-yellow-700 border-yellow-200";
              badgeIcon = "🎁";
            } else if (log.type === 'penalty') {
              badgeColor = "bg-red-100 text-red-700 border-red-200";
              badgeIcon = "⚠️";
            }

            return (
              <div key={log.id} className="flex flex-col text-sm border-b border-[var(--color-wood)]/10 pb-2 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[var(--color-navy)]">{log.playerName}</span>
                  <span className="text-[10px] text-[var(--color-wood)] uppercase tracking-wider font-bold">
                    {time}
                  </span>
                </div>
                <div className={`text-xs px-2 py-1.5 rounded-md border ${badgeColor} inline-block`}>
                  <span className="mr-1">{badgeIcon}</span> {log.message}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
