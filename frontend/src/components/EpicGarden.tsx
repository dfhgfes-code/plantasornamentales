'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/* ─── Pétalo flotante ─────────────────────────────────────── */
const FloatingPetal = ({ delay, x, size, color, duration }: {
  delay: number; x: number; size: number; color: string; duration: number;
}) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: `${x}%`, bottom: '-40px', width: size, height: size }}
    initial={{ y: 0, opacity: 0, rotate: 0, x: 0 }}
    animate={{
      y: [0, -(typeof window !== 'undefined' ? window.innerHeight * 1.2 : 900)],
      opacity: [0, 0.7, 0.5, 0],
      rotate: [0, 180, 360],
      x: [0, 30, -20, 40, -10],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 8 + 4,
      ease: 'easeInOut',
    }}
  >
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="20" rx="10" ry="18" fill={color} opacity="0.85" transform={`rotate(${Math.random() * 360} 20 20)`} />
    </svg>
  </motion.div>
);

/* ─── Tallo con hoja ──────────────────────────────────────── */
const Stem = ({ delay }: { delay: number }) => (
  <motion.g>
    <motion.path
      d="M0 0 Q-8 -30 0 -60 Q8 -90 0 -120"
      stroke="#4a7c59"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.8, delay, ease: [0.16, 1, 0.3, 1] }}
    />
    {/* Hoja izquierda */}
    <motion.path
      d="M-2 -55 Q-25 -70 -20 -45 Q-10 -40 -2 -55Z"
      fill="#5a9e6f"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.9 }}
      transition={{ duration: 1, delay: delay + 1.2, ease: [0.34, 1.56, 0.64, 1] }}
      style={{ transformOrigin: '-2px -55px' }}
    />
    {/* Hoja derecha */}
    <motion.path
      d="M2 -80 Q25 -95 20 -70 Q10 -65 2 -80Z"
      fill="#4a8c5c"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.9 }}
      transition={{ duration: 1, delay: delay + 1.5, ease: [0.34, 1.56, 0.64, 1] }}
      style={{ transformOrigin: '2px -80px' }}
    />
  </motion.g>
);

/* ─── Rosa completa ───────────────────────────────────────── */
const Rose = ({ x, delay, scale = 1, variant = 'pink' }: {
  x: string; delay: number; scale?: number; variant?: 'pink' | 'red' | 'white' | 'peach';
}) => {
  const palettes = {
    pink:  { outer: '#f9a8d4', mid: '#f472b6', inner: '#ec4899', center: '#be185d' },
    red:   { outer: '#fca5a5', mid: '#f87171', inner: '#ef4444', center: '#b91c1c' },
    white: { outer: '#fce7f3', mid: '#fbcfe8', inner: '#f9a8d4', center: '#ec4899' },
    peach: { outer: '#fed7aa', mid: '#fdba74', inner: '#fb923c', center: '#ea580c' },
  };
  const p = palettes[variant];

  const petalLayers = [
    { r: 22, count: 6, color: p.outer, offset: 0 },
    { r: 17, count: 6, color: p.mid,   offset: 30 },
    { r: 12, count: 5, color: p.inner, offset: 15 },
    { r: 7,  count: 4, color: p.center,offset: 0  },
  ];

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, bottom: 0, transformOrigin: 'bottom center' }}
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg
        width={180 * scale}
        height={260 * scale}
        viewBox="-90 -200 180 210"
        overflow="visible"
      >
        <defs>
          <radialGradient id={`rg-${variant}-${delay}`} cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor={p.center} />
            <stop offset="100%" stopColor={p.outer} />
          </radialGradient>
          <filter id={`glow-${variant}`}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Tallo */}
        <Stem delay={delay} />

        {/* Pétalos por capas */}
        {petalLayers.map((layer, li) =>
          Array.from({ length: layer.count }).map((_, pi) => {
            const angle = (360 / layer.count) * pi + layer.offset;
            const rad = (angle * Math.PI) / 180;
            const cx = Math.sin(rad) * layer.r * 0.6;
            const cy = -120 + Math.cos(rad) * layer.r * 0.6;
            return (
              <motion.ellipse
                key={`${li}-${pi}`}
                cx={cx}
                cy={cy}
                rx={layer.r * 0.7}
                ry={layer.r}
                fill={layer.color}
                opacity={0.9}
                transform={`rotate(${angle} ${cx} ${cy})`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.9 }}
                transition={{
                  duration: 0.8,
                  delay: delay + 1.8 + li * 0.3 + pi * 0.08,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
                filter={`url(#glow-${variant})`}
              />
            );
          })
        )}

        {/* Centro */}
        <motion.circle
          cx={0}
          cy={-120}
          r={5}
          fill={p.center}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 3.2, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ transformOrigin: '0px -120px' }}
        />
      </svg>
    </motion.div>
  );
};

/* ─── Hierba / pasto decorativo ──────────────────────────── */
const GrassBlade = ({ x, delay, h }: { x: number; delay: number; h: number }) => (
  <motion.div
    className="absolute bottom-0 pointer-events-none"
    style={{ transformOrigin: 'bottom center', left: `${x}%` }}
    initial={{ scaleY: 0 }}
    animate={{ scaleY: 1 }}
    transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    <svg width="12" height={h} viewBox={`0 0 12 ${h}`}>
      <path
        d={`M6 ${h} Q${2 + Math.random() * 8} ${h * 0.5} ${4 + Math.random() * 4} 0`}
        stroke="#6aad7a"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  </motion.div>
);

/* ─── Mariposa ────────────────────────────────────────────── */
const Butterfly = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    initial={{ x: -100, y: 300, opacity: 0 }}
    animate={{
      x: ['-10%', '20%', '50%', '80%', '110%'],
      y: ['60%', '40%', '50%', '30%', '45%'],
      opacity: [0, 1, 1, 1, 0],
    }}
    transition={{ duration: 12, delay, repeat: Infinity, repeatDelay: 20, ease: 'easeInOut' }}
  >
    <motion.svg
      width="32" height="24" viewBox="0 0 32 24"
      animate={{ scaleX: [1, -1, 1] }}
      transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <ellipse cx="8" cy="10" rx="8" ry="10" fill="#f9a8d4" opacity="0.8" transform="rotate(-20 8 10)" />
      <ellipse cx="24" cy="10" rx="8" ry="10" fill="#f472b6" opacity="0.8" transform="rotate(20 24 10)" />
      <ellipse cx="8" cy="16" rx="5" ry="6" fill="#ec4899" opacity="0.7" transform="rotate(20 8 16)" />
      <ellipse cx="24" cy="16" rx="5" ry="6" fill="#db2777" opacity="0.7" transform="rotate(-20 24 16)" />
      <line x1="16" y1="4" x2="16" y2="20" stroke="#1c1c1c" strokeWidth="1.5" />
    </motion.svg>
  </motion.div>
);

/* ─── Componente principal ────────────────────────────────── */
export function EpicGarden() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const roses = [
    { x: '-4%',  delay: 0.2, scale: 1.1, variant: 'pink'  as const },
    { x: '5%',   delay: 0.8, scale: 0.8, variant: 'white' as const },
    { x: '14%',  delay: 1.4, scale: 1.0, variant: 'red'   as const },
    { x: '78%',  delay: 0.5, scale: 1.2, variant: 'peach' as const },
    { x: '86%',  delay: 1.1, scale: 0.9, variant: 'pink'  as const },
    { x: '92%',  delay: 1.8, scale: 1.0, variant: 'white' as const },
    { x: '68%',  delay: 2.2, scale: 0.7, variant: 'red'   as const },
    { x: '22%',  delay: 2.8, scale: 0.75,variant: 'peach' as const },
  ];

  const petals = Array.from({ length: 18 }, (_, i) => ({
    delay: i * 1.5,
    x: Math.random() * 100,
    size: 12 + Math.random() * 20,
    color: ['#fda4af', '#f9a8d4', '#fbcfe8', '#fecdd3', '#fed7aa'][Math.floor(Math.random() * 5)],
    duration: 8 + Math.random() * 6,
  }));

  const grass = Array.from({ length: 30 }, (_, i) => ({
    x: i * 3.5 + Math.random() * 2,
    delay: Math.random() * 2,
    h: 40 + Math.random() * 60,
  }));

  return (
    <div className="fixed inset-0 z-[5] pointer-events-none overflow-hidden">
      {/* Pasto */}
      {grass.map((g, i) => <GrassBlade key={i} {...g} />)}

      {/* Rosas */}
      {roses.map((r, i) => <Rose key={i} {...r} />)}

      {/* Pétalos flotantes */}
      {petals.map((p, i) => <FloatingPetal key={i} {...p} />)}

      {/* Mariposas */}
      <Butterfly delay={5} />
      <Butterfly delay={18} />

      {/* Brillo de luz solar */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,240,200,0.15) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
