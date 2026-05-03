'use client';
import { motion } from 'framer-motion';

const RealisticRose = ({ delay = 0, scale = 1, x = 0, y = 0 }) => (
  <motion.div
    className="absolute origin-bottom pointer-events-none"
    initial={{ scale: 0, opacity: 0, y: 20 }}
    animate={{ scale, opacity: 1, y }}
    transition={{ duration: 2, delay, ease: [0.16, 1, 0.3, 1] }}
    style={{ left: `calc(50% + ${x}px)` }}
  >
    <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tallo y Hojas */}
      <path d="M30 80C30 80 28 60 30 45" stroke="#14532d" strokeWidth="2" strokeLinecap="round" />
      <motion.path 
        d="M30 65C20 65 15 55 15 55" stroke="#166534" strokeWidth="1.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: delay + 0.5, duration: 1 }}
      />
      <motion.path 
        d="M30 70C40 70 45 60 45 60" stroke="#166534" strokeWidth="1.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: delay + 0.7, duration: 1 }}
      />
      
      {/* Capas de Pétalos de Rosa (Efecto Realista con Gradientes) */}
      <defs>
        <radialGradient id="roseGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="70%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#9f1239" />
        </radialGradient>
      </defs>
      
      {/* Pétalos exteriores */}
      <circle cx="30" cy="30" r="18" fill="url(#roseGrad)" />
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <path
          key={i}
          d="M30 30C30 30 45 15 30 0C15 15 30 30 30 30Z"
          fill="url(#roseGrad)"
          style={{ transformOrigin: '30px 30px', transform: `rotate(${angle}deg)` }}
        />
      ))}
      
      {/* Centro de la Rosa (Más cerrado) */}
      <circle cx="30" cy="30" r="10" fill="#881337" />
      <circle cx="30" cy="28" r="6" fill="#be123c" />
    </svg>
  </motion.div>
);

export function LuxuryGiftSurprise() {
  return (
    <div className="relative w-64 h-64 mx-auto -mb-16 z-20 flex items-center justify-center">
      {/* Caja de Lujo */}
      <div className="relative w-24 h-24 mt-20">
        {/* Base de la caja */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-rose-600 to-rose-800 rounded-lg shadow-2xl z-10"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Cinta de seda */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 bg-rose-400/30 backdrop-blur-sm" />
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 bg-rose-400/30 backdrop-blur-sm" />
        </motion.div>

        {/* Tapa que se abre */}
        <motion.div
          className="absolute -inset-x-1 -top-2 h-6 bg-rose-500 rounded-md z-30 shadow-xl"
          initial={{ y: 0, rotateX: 0 }}
          animate={{ y: -120, rotateX: 45, rotateY: 20, opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Lazo de la tapa */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-10 h-10 border-4 border-rose-300 rounded-full opacity-50" />
        </motion.div>
      </div>

      {/* Rosas Realistas brotando */}
      <RealisticRose x={-60} y={-20} scale={1.1} delay={1} />
      <RealisticRose x={60} y={-30} scale={1.2} delay={1.2} />
      <RealisticRose x={-20} y={-70} scale={1.4} delay={1.4} />
      <RealisticRose x={30} y={-60} scale={1.3} delay={1.6} />
      <RealisticRose x={0} y={-40} scale={1.5} delay={1.8} />
      
      {/* Brillo Mágico (Partículas finas) */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-amber-200 rounded-full blur-[1px]"
          initial={{ opacity: 0, x: 0, y: 80 }}
          animate={{ 
            opacity: [0, 1, 0],
            x: (i % 2 === 0 ? 1 : -1) * (40 + Math.random() * 80),
            y: -(20 + Math.random() * 120),
            scale: [0, 1.5, 0]
          }}
          transition={{ duration: 2, delay: 1 + i * 0.1, repeat: Infinity, repeatDelay: 1 }}
        />
      ))}
    </div>
  );
}
