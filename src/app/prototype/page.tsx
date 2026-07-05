"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PROTOTYPE: Main Menu Redesign (Hero Focus)
 * Route   : /prototype
 * Tujuan  : Preview redesign splash screen dengan hero yang lebih dramatis, 
 *           ilustrasi sejarah, depth, ornament, dan lighting.
 *           *Ambient Motion Update*: Breathing logo, floating dust, dll.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useSpring, useTransform, useMotionValue } from "framer-motion";

// ─── Feature Strip Data ────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5" fill="none">
        {/* Lontar Manuscript */}
        <path d="M4 6 L20 6 L18 18 L6 18 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M4 10 L20 10 M5 14 L19 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="6" r="1" fill="currentColor" />
        <path d="M12 2 V6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "BELAJAR",
    sub: "Sejarah Indonesia",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5" fill="none">
        {/* Carved Wooden Dice */}
        <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
        <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" />
        <path d="M4 12 C 10 10, 14 14, 20 12" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
      </svg>
    ),
    title: "BERMAIN",
    sub: "Seru & Edukatif",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5" fill="none">
        {/* Mahkota Nusantara */}
        <path d="M3 18 L21 18 L19 22 L5 22 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M3 18 L6 6 L12 12 L18 6 L21 18" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="1.5" fill="currentColor" />
        <circle cx="6" cy="4" r="1.5" fill="currentColor" />
        <circle cx="18" cy="4" r="1.5" fill="currentColor" />
      </svg>
    ),
    title: "MENANG",
    sub: "Raih Peringkat Tertinggi",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5" fill="none">
        {/* Bambu Runcing & Bendera */}
        <path d="M12 2 L12 22 M8 22 L16 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 4 L20 8 L20 12 L12 12" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 2 L9 5 L12 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    title: "BANGGA",
    sub: "Jadi Generasi Cerdas",
  },
];

// ─── Ambient Particles (bg & fg) ───────────────────────────────────────────────
const PARTICLES = [
  { left: "11%", top: "14%", size: 3.0, delay: 0.0, dur: 18.5, op: 0.12, drift: 25, blur: 1.5, rot: 180 },
  { left: "26%", top: "38%", size: 2.0, delay: 2.8, dur: 15.2, op: 0.09, drift: -22, blur: 3.0, rot: -90 },
  { left: "72%", top: "22%", size: 2.5, delay: 1.4, dur: 22.0, op: 0.10, drift: 30, blur: 2.0, rot: 360 },
  { left: "84%", top: "52%", size: 2.0, delay: 0.3, dur: 17.8, op: 0.09, drift: -25, blur: 4.0, rot: -180 },
  { left: "93%", top: "34%", size: 2.0, delay: 3.0, dur: 19.9, op: 0.09, drift: 28, blur: 2.5, rot: 90 },
  { left: "6%",  top: "62%", size: 3.0, delay: 1.7, dur: 21.7, op: 0.10, drift: -20, blur: 1.0, rot: 270 },
  { left: "56%", top: "10%", size: 2.0, delay: 0.5, dur: 16.5, op: 0.08, drift: 22, blur: 3.5, rot: -270 },
  { left: "78%", top: "80%", size: 2.5, delay: 4.5, dur: 24.3, op: 0.09, drift: -28, blur: 2.0, rot: 180 },
  { left: "88%", top: "14%", size: 2.0, delay: 0.9, dur: 18.7, op: 0.10, drift: 24, blur: 3.0, rot: -360 },
  { left: "22%", top: "82%", size: 2.5, delay: 2.2, dur: 20.8, op: 0.09, drift: -26, blur: 1.5, rot: 90 },
  // Extra subtle dust for more life
  { left: "45%", top: "45%", size: 1.5, delay: 1.2, dur: 25.0, op: 0.07, drift: 35, blur: 4.5, rot: -180 },
  { left: "35%", top: "75%", size: 1.5, delay: 5.1, dur: 23.5, op: 0.08, drift: -32, blur: 3.5, rot: 180 },
];

const FG_PARTICLES = [
  { left: "28%", top: "25%", size: 4.0, delay: 0.4, dur: 18.8, op: 0.22, drift: 45, blur: 0.5, rot: 180 },
  { left: "72%", top: "30%", size: 3.5, delay: 3.2, dur: 21.2, op: 0.18, drift: -40, blur: 1.0, rot: -180 },
  { left: "38%", top: "60%", size: 4.5, delay: 0.0, dur: 24.8, op: 0.16, drift: 50, blur: 1.5, rot: 360 },
  { left: "64%", top: "58%", size: 4.0, delay: 4.0, dur: 17.5, op: 0.20, drift: -45, blur: 0.5, rot: -360 },
  { left: "48%", top: "22%", size: 3.0, delay: 1.5, dur: 23.0, op: 0.15, drift: 48, blur: 1.0, rot: 90 },
  { left: "55%", top: "68%", size: 3.5, delay: 2.7, dur: 16.2, op: 0.18, drift: -50, blur: 0, rot: -90 },
];

// ─── SVG Assets ───────────────────────────────────────────────────────────────

function SuryaMajapahit() {
  const mainRays = Array.from({ length: 8 }, (_, i) => `rotate(${i * 45} 60 60)`);
  const subRays = Array.from({ length: 8 }, (_, i) => `rotate(${i * 45 + 22.5} 60 60)`);

  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      <defs>
        {/* Main Ray (8 points) */}
        <path id="mainRay" d="M 60 6 L 68 38 L 60 48 L 52 38 Z" fill="url(#goldGrad)" fillOpacity="0.55" />
        {/* Sub Ray (8 points in between) */}
        <path id="subRay" d="M 60 16 L 65 42 L 60 46 L 55 42 Z" fill="url(#goldGrad)" fillOpacity="0.35" />
      </defs>
      
      {/* Outer Glow & Halo */}
      <circle cx="60" cy="60" r="54" stroke="url(#goldGrad)" strokeWidth="0.8" strokeOpacity="0.25" />
      <circle cx="60" cy="60" r="48" stroke="url(#goldGrad)" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="2 4" />
      <circle cx="60" cy="60" r="44" stroke="url(#goldGrad)" strokeWidth="1.2" strokeOpacity="0.15" />

      {/* Sun Rays */}
      {subRays.map((transform, i) => <use key={`sub-${i}`} href="#subRay" transform={transform} />)}
      {mainRays.map((transform, i) => <use key={`main-${i}`} href="#mainRay" transform={transform} />)}

      {/* Core Rings (Majapahit Sun Center) */}
      <circle cx="60" cy="60" r="22" fill="var(--color-navy)" fillOpacity="0.8" />
      <circle cx="60" cy="60" r="22" stroke="url(#goldGrad)" strokeWidth="1.5" strokeOpacity="0.8" />
      <circle cx="60" cy="60" r="17" stroke="url(#goldGrad)" strokeWidth="0.5" strokeOpacity="0.5" />
      <circle cx="60" cy="60" r="13" stroke="url(#goldGrad)" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 3" />
      
      {/* Inner 8-petal Lotus (Padma) */}
      {mainRays.map((transform, i) => (
        <path key={`petal-${i}`} d="M 60 38 C 65 46 65 52 60 60 C 55 52 55 46 60 38 Z" fill="url(#goldGrad)" fillOpacity="0.45" transform={transform} />
      ))}
      
      <circle cx="60" cy="60" r="5" fill="url(#goldGrad)" fillOpacity="0.8" />
      <circle cx="60" cy="60" r="2" fill="var(--color-cream)" fillOpacity="0.6" />
    </svg>
  );
}

function Borobudur() {
  return (
    <svg viewBox="0 0 260 340" className="w-full h-full" fill="url(#silGrad)"
      style={{
        maskImage: "linear-gradient(to top, black 30%, rgba(0,0,0,0.5) 70%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to top, black 30%, rgba(0,0,0,0.5) 70%, transparent 100%)",
      }}>
      <rect x="0"   y="298" width="260" height="20" rx="1" />
      <rect x="16"  y="278" width="228" height="20" rx="1" />
      <rect x="34"  y="260" width="192" height="18" rx="1" />
      <rect x="52"  y="244" width="156" height="16" rx="1" />
      <rect x="70"  y="230" width="120" height="14" rx="1" />
      <rect x="82"  y="218" width="96"  height="12" rx="5" />
      <rect x="92"  y="207" width="76"  height="11" rx="5" />
      <rect x="101" y="198" width="58"  height="9"  rx="4" />
      <ellipse cx="94"  cy="196" rx="7" ry="8" />
      <ellipse cx="166" cy="196" rx="7" ry="8" />
      <ellipse cx="130" cy="167" rx="24" ry="30" />
      <rect x="128" y="136" width="4" height="31" rx="1" />
      <ellipse cx="130" cy="136" rx="7" ry="4" />
      <ellipse cx="130" cy="129" rx="5.5" ry="3.5" />
      <ellipse cx="130" cy="123" rx="4"   ry="3" />
      <path d="M127 123 L130 106 L133 123 Z" />
    </svg>
  );
}

function Prambanan() {
  return (
    <svg viewBox="0 0 280 360" className="w-full h-full" fill="url(#silGrad)"
      style={{
        maskImage: "linear-gradient(to top, black 25%, rgba(0,0,0,0.5) 65%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to top, black 25%, rgba(0,0,0,0.5) 65%, transparent 100%)",
      }}>
      <rect x="90"  y="320" width="100" height="22" rx="2" />
      <rect x="100" y="300" width="80"  height="20" rx="2" />
      <rect x="108" y="284" width="64"  height="16" rx="2" />
      <rect x="116" y="195" width="48"  height="89" rx="4" />
      <rect x="113" y="182" width="54" height="13" rx="3" />
      <rect x="116" y="171" width="48" height="11" rx="3" />
      <rect x="119" y="161" width="42" height="10" rx="3" />
      <rect x="121" y="153" width="38" height="8"  rx="2" />
      <rect x="123" y="146" width="34" height="7"  rx="2" />
      <rect x="125" y="140" width="30" height="6"  rx="2" />
      <rect x="127" y="135" width="26" height="5"  rx="2" />
      <rect x="129" y="130" width="22" height="5"  rx="2" />
      <rect x="131" y="126" width="18" height="4"  rx="1" />
      <rect x="136" y="116" width="8"  height="10" rx="1" />
      <circle cx="140" cy="111" r="6" />
      <path d="M137 111 L140 94 L143 111 Z" />
      <rect x="16"  y="320" width="68" height="18" rx="2" />
      <rect x="24"  y="304" width="52" height="16" rx="2" />
      <rect x="31"  y="292" width="38" height="12" rx="2" />
      <rect x="36"  y="225" width="28" height="67" rx="3" />
      <rect x="34"  y="215" width="32" height="10" rx="2" />
      <rect x="36"  y="207" width="28" height="8"  rx="2" />
      <rect x="38"  y="200" width="24" height="7"  rx="2" />
      <rect x="40"  y="194" width="20" height="6"  rx="2" />
      <rect x="42"  y="189" width="16" height="5"  rx="2" />
      <rect x="44"  y="185" width="12" height="4"  rx="1" />
      <path d="M47 182 L50 163 L53 182 Z" />
      <rect x="196" y="320" width="68" height="18" rx="2" />
      <rect x="204" y="304" width="52" height="16" rx="2" />
      <rect x="211" y="292" width="38" height="12" rx="2" />
      <rect x="216" y="225" width="28" height="67" rx="3" />
      <rect x="214" y="215" width="32" height="10" rx="2" />
      <rect x="216" y="207" width="28" height="8"  rx="2" />
      <rect x="218" y="200" width="24" height="7"  rx="2" />
      <rect x="220" y="194" width="20" height="6"  rx="2" />
      <rect x="222" y="189" width="16" height="5"  rx="2" />
      <rect x="224" y="185" width="12" height="4"  rx="1" />
      <path d="M227 182 L230 163 L233 182 Z" />
    </svg>
  );
}

function GununganWayang() {
  return (
    <svg viewBox="0 0 400 500" className="w-full h-full" fill="none" preserveAspectRatio="xMidYMid meet">
      {/* Outer border of Gunungan */}
      <path d="M 200 20 C 250 150, 350 300, 380 480 L 20 480 C 50 300, 150 150, 200 20 Z" 
            stroke="var(--color-gold)" strokeWidth="4" strokeOpacity="0.4" fill="var(--color-gold)" fillOpacity="0.05" />
      <path d="M 200 40 C 240 160, 330 310, 360 470 L 40 470 C 70 310, 160 160, 200 40 Z" 
            stroke="var(--color-gold)" strokeWidth="1.5" strokeOpacity="0.25" strokeDasharray="6 6" />
      
      {/* Inner Tree of Life (Pohon Hayat) abstract */}
      <path d="M 200 470 L 200 100 M 200 350 C 150 250, 100 200, 100 200 M 200 350 C 250 250, 300 200, 300 200 M 200 250 C 150 180, 120 150, 120 150 M 200 250 C 250 180, 280 150, 280 150" 
            stroke="var(--color-gold)" strokeWidth="3" strokeOpacity="0.3" strokeLinecap="round" />
            
      {/* Base / Gates (Gapura) abstract */}
      <path d="M 120 470 L 120 400 L 160 400 L 160 470 M 280 470 L 280 400 L 240 400 L 240 470 M 160 400 L 240 400" 
            stroke="var(--color-gold)" strokeWidth="2.5" strokeOpacity="0.35" />

      {/* Wings / Abstract creatures */}
      <path d="M 120 380 C 80 380, 60 420, 60 420 M 280 380 C 320 380, 340 420, 340 420" 
            stroke="var(--color-gold)" strokeWidth="2" strokeOpacity="0.3" fill="none" />
            
      {/* Dots / Ornaments */}
      <circle cx="200" cy="100" r="15" stroke="var(--color-gold)" strokeWidth="2" strokeOpacity="0.4" fill="none" />
      <circle cx="200" cy="100" r="5" fill="var(--color-gold)" fillOpacity="0.4" />
      <circle cx="100" cy="200" r="8" fill="var(--color-gold)" fillOpacity="0.3" />
      <circle cx="300" cy="200" r="8" fill="var(--color-gold)" fillOpacity="0.3" />
    </svg>
  );
}

function HeroMedallion() {
  const TICKS = Array.from({ length: 36 }, (_, i) => {
    const a   = ((i * 360) / 36 - 90) * (Math.PI / 180);
    const big = i % 9 === 0;
    const med = i % 3 === 0 && !big;
    const r1  = big ? 226 : med ? 230 : 233;
    return { x1: +(350 + r1 * Math.cos(a)).toFixed(2), y1: +(250 + r1 * Math.sin(a)).toFixed(2),
             x2: +(350 + 238 * Math.cos(a)).toFixed(2), y2: +(250 + 238 * Math.sin(a)).toFixed(2),
             sw: big ? "1.4" : med ? "0.8" : "0.5",
             op: big ? 0.38 : med ? 0.25 : 0.15 };
  });
  return (
    <svg viewBox="0 0 700 500" className="w-full h-full" fill="none" style={{ overflow: "visible" }} suppressHydrationWarning={true}>
      <ellipse cx="350" cy="250" rx="320" ry="226" stroke="var(--color-gold)" strokeWidth="0.6" strokeOpacity="0.20" strokeDasharray="6 8" />
      <ellipse cx="350" cy="250" rx="300" ry="212" stroke="var(--color-gold)" strokeWidth="0.8" strokeOpacity="0.22" />
      <ellipse cx="350" cy="250" rx="240" ry="170" stroke="var(--color-gold)" strokeWidth="0.5" strokeOpacity="0.14" />
      {TICKS.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="var(--color-gold)" strokeWidth={t.sw} strokeOpacity={t.op} />
      ))}
      <path d="M342,12 L350,-2 L358,12 L350,17Z"  fill="var(--color-gold)" fillOpacity="0.42" />
      <path d="M342,488 L350,502 L358,488 L350,483Z" fill="var(--color-gold)" fillOpacity="0.38" />
      <path d="M32,242 L18,250 L32,258 L38,250Z"  fill="var(--color-gold)" fillOpacity="0.38" />
      <path d="M668,242 L682,250 L668,258 L662,250Z" fill="var(--color-gold)" fillOpacity="0.38" />
      {[45, 135, 225, 315].map((deg, i) => {
        const r = ((deg - 90) * Math.PI) / 180;
        const x = +(350 + 300 * Math.cos(r)).toFixed(2);
        const y = +(250 + 212 * Math.sin(r)).toFixed(2);
        return <circle key={i} cx={x} cy={y} r="3.5" fill="var(--color-gold)" fillOpacity="0.28" />;
      })}
      <path d="M60,200 Q200,185 350,192 Q500,199 640,185" stroke="var(--color-gold)" strokeWidth="0.7" strokeOpacity="0.16" fill="none" strokeDasharray="4 4" />
      <path d="M42,250 Q200,240 350,250 Q500,260 658,250" stroke="var(--color-gold)" strokeWidth="0.9" strokeOpacity="0.18" fill="none" strokeDasharray="4 4" />
      <path d="M60,300 Q200,315 350,308 Q500,301 640,315" stroke="var(--color-gold)" strokeWidth="0.7" strokeOpacity="0.16" fill="none" strokeDasharray="4 4" />
      <line x1="350" y1="20" x2="350" y2="480" stroke="var(--color-gold)" strokeWidth="0.7" strokeOpacity="0.12" strokeDasharray="3 5" />
      <path d="M80,240 C130,222 190,228 230,238 C265,246 290,234 320,240 C310,260 285,268 260,262 C220,254 155,264 80,258 Z" fill="var(--color-navy)" fillOpacity="0.10" stroke="var(--color-gold)" strokeWidth="0.6" strokeOpacity="0.18" />
      <path d="M330,238 C355,230 385,228 410,234 C430,240 445,232 460,236 C450,255 430,262 410,256 C385,248 355,252 330,255 Z" fill="var(--color-navy)" fillOpacity="0.10" stroke="var(--color-gold)" strokeWidth="0.6" strokeOpacity="0.18" />
      <path d="M460,235 C490,225 535,222 570,232 C590,238 610,228 630,232 C622,252 600,260 580,254 C550,244 510,248 460,252 Z" fill="var(--color-navy)" fillOpacity="0.10" stroke="var(--color-gold)" strokeWidth="0.6" strokeOpacity="0.18" />
      <path d="M330,258 C345,260 370,280 385,300 C395,315 385,330 370,332 C350,334 330,318 322,295 C316,275 320,262 330,258 Z" fill="var(--color-navy)" fillOpacity="0.10" stroke="var(--color-gold)" strokeWidth="0.6" strokeOpacity="0.16" />
      <path d="M420,262 C432,258 448,268 452,285 C455,298 444,308 434,305 C422,300 412,285 420,262 Z" fill="var(--color-navy)" fillOpacity="0.09" stroke="var(--color-gold)" strokeWidth="0.5" strokeOpacity="0.15" />
      <circle cx="350" cy="250" r="52" stroke="var(--color-gold)" strokeWidth="0.7" strokeOpacity="0.18" />
      <circle cx="350" cy="250" r="30" stroke="var(--color-gold)" strokeWidth="0.5" strokeOpacity="0.14" />
      <path d="M350,198 L354,240 L350,248 L346,240 Z" fill="var(--color-gold)" fillOpacity="0.22" />
      <path d="M350,302 L354,260 L350,252 L346,260 Z" fill="var(--color-gold)" fillOpacity="0.22" />
      <path d="M298,250 L340,246 L348,250 L340,254 Z" fill="var(--color-gold)" fillOpacity="0.22" />
      <path d="M402,250 L360,246 L352,250 L360,254 Z" fill="var(--color-gold)" fillOpacity="0.22" />
      <circle cx="350" cy="250" r="6" stroke="var(--color-gold)" strokeWidth="1" strokeOpacity="0.30" />
      <circle cx="350" cy="250" r="2.5" fill="var(--color-gold)" fillOpacity="0.35" />
      <g transform="translate(200, 350) scale(0.7)" opacity="0.22">
        <path d="M10,55 C40,52 80,48 110,58 C118,61 126,59 132,52 L136,36 C100,32 25,38 8,46 Z" fill="var(--color-gold)" />
        <line x1="40" y1="46" x2="40" y2="12" stroke="var(--color-gold)" strokeWidth="2.5" />
        <line x1="80" y1="40" x2="80" y2="8"  stroke="var(--color-gold)" strokeWidth="2" />
        <path d="M40,15 C22,26 22,42 40,46 Z" fill="var(--color-gold-light)" />
        <path d="M80,11 C64,20 64,36 80,38 Z" fill="var(--color-gold-light)" />
      </g>
    </svg>
  );
}

function KerisCrest() {
  return (
    <svg viewBox="0 0 160 72" className="w-32 h-14 md:w-44 md:h-18" fill="none">
      <line x1="0" y1="65" x2="160" y2="65" stroke="url(#goldGrad)" strokeWidth="0.8" strokeOpacity="0.45" />
      
      {/* Handle (Hulu) */}
      <path d="M78 52 C 70 55, 75 60, 80 62 C 85 60, 90 55, 82 52 Z" fill="url(#goldGrad)" fillOpacity="0.45" />
      <path d="M79 50 L81 50 L82 55 L78 55 Z" fill="url(#goldGrad)" fillOpacity="0.55" />
      
      {/* Guard (Ganja) */}
      <path d="M72 48 Q 80 46, 88 48 Q 86 51, 80 50 Q 74 51, 72 48 Z" fill="url(#goldGrad)" fillOpacity="0.6" />
      
      {/* Blade (Luk) */}
      <path d="M78 48 C 76 42, 84 38, 80 32 C 76 26, 84 22, 80 16 C 78 12, 80 6, 80 0 C 80 6, 82 12, 80 16 C 76 22, 84 26, 80 32 C 76 38, 84 42, 82 48 Z" fill="url(#goldGrad)" fillOpacity="0.55" stroke="var(--color-cream)" strokeWidth="0.2" strokeOpacity="0.5" />
      
      {/* Center Line of Blade */}
      <path d="M80 0 C 80 6, 81 12, 80 16 C 77 22, 83 26, 80 32 C 77 38, 83 42, 80 48" stroke="var(--color-navy)" strokeWidth="0.3" strokeOpacity="0.4" fill="none" />
      
      {/* Side details */}
      <path d="M40 65 L44 59 L48 65 Z" fill="url(#goldGrad)" fillOpacity="0.3" />
      <path d="M112 65 L116 59 L120 65 Z" fill="url(#goldGrad)" fillOpacity="0.3" />
      <circle cx="80" cy="65" r="2.5" fill="url(#goldGrad)" fillOpacity="0.7" />
    </svg>
  );
}

function SidePillar({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 48 280" className="w-8 h-52 md:w-10 md:h-64" fill="none" style={{ transform: flip ? "scaleX(-1)" : undefined }}>
      <line x1="24" y1="0" x2="24" y2="280" stroke="var(--color-gold)" strokeWidth="1" strokeOpacity="0.35" />
      <path d="M10,8 L24,2 L38,8 L38,18 L24,14 L10,18 Z" fill="var(--color-gold)" fillOpacity="0.40" />
      <path d="M10,272 L24,278 L38,272 L38,262 L24,266 L10,262 Z" fill="var(--color-gold)" fillOpacity="0.40" />
      <path d="M16,136 L24,122 L32,136 L24,150 Z" fill="var(--color-gold)" fillOpacity="0.38" />
      <path d="M18,72  L24,62  L30,72  L24,80 Z"  fill="var(--color-gold)" fillOpacity="0.28" />
      <path d="M18,200 L24,190 L30,200 L24,208 Z" fill="var(--color-gold)" fillOpacity="0.28" />
      {[40, 100, 170, 238].map((y, i) => (
        <line key={i} x1="18" y1={y} x2="30" y2={y} stroke="var(--color-gold)" strokeWidth="0.8" strokeOpacity="0.28" />
      ))}
      <path d="M24,90 Q12,95 8,105"   stroke="var(--color-gold)" strokeWidth="0.7" fill="none" strokeOpacity="0.25" />
      <path d="M24,165 Q12,170 8,180" stroke="var(--color-gold)" strokeWidth="0.7" fill="none" strokeOpacity="0.25" />
    </svg>
  );
}

function BatikParangOrnament() {
  const parangs = Array.from({ length: 12 }, (_, i) => i * 16);
  return (
    <svg viewBox="0 0 200 32" className="w-40 h-7 md:w-56 md:h-9" fill="none">
      <line x1="0" y1="4" x2="200" y2="4" stroke="url(#goldGrad)" strokeWidth="0.8" strokeOpacity="0.40" />
      <line x1="0" y1="28" x2="200" y2="28" stroke="url(#goldGrad)" strokeWidth="0.5" strokeOpacity="0.2" />
      <g opacity="0.4">
        {parangs.map((x, i) => (
          <path key={i} d={`M${x+4} 24 C${x+8} 18, ${x+12} 22, ${x+10} 14 C${x+8} 6, ${x+14} 10, ${x+16} 6`} stroke="url(#goldGrad)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        ))}
      </g>
      <circle cx="100" cy="16" r="3" fill="url(#goldGrad)" fillOpacity="0.6" />
      <path d="M96 16 L100 12 L104 16 L100 20 Z" fill="var(--color-cream)" fillOpacity="0.4" />
    </svg>
  );
}

function UkiranCorner({ flipX = false, flipY = false }: { flipX?: boolean; flipY?: boolean }) {
  return (
    <svg viewBox="0 0 56 56" className="w-10 h-10 md:w-14 md:h-14" fill="none" style={{ transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})` }}>
      <path d="M4 4 L4 32 M4 4 L32 4" stroke="url(#goldGrad)" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.65" />
      {/* Jepara floral motif */}
      <path d="M4 4 C 15 15, 25 5, 35 15 C 30 25, 20 15, 15 25 C 25 30, 15 40, 4 4" fill="url(#goldGrad)" fillOpacity="0.3" stroke="url(#goldGrad)" strokeWidth="0.8" />
      <path d="M12 12 C 16 20, 20 16, 25 25 C 15 25, 10 20, 4 15" fill="var(--color-cream)" fillOpacity="0.4" />
      <circle cx="4" cy="4" r="3" fill="url(#goldGrad)" fillOpacity="0.8" />
      <circle cx="4" cy="4" r="1.5" fill="var(--color-navy)" fillOpacity="0.5" />
      
      {/* Swirls */}
      <path d="M4 36 C 8 44, 16 36, 20 40" stroke="url(#goldGrad)" strokeWidth="1.2" fill="none" strokeOpacity="0.4" strokeLinecap="round" />
      <path d="M36 4 C 44 8, 36 16, 40 20" stroke="url(#goldGrad)" strokeWidth="1.2" fill="none" strokeOpacity="0.4" strokeLinecap="round" />
      
      {/* Small dots */}
      <circle cx="28" cy="12" r="1.5" fill="url(#goldGrad)" fillOpacity="0.5" />
      <circle cx="12" cy="28" r="1.5" fill="url(#goldGrad)" fillOpacity="0.5" />
    </svg>
  );
}

function DiceIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" style={{ color: "var(--color-gold-light)" }}>
      <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="7.5"  cy="7.5"  r="1.5" fill="currentColor" />
      <circle cx="16.5" cy="7.5"  r="1.5" fill="currentColor" />
      <circle cx="7.5"  cy="16.5" r="1.5" fill="currentColor" />
      <circle cx="16.5" cy="16.5" r="1.5" fill="currentColor" />
      <circle cx="12"   cy="12"   r="1.5" fill="currentColor" />
    </svg>
  );
}

const BATIK_PATTERN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M0 0 L30 30 L60 0 M30 30 L0 60 L60 60 M0 30 L60 30 M30 0 L30 60' fill='none' stroke='%238b4513' stroke-width='0.8' stroke-opacity='0.07'/%3E%3Ccircle cx='30' cy='30' r='12' fill='none' stroke='%238b4513' stroke-width='0.8' stroke-opacity='0.07'/%3E%3Ccircle cx='0' cy='0' r='12' fill='none' stroke='%238b4513' stroke-width='0.8' stroke-opacity='0.07'/%3E%3Ccircle cx='60' cy='0' r='12' fill='none' stroke='%238b4513' stroke-width='0.8' stroke-opacity='0.07'/%3E%3Ccircle cx='0' cy='60' r='12' fill='none' stroke='%238b4513' stroke-width='0.8' stroke-opacity='0.07'/%3E%3Ccircle cx='60' cy='60' r='12' fill='none' stroke='%238b4513' stroke-width='0.8' stroke-opacity='0.07'/%3E%3C/svg%3E\")";

function eased(delay: number, duration = 0.7) {
  return { delay, duration, ease: "easeOut" as const };
}

export default function PrototypePage() {
  const prefersReducedMotion = useReducedMotion();
  const [hoveringCTA, setHoveringCTA] = useState(false);

  // --- Parallax Setup ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion) return;
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const springConfig = { damping: 50, stiffness: 50, mass: 1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const bgX = useTransform(springX, [-1, 1], [-10, 10]);
  const bgY = useTransform(springY, [-1, 1], [-10, 10]);
  const midX = useTransform(springX, [-1, 1], [-25, 25]);
  const midY = useTransform(springY, [-1, 1], [-25, 25]);
  const fgX = useTransform(springX, [-1, 1], [-45, 45]);
  const fgY = useTransform(springY, [-1, 1], [-45, 45]);

  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] w-full relative overflow-hidden select-none"
      style={{ backgroundColor: "var(--color-cream)", fontFamily: "var(--font-body)" }}
      onMouseMove={handleMouseMove}
    >

      {/* ── PROTOTYPE BADGE ───────────────────────────────────── */}
      <div className="absolute top-3 left-3 z-50 flex items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded"
          style={{ backgroundColor: "rgba(185,28,28,0.82)", color: "#fff" }}>
          ⚠ PROTOTYPE
        </span>
        <a href="/" className="text-[10px] font-semibold underline"
          style={{ color: "var(--color-navy)", opacity: 0.55 }}>
          ← Kembali ke Game
        </a>
      </div>

      {/* Background Layers */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        background: "radial-gradient(ellipse 85% 75% at 50% 44%, #fffbec 0%, #f4ebd0 40%, #dfc99a 100%)",
      }} />
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true">
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-gold-light)" />
            <stop offset="50%" stopColor="var(--color-gold)" />
            <stop offset="100%" stopColor="var(--color-gold-dark)" />
          </linearGradient>
          <linearGradient id="silGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-navy-light)" />
            <stop offset="50%" stopColor="var(--color-navy)" />
            <stop offset="100%" stopColor="var(--color-navy-dark)" />
          </linearGradient>
          <filter id="v3-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.70" numOctaves="4" stitchTiles="stitch" result="n" />
            <feColorMatrix type="saturate" values="0" in="n" result="g" />
            <feBlend in="SourceGraphic" in2="g" mode="overlay" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#v3-noise)" opacity="0.05" />
      </svg>
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        backgroundImage: BATIK_PATTERN, backgroundSize: "220px 220px", opacity: 0.12,
      }} />
      
      {/* Dynamic Light Layers (Cahaya Bergerak) */}
      <motion.div className="absolute inset-0 pointer-events-none z-0" style={{
        background: "linear-gradient(148deg, rgba(255,248,210,0.24) 0%, rgba(201,168,76,0.07) 30%, transparent 55%)",
        willChange: "opacity"
      }} animate={prefersReducedMotion ? {} : { opacity: [0.7, 1, 0.7] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        background: "linear-gradient(218deg, rgba(255,248,210,0.18) 0%, rgba(201,168,76,0.05) 28%, transparent 50%)",
      }} />
      <motion.div className="absolute inset-0 pointer-events-none z-0" style={{
        background: "radial-gradient(ellipse 22% 55% at 50% 0%, rgba(255,250,220,0.22) 0%, transparent 100%)",
      }} animate={prefersReducedMotion ? {} : { opacity: [0.6, 0.9, 0.6] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
      <motion.div className="absolute inset-0 pointer-events-none z-0" style={{
        background: "radial-gradient(ellipse 55% 40% at 50% 42%, rgba(201,168,76,0.16) 0%, transparent 70%)",
        willChange: "transform, opacity"
      }} animate={prefersReducedMotion ? {} : { opacity: [0.6, 1, 0.6], scale: [1, 1.05, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        background: "radial-gradient(ellipse at center, transparent 15%, rgba(10,26,46,0.65) 100%)",
        boxShadow: "inset 0 0 150px rgba(0,0,0,0.6)"
      }} />

      {/* Cinematic Fog & Moving Light Rays */}
      <motion.div className="absolute inset-0 pointer-events-none z-[1]" style={{ x: bgX, y: bgY, willChange: "transform" }}>
        <motion.div className="absolute inset-[-50%] opacity-30" style={{
          background: "radial-gradient(ellipse at 30% 60%, rgba(255,248,220,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(201,168,76,0.08) 0%, transparent 60%)",
          filter: "blur(60px)",
          willChange: "transform"
        }} animate={prefersReducedMotion ? {} : { x: ["0%", "-10%", "0%"], y: ["0%", "5%", "0%"] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} />
      </motion.div>

      {/* Background Ambient Particles (Debu Bergerak) */}
      <motion.div className="absolute inset-0 pointer-events-none z-[1]" style={{ x: midX, y: midY, willChange: "transform" }}>
        {PARTICLES.map((p, i) => (
          <motion.div key={i}
            className="absolute rounded-sm"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size,
                     backgroundColor: "var(--color-gold)", opacity: p.op, filter: p.blur ? `blur(${p.blur}px)` : undefined,
                     willChange: "transform, opacity" }}
            animate={prefersReducedMotion ? {} : { x: [0, p.drift, 0], y: [0, -30, 0], rotate: [0, p.rot, 0], opacity: [p.op, p.op * 1.6, p.op] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </motion.div>

      {/* Distant Silhouettes (Slow Floating) */}
      <motion.div className="absolute bottom-16 left-0 w-[280px] md:w-[360px] h-[240px] md:h-[300px] pointer-events-none z-[1]" style={{ opacity: 0.10, x: bgX, y: bgY }}>
        <motion.div className="w-full h-full" animate={prefersReducedMotion ? {} : { y: [0, -6, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}>
          <Borobudur />
        </motion.div>
      </motion.div>

      <motion.div className="absolute bottom-16 right-0 w-[260px] md:w-[340px] h-[240px] md:h-[300px] pointer-events-none z-[1]" style={{ opacity: 0.09, x: bgX, y: bgY }}>
        <motion.div className="w-full h-full" animate={prefersReducedMotion ? {} : { y: [0, -8, 0] }} transition={{ duration: 21, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
          <Prambanan />
        </motion.div>
      </motion.div>

      {/* Floating Surya Majapahit */}
      <motion.div className="absolute right-4 top-4 md:right-8 md:top-8 w-24 h-24 md:w-36 md:h-36 pointer-events-none z-[1]" style={{ opacity: 0.18, x: bgX, y: bgY }}>
        <motion.div className="w-full h-full" animate={prefersReducedMotion ? {} : { rotate: 360 }} transition={{ duration: 240, repeat: Infinity, ease: "linear" }}>
          <motion.div className="w-full h-full" animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}>
            <SuryaMajapahit />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Hero Background Illustration (Floating) */}
      <motion.div
        className="absolute z-[5] pointer-events-none"
        style={{
          width: "min(96vw, 840px)", height: "min(60vw, 560px)",
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          opacity: 0.28, filter: "drop-shadow(0 15px 40px rgba(15,36,64,0.4)) drop-shadow(0 0 80px rgba(201,168,76,0.25))",
          x: midX, y: midY, willChange: "transform"
        }}
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 0.28, scale: 1 }} transition={{ delay: 0.1, duration: 1.2, ease: "easeOut" }}
      >
        <motion.div className="w-full h-full" style={{ willChange: "transform" }} animate={prefersReducedMotion ? {} : { y: [0, -12, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
          <HeroMedallion />
        </motion.div>
      </motion.div>

      {/* Top Decorative Rule */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10 opacity-55">
        <div className="h-px w-20 md:w-40" style={{ background: "linear-gradient(to right, transparent, var(--color-gold))" }} />
        <motion.div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: "var(--color-gold)" }} animate={prefersReducedMotion ? {} : { opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }} />
        <div className="h-px w-20 md:w-40" style={{ background: "linear-gradient(to left, transparent, var(--color-gold))" }} />
      </div>

      {/* Main Content */}
      <div className="z-10 text-center px-4 flex flex-col items-center justify-center pb-24 md:pb-32 pt-10 md:pt-4 w-full scale-90 md:scale-95 lg:scale-100 origin-center h-full">

        {/* Genre badge */}
        <motion.div
          className="flex items-center gap-2 mb-3 md:mb-4 relative"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={eased(0.10)}>
          <div className="absolute inset-0 rounded-full" style={{ boxShadow: "0 0 20px rgba(201,168,76,0.15)" }} />
          <div className="h-px w-6 md:w-10" style={{ background: "linear-gradient(to right, transparent, var(--color-gold))", opacity: 0.8 }} />
          <p className="text-[9px] md:text-[11px] font-black uppercase px-4 py-1.5 rounded-full relative"
            style={{
              color: "var(--color-gold-dark)", fontFamily: "var(--font-display)",
              border: "1px solid rgba(201,168,76,0.4)", background: "linear-gradient(180deg, rgba(201,168,76,0.03) 0%, rgba(201,168,76,0.12) 100%)", letterSpacing: "0.28em",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 4px rgba(15,36,64,0.05)",
              textShadow: "0 1px 1px rgba(255,255,255,0.3)"
            }}>
            Game Edukasi Sejarah Indonesia
          </p>
          <div className="h-px w-6 md:w-10" style={{ background: "linear-gradient(to left, transparent, var(--color-gold))", opacity: 0.8 }} />
        </motion.div>

        {/* Top Crest */}
        <motion.div className="flex justify-center mb-[-1px] z-10"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={eased(0.2)}>
          <KerisCrest />
        </motion.div>

        {/* Hero Frame (Logo Breathing Effect) */}
        <motion.div
          className="relative flex items-center gap-0"
          initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={eased(0.28, 0.80)}>
          
          <motion.div className="flex items-center gap-0" animate={{ scale: [1, 1.015, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
            {/* Left Side Pillar */}
            <div className="hidden md:flex items-center pr-2 opacity-75">
              <SidePillar />
            </div>

            {/* ── NEW HERO CONTAINER (Multiple Frames & Engraved Depth) ── */}
            <div className="relative px-8 md:px-24 py-6 md:py-10 flex flex-col items-center justify-center overflow-hidden"
                 style={{
                   // Multiple outer shadows for extreme depth
                   boxShadow: "0 40px 100px rgba(15,36,64,0.35), 0 10px 40px rgba(15,36,64,0.25), 0 2px 10px rgba(15,36,64,0.15)",
                   background: "linear-gradient(135deg, rgba(244, 235, 208, 0.9) 0%, rgba(223, 201, 154, 0.95) 100%)",
                   borderRadius: "4px"
                 }}>
                 
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 z-0 opacity-[0.4]" style={{ filter: "url(#v3-noise)", mixBlendMode: "multiply" }} />
              
              {/* Layer 1: Outer Engraved Border */}
              <div className="absolute inset-[8px] md:inset-[12px] z-0 pointer-events-none rounded-sm" style={{
                border: "1px solid rgba(201,168,76, 0.3)",
                boxShadow: "inset 0 0 20px rgba(139, 69, 19, 0.1)",
              }} />
              
              {/* Layer 2: Middle Engraved Border (Thick) */}
              <div className="absolute inset-[14px] md:inset-[20px] z-0 pointer-events-none rounded-sm" style={{
                border: "2px solid rgba(201,168,76, 0.6)",
                boxShadow: "0 0 10px rgba(255,248,220,0.4), inset 0 2px 15px rgba(15,36,64,0.1)",
              }} />
              
              {/* Layer 3: Inner Engraved Border with shadow */}
              <div className="absolute inset-[20px] md:inset-[30px] z-0 pointer-events-none rounded-sm" style={{
                border: "1px solid rgba(201,168,76, 0.4)",
                boxShadow: "inset 0 10px 30px rgba(15,36,64, 0.08)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)"
              }} />

              {/* Glowing breathing center */}
              <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{
                background: "radial-gradient(circle at 50% 50%, rgba(255,248,220,0.5) 0%, transparent 60%)"
              }} animate={prefersReducedMotion ? {} : { opacity: [0.3, 0.75, 0.3], scale: [0.95, 1.05, 0.95] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />

              {/* Main Background Illustration (Gunungan Wayang) */}
              <motion.div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
                animate={prefersReducedMotion ? {} : { y: [0, -6, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}>
                <div className="w-[120%] h-[120%] opacity-20" style={{ mixBlendMode: "multiply" }}>
                   <GununganWayang />
                </div>
              </motion.div>

              {/* Corner ornaments on Layer 2 */}
              <div className="absolute top-[14px] left-[14px] md:top-[20px] md:left-[20px] z-10"><UkiranCorner /></div>
              <div className="absolute top-[14px] right-[14px] md:top-[20px] md:right-[20px] z-10"><UkiranCorner flipX /></div>
              <div className="absolute bottom-[14px] left-[14px] md:bottom-[20px] md:left-[20px] z-10"><UkiranCorner flipY /></div>
              <div className="absolute bottom-[14px] right-[14px] md:bottom-[20px] md:right-[20px] z-10"><UkiranCorner flipX flipY /></div>

              {/* Decorative Gold Connecting Lines (Compass Lines) */}
              <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-[var(--color-gold)] opacity-30 z-0" />
              <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[var(--color-gold)] opacity-30 z-0" />

              {/* Aksara Nusantara Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden mix-blend-overlay">
                <span style={{ fontSize: "16rem", fontFamily: "serif", color: "var(--color-navy-dark)", whiteSpace: "nowrap", letterSpacing: "0.2em", transform: "translateY(-10px)" }}>
                  ꦈꦭꦂꦠꦁꦒ
                </span>
              </div>

              {/* Main title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-none relative z-10 tracking-tight"
                style={{
                  fontFamily: "var(--font-display)", 
                  color: "var(--color-navy-dark)",
                  textShadow: `
                    0px 1px 1px rgba(255,255,255,0.8), 
                    0px -1px 1px rgba(15,36,64,0.6),  
                    1px 2px 0px var(--color-gold-dark), 
                    1px 3px 0px var(--color-gold),      
                    2px 5px 0px rgba(139, 69, 19, 0.7), 
                    2px 8px 15px rgba(15,36,64,0.6),    
                    0px 15px 35px rgba(15,36,64,0.4)    
                  `,
                  WebkitTextStroke: "1px rgba(201,168,76,0.5)"
                }}>
                ULAR TANGGA
              </h1>

              {/* Subtitle shimmer */}
              <div className="relative z-10 mt-3 md:mt-4 flex items-center justify-center gap-2 md:gap-4">
                <div className="h-px w-10 md:w-20 shrink-0" style={{ background: "linear-gradient(to right, transparent, var(--color-gold-dark))" }} />
                <h2 className="text-base md:text-2xl font-bold tracking-[0.25em] whitespace-nowrap drop-shadow-md"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: "linear-gradient(135deg, var(--color-gold-dark), var(--color-gold-light) 50%, var(--color-gold-dark))",
                    backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    animation: "shimmer 3s linear infinite",
                  }}>
                  Sejarah Nusantara
                </h2>
                <div className="h-px w-10 md:w-20 shrink-0" style={{ background: "linear-gradient(to left, transparent, var(--color-gold-dark))" }} />
              </div>
            </div>

            {/* Right Side Pillar */}
            <div className="hidden md:flex items-center pl-2 opacity-75">
              <SidePillar flip />
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Ornament */}
        <motion.div className="flex justify-center mt-[-2px] mb-2"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={eased(0.36)}>
          <BatikParangOrnament />
        </motion.div>

        {/* Divider */}
        <motion.div className="flex items-center gap-4 my-1 md:my-2"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={eased(0.44)}>
          <div className="h-[2px] w-12 md:w-24" style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.6))" }} />
          <motion.div style={{ color: "var(--color-gold)", transform: "rotate(45deg)", width: "6px", height: "6px", border: "1px solid var(--color-gold)", background: "var(--color-cream)" }}
            animate={prefersReducedMotion ? {} : { opacity: [0.5, 1, 0.5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
          <div className="h-[2px] w-12 md:w-24" style={{ background: "linear-gradient(to left, transparent, rgba(201,168,76,0.6))" }} />
        </motion.div>

        {/* Tagline / Description Card */}
        <motion.div className="mb-4 md:mb-6 max-w-[320px] md:max-w-md relative group"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={eased(0.54)}>
          <div className="absolute inset-0 rounded-md pointer-events-none" style={{ 
            background: "linear-gradient(135deg, rgba(15,36,64,0.9) 0%, rgba(10,26,46,0.95) 100%)", 
            border: "1px solid rgba(201,168,76,0.5)", 
            boxShadow: "0 10px 25px rgba(10,26,46,0.5), inset 0 2px 10px rgba(0,0,0,0.5)",
            borderRadius: "4px"
          }} />
          {/* Inner border detail */}
          <div className="absolute inset-[3px] rounded-sm pointer-events-none" style={{ border: "1px solid rgba(201,168,76,0.15)" }} />
          
          <p className="text-xs md:text-sm leading-relaxed relative px-6 py-3.5 text-center transition-colors duration-300"
            style={{ color: "var(--color-cream)", fontWeight: 400, textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>
            Jelajahi perjalanan bangsa, taklukkan setiap petak, dan buktikan pengetahuanmu tentang sejarah Indonesia.
          </p>
        </motion.div>

        {/* CTA Button (Hover Premium) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={eased(0.66)}>
          <motion.button
            className="relative flex items-center justify-center gap-2 md:gap-3 py-3 md:py-4 px-6 md:px-10 rounded-sm overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-gold)]"
            onHoverStart={() => setHoveringCTA(true)}
            onHoverEnd={() => setHoveringCTA(false)}
            whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 15 } }}
            whileTap={{ scale: 0.96, transition: { type: "spring", stiffness: 500, damping: 25 } }}
            style={{
              background: "linear-gradient(180deg, rgba(15,36,64,0.95) 0%, rgba(10,26,46,1) 100%)",
              border: "1px solid rgba(201,168,76,0.6)",
              boxShadow: "0 8px 30px rgba(10,26,46,0.6), inset 0 2px 4px rgba(255,255,255,0.15)",
              color: "var(--color-cream)",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(12px, 3vw, 16px)",
              letterSpacing: "0.15em",
              fontWeight: 800,
              textTransform: "uppercase"
            }}>
            {/* Inner Gold Border (Engraved effect) */}
            <div className="absolute inset-[3px] rounded-sm pointer-events-none" style={{ border: "1px solid rgba(201,168,76,0.3)", boxShadow: "inset 0 0 10px rgba(0,0,0,0.4)" }} />
            
            <motion.span className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(105deg, transparent 20%, rgba(201,168,76,0.4) 50%, transparent 80%)" }}
              animate={{ x: hoveringCTA ? ["150%", "-150%"] : "150%" }}
              transition={{ duration: 0.7, ease: "easeInOut", repeat: hoveringCTA ? Infinity : 0, repeatDelay: 1 }} />
            <motion.span className="absolute inset-0 rounded pointer-events-none"
              animate={{
                boxShadow: hoveringCTA
                  ? "0 12px 40px rgba(201,168,76,0.25), inset 0 0 20px rgba(201,168,76,0.3)"
                  : "0 0 0px rgba(201,168,76,0)",
              }}
              transition={{ duration: 0.3 }} />
            <DiceIcon />
            <motion.span className="relative z-10" animate={{ textShadow: hoveringCTA ? "0 0 12px rgba(201,168,76,0.8)" : "0 1px 2px rgba(0,0,0,0.5)" }}>
              Mulai Petualangan
            </motion.span>
          </motion.button>

          <div className="relative h-6 mt-2">
            <AnimatePresence>
              {hoveringCTA && (
                <motion.p className="absolute inset-x-0 text-[10px] text-center tracking-[0.18em] uppercase"
                  style={{ color: "var(--color-gold-dark)", fontFamily: "var(--font-display)" }}
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 0.8, y: 0 }}
                  exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
                  ← Petualangan Sejarah Dimulai! →
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Foreground Particles */}
      <motion.div className="absolute inset-0 pointer-events-none z-[20]" style={{ x: fgX, y: fgY, willChange: "transform" }}>
        {FG_PARTICLES.map((p, i) => (
          <motion.div key={i}
            className="absolute rounded-sm"
            style={{
              left: p.left, top: p.top, width: p.size, height: p.size,
              backgroundColor: "var(--color-gold)", opacity: p.op,
              boxShadow: `0 0 ${p.size * 3}px rgba(201,168,76,0.5)`,
              filter: p.blur ? `blur(${p.blur}px)` : undefined,
              willChange: "transform, opacity"
            }}
            animate={prefersReducedMotion ? {} : { x: [0, p.drift, 0], y: [0, -35, 0], rotate: [0, p.rot, 0], opacity: [p.op, p.op * 1.8, p.op] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </motion.div>

      {/* Feature Cards */}
      <motion.div className="absolute bottom-2 md:bottom-4 left-0 right-0 z-10 px-4"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.6, ease: "easeOut" }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 max-w-3xl mx-auto">
          {FEATURES.map((f, i) => (
            <motion.div key={i}
              className="relative flex flex-col items-center py-1.5 px-1 md:py-2 md:px-1.5 rounded-sm cursor-default overflow-hidden group h-full"
              style={{
                background: "linear-gradient(180deg, rgba(15,36,64,0.85) 0%, rgba(10,26,46,0.9) 100%)",
                border: "1px solid rgba(201,168,76,0.4)",
                borderTop: "1px solid rgba(201,168,76,0.6)",
                boxShadow: "0 4px 12px rgba(10,26,46,0.4), inset 0 2px 8px rgba(0,0,0,0.4)",
              }}
              whileHover={{ 
                y: -4, 
                background: "linear-gradient(180deg, rgba(15,36,64,0.95) 0%, rgba(10,26,46,1) 100%)",
                boxShadow: "0 12px 28px rgba(10,26,46,0.6), 0 0 16px rgba(201,168,76,0.25), inset 0 2px 8px rgba(0,0,0,0.5)",
              }}
              transition={{ delay: 0.9 + i * 0.08, duration: 0.45, y: { type: "spring", stiffness: 400, damping: 20 } }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              
              {/* Decorative Corner accents inside card (Batik-like dots) */}
              <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-[rgba(201,168,76,0.4)] group-hover:bg-[rgba(201,168,76,0.8)] transition-colors duration-300" />
              <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-[rgba(201,168,76,0.4)] group-hover:bg-[rgba(201,168,76,0.8)] transition-colors duration-300" />
              <div className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-[rgba(201,168,76,0.4)] group-hover:bg-[rgba(201,168,76,0.8)] transition-colors duration-300" />
              <div className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-[rgba(201,168,76,0.4)] group-hover:bg-[rgba(201,168,76,0.8)] transition-colors duration-300" />

              {/* Inner detail border */}
              <div className="absolute inset-[2px] rounded-sm pointer-events-none border border-[rgba(201,168,76,0.1)] group-hover:border-[rgba(201,168,76,0.2)] transition-colors duration-300" />

              {/* Icon Container */}
              <motion.div className="mb-1 md:mb-1.5 p-1 md:p-1.5 rounded-full border border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.05)] group-hover:bg-[rgba(201,168,76,0.15)] group-hover:border-[rgba(201,168,76,0.4)] transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <span style={{ color: "var(--color-gold)", transform: "scale(0.85)" }} className="inline-block opacity-90 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(201,168,76,0.6)] transition-all duration-300">
                  {f.icon}
                </span>
              </motion.div>
              
              <span className="text-[8px] md:text-[10px] font-black tracking-widest mb-0.5 transition-colors duration-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                style={{ color: "var(--color-cream)", fontFamily: "var(--font-display)" }}>
                {f.title}
              </span>
              
              <span className="text-[7px] md:text-[8px] text-center leading-tight transition-all duration-300"
                style={{ color: "rgba(255,255,255,0.7)" }}>
                {f.sub}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
