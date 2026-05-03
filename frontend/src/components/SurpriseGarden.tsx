'use client';
import { motion } from 'framer-motion';

export function SurpriseGarden() {
  return (
    <div className="relative w-48 h-48 mx-auto -mb-12 z-20 flex items-center justify-center">
      {/* Tapa de la caja que vuela */}
      <motion.div
        className="absolute w-20 h-8 bg-rose-600 rounded-t-lg z-30 shadow-lg flex items-center justify-center"
        initial={{ y: 20, rotate: 0 }}
        animate={{ y: -80, rotate: -20, opacity: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      >
        <div className="w-full h-2 bg-rose-700 mt-2" />
      </motion.div>

      {/* Base de la caja */}
      <motion.div
        className="absolute w-20 h-16 bg-rose-500 rounded-b-lg z-10 shadow-inner overflow-visible"
        initial={{ scale: 1 }}
        animate={{ scale: 0.9, opacity: 0.5 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="absolute inset-x-0 top-0 h-2 bg-rose-600" />
        <div className="absolute inset-y-0 left-1/2 w-4 -ml-2 bg-rose-700" />
      </motion.div>

      {/* Rosas que crecen (Animación más realista) */}
      {[
        { x: -30, y: -40, s: 1.2, d: 0.8, c: "#e11d48" },
        { x: 30, y: -35, s: 1.1, d: 1.0, c: "#fb7185" },
        { x: 0, y: -60, s: 1.4, d: 1.2, c: "#be123c" },
        { x: -50, y: -20, s: 0.9, d: 1.4, c: "#fda4af" },
        { x: 50, y: -15, s: 1.0, d: 1.6, c: "#f43f5e" },
      ].map((rose, i) => (
        <motion.div
          key={i}
          className="absolute origin-bottom"
          initial={{ scale: 0, y: 10, opacity: 0 }}
          animate={{ scale: rose.s, y: rose.y, opacity: 1 }}
          transition={{ 
            duration: 1.5, 
            delay: rose.d, 
            type: "spring", 
            stiffness: 100, 
            damping: 10 
          }}
          style={{ left: `calc(50% + ${rose.x}px)` }}
        >
          {/* SVG de Rosa Minimalista pero Efectivo */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
             {/* Hojas */}
             <path d="M20 40 Q10 35 5 25" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
             <path d="M20 40 Q30 35 35 25" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
             {/* Pétalos */}
             <circle cx="20" cy="20" r="15" fill={rose.c} fillOpacity="0.8" />
             <path d="M20 5 C25 5 35 15 20 25 C5 15 15 5 20 5Z" fill={rose.c} />
             <path d="M20 10 C22 10 28 15 20 20 C12 15 18 10 20 10Z" fill="white" fillOpacity="0.2" />
          </svg>
        </motion.div>
      ))}

      {/* Brillos / Chisperos */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`spark-${i}`}
          className="absolute w-1 h-1 bg-yellow-300 rounded-full"
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{ 
            scale: [0, 1.5, 0],
            x: (i % 2 === 0 ? 1 : -1) * (30 + Math.random() * 50),
            y: -(40 + Math.random() * 60),
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 1.5, delay: 1, repeat: Infinity, repeatDelay: 1 }}
        />
      ))}
    </div>
  );
}
