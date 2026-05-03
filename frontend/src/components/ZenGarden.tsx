'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const ElegantFlower = ({ x, y, delay, scale = 1, color = "#fda4af" }: { x: string, y: string, delay: number, scale?: number, color?: string }) => (
  <motion.div 
    className="absolute pointer-events-none"
    style={{ left: x, top: y, scale }}
  >
    <svg width="200" height="200" viewBox="0 0 100 100" fill="none">
      {/* Tallo Artístico */}
      <motion.path
        d="M50 100 C50 80 40 70 50 40"
        stroke="#065f46"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.4 }}
        transition={{ duration: 1.5, delay, ease: "easeInOut" }}
      />
      
      {/* Pétalos con Resplandor */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <motion.path
          key={i}
          d="M50 40 C65 20 55 5 50 5 C45 5 35 20 50 40"
          fill={color}
          fillOpacity="0.2"
          stroke={color}
          strokeWidth="0.5"
          style={{ transformOrigin: '50px 40px', rotate: angle }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 2, delay: delay + 0.8 + i * 0.1, ease: "easeOut" }}
        />
      ))}
      
      {/* Resplandor Central */}
      <motion.circle
        cx="50" cy="40" r="4"
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
        transition={{ duration: 1, delay: delay + 2 }}
        style={{ filter: `blur(4px)` }}
      />
    </svg>
  </motion.div>
);

export function ZenGarden() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#fafafa]">
      {/* Fondo con degradado sutil */}
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-50/30 via-transparent to-teal-50/20" />
      
      {/* Flores Artísticas en las esquinas */}
      <ElegantFlower x="-2%" y="60%" delay={0} scale={2} color="#fb7185" />
      <ElegantFlower x="85%" y="-5%" delay={0.5} scale={2.5} color="#f472b6" />
      <ElegantFlower x="75%" y="70%" delay={1} scale={1.8} color="#fda4af" />
      <ElegantFlower x="-5%" y="-10%" delay={1.5} scale={2.2} color="#ec4899" />

      {/* Partículas de luz muy sutiles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-rose-200"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.3, 0],
            y: [0, -100],
            x: [0, (i % 2 === 0 ? 30 : -30)]
          }}
          transition={{ 
            duration: 8 + i, 
            repeat: Infinity, 
            delay: i * 2 
          }}
          style={{ 
            left: `${10 + i * 15}%`, 
            bottom: '10%',
            filter: 'blur(2px)'
          }}
        />
      ))}
    </div>
  );
}
