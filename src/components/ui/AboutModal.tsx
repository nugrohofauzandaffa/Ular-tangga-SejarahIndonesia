import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '@/contexts/AudioContext';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const { playSFX } = useAudio();
  const [showMembers, setShowMembers] = useState(false);

  const groupMembers = [
    { name: "Mumtaz Qa'ulani", npm: "202543500380" },
    { name: "Hanum Arini", npm: "202543500340" },
    { name: "Revita Silvi Erlinda Sari", npm: "202543500344" },
    { name: "M.Quthb Alhijri", npm: "202543500388" },
    { name: "Muhammad Al-Fath", npm: "202543500360" },
    { name: "Ardi saputra", npm: "202543500392" },
    { name: "Fauzan Daffa Nugroho", npm: "202543501590" }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => { playSFX('click'); onClose(); }}
          className="absolute inset-0 bg-[var(--color-navy-dark)]/70 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[var(--color-parchment)] rounded-2xl shadow-2xl border-4 border-[var(--color-navy)] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Decorative Border & Close Button */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-[var(--color-gold)]" />
          <button
            onClick={() => { playSFX('click'); onClose(); }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-cream-dark)] text-[var(--color-navy-dark)] hover:bg-[var(--color-gold-light)] hover:text-white transition-colors z-20 border border-[var(--color-wood)]/20"
          >
            ✕
          </button>

          {/* Header */}
          <div className="bg-[var(--color-navy)] pt-8 pb-6 px-6 text-center shrink-0 border-b-2 border-[var(--color-gold)] relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="relative z-10">
              <div className="text-4xl mb-2 drop-shadow-md">🎓</div>
              <h2 className="text-2xl font-black text-white font-display tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                Tentang Game
              </h2>
              <p className="text-[10px] font-bold text-[var(--color-gold)] tracking-[0.2em] mt-1 uppercase">
                Tugas Mata Kuliah Pemrograman 2
              </p>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 font-body custom-scrollbar">
            
            {/* Card 1: Identitas Kampus */}
            <div className="bg-[var(--color-cream)] border border-[var(--color-wood)]/20 rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-[var(--color-navy-dark)] text-sm mb-2 border-b border-[var(--color-wood)]/10 pb-2 flex items-center gap-2">
                <span className="text-lg">🏫</span> Identitas Kampus
              </h3>
              <ul className="text-sm text-[var(--color-wood)] space-y-1.5 ml-1">
                <li className="font-semibold text-[var(--color-navy)]">Universitas Indraprasta PGRI (UNINDRA)</li>
                <li>Fakultas Teknik & Ilmu Komputer</li>
                <li>Program Studi: Teknik Informatika</li>
                <li>Tahun Akademik: 2026</li>
              </ul>
            </div>

            {/* Card 2: Informasi Kelompok */}
            <div className="bg-[var(--color-cream)] border border-[var(--color-wood)]/20 rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-4">
                <h3 className="font-bold text-[var(--color-navy-dark)] text-sm mb-2 border-b border-[var(--color-wood)]/10 pb-2 flex items-center gap-2">
                  <span className="text-lg">👥</span> Anggota Kelompok 1
                </h3>
                <ul className="text-sm text-[var(--color-wood)] space-y-2 ml-1">
                  <li className="flex items-center gap-2">
                    <span className="w-5 text-center">👤</span> Kelompok 1 - Pemrograman 2
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 text-center">🎓</span> Program Studi Teknik Informatika
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 text-center">🏫</span> Universitas Indraprasta PGRI (UNINDRA)
                  </li>
                </ul>
              </div>

              {/* Expandable Members Section */}
              <div className="border-t border-[var(--color-wood)]/20 bg-black/5">
                <button
                  onClick={() => { playSFX('click'); setShowMembers(!showMembers); }}
                  className="w-full py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-bold text-[var(--color-navy)] hover:bg-[var(--color-gold-light)]/20 transition-colors uppercase tracking-widest"
                >
                  {showMembers ? 'Sembunyikan Anggota' : 'Lihat Anggota'}
                  <span className={`transform transition-transform ${showMembers ? 'rotate-180' : ''}`}>▼</span>
                </button>
                <AnimatePresence>
                  {showMembers && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                          {groupMembers.map((member, idx) => (
                            <div key={idx} className="bg-white/60 border border-[var(--color-wood)]/10 rounded-lg p-2 text-xs flex flex-col">
                              <span className="font-bold text-[var(--color-navy)]">{member.name}</span>
                              <span className="text-[10px] text-[var(--color-wood)] opacity-80">{member.npm}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Card 3: Penjelasan Singkat */}
            <div className="bg-[var(--color-cream)] border border-[var(--color-wood)]/20 rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-[var(--color-navy-dark)] text-sm mb-2 border-b border-[var(--color-wood)]/10 pb-2 flex items-center gap-2">
                <span className="text-lg">📜</span> Penjelasan Singkat
              </h3>
              <div className="text-xs text-[var(--color-wood)] space-y-2 leading-relaxed">
                <p>
                  Game <strong className="text-[var(--color-navy)]">Ular Tangga Sejarah Nusantara</strong> menggabungkan keseruan permainan ular tangga klasik dengan tantangan edukatif sejarah Indonesia. Dibuat dengan konsep peta perjalanan waktu dengan dukungan tema visual dinamis (Classic & Jakarta Heritage).
                </p>
                <p>
                  <strong className="text-[var(--color-navy)]">Fitur Utama:</strong> Audio interaktif, efek papan unik (Snake, Ladder, Buff, Debuff), Kuis Pilihan Ganda Interaktif, Fase Krisis (Endgame), serta agen Bot/AI cerdas untuk bermain secara Solo.
                </p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
