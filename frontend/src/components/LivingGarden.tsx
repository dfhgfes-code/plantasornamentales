'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const FlowerOne = ({ delay = 0, scale = 1, x = 0, y = 0, rotate = 0 }) => (
  <motion.div 
    className="absolute pointer-events-none"
    initial={{ scale: 0, opacity: 0, rotate: rotate - 20 }}
    animate={{ scale, opacity: 0.7, rotate }}
    transition={{ duration: 2, delay, ease: "backOut" }}
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <svg width="120" height="120" viewBox="0 0 100 100">
      <path d="M50 100 Q45 80 50 60" stroke="#15803d" strokeWidth="3" fill="none" />
      {[...Array(8)].map((_, i) => (
        <motion.path
          key={i}
          d="M50 50 Q70 20 50 0 Q30 20 50 50"
          fill={i % 2 === 0 ? "#f43f5e" : "#fb7185"}
          style={{ transformOrigin: '50px 50px', rotate: i * 45 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 1 + i * 0.1, duration: 1 }}
        />
      ))}
      <circle cx="50" cy="50" r="8" fill="#881337" />
    </svg>
  </motion.div>
);

const FlowerTwo = ({ delay = 0, scale = 1, x = 0, y = 0, rotate = 0 }) => (
  <motion.div 
    className="absolute pointer-events-none"
    initial={{ scale: 0, opacity: 0, y: 100 }}
    animate={{ scale, opacity: 0.6, y: 0, rotate }}
    transition={{ duration: 2.5, delay, ease: "circOut" }}
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <svg width="150" height="150" viewBox="0 0 100 100">
      <path d="M50 100 Q60 70 50 40" stroke="#16a34a" strokeWidth="2" fill="none" />
      {[...Array(12)].map((_, i) => (
        <motion.ellipse
          key={i}
          cx="50" cy="25" rx="10" ry="25"
          fill="#fde047"
          style={{ transformOrigin: '50px 50px', rotate: i * 30 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 1.5 + i * 0.05, duration: 0.8 }}
        />
      ))}
      <circle cx="50" cy="50" r="12" fill="#422006" />
    </svg>
  </motion.div>
);

export function LivingGarden() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [randoms, setRandoms] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    // Generar valores aleatorios estables después del montaje para evitar hydration mismatch
    const vals = [...Array(20)].map(() => ({
      x: Math.random() * 100,
      dur: 10 + Math.random() * 15,
      del: Math.random() * 10
    }));
    setRandoms(vals);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ 
        x: (e.clientX / window.innerWidth - 0.5) * 40, 
        y: (e.clientY / window.innerHeight - 0.5) * 40 
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-gradient-to-br from-indigo-50 via-rose-50 to-emerald-50">
      {/* Capa de fondo 1 */}
      <motion.div style={{ x: mousePos.x * 0.5, y: mousePos.y * 0.5 }} className="absolute inset-0">
        <FlowerOne x={10} y={20} scale={1.2} delay={0.2} rotate={15} />
        <FlowerTwo x={80} y={15} scale={1.5} delay={0.5} rotate={-10} />
        <FlowerOne x={70} y={70} scale={1} delay={0.8} rotate={45} />
        <FlowerTwo x={15} y={75} scale={1.3} delay={1.1} rotate={-20} />
      </motion.div>

      {/* Capa de fondo 2 (Más rápida) */}
      <motion.div style={{ x: mousePos.x, y: mousePos.y }} className="absolute inset-0">
        <FlowerOne x={40} y={10} scale={0.8} delay={1.5} rotate={0} />
        <FlowerTwo x={90} y={60} scale={1.1} delay={1.8} rotate={30} />
        <FlowerOne x={5} y={45} scale={0.9} delay={2.1} rotate={-15} />
        <FlowerTwo x={55} y={85} scale={1.4} delay={2.4} rotate={10} />
      </motion.div>

      {/* Pétalos cayendo (estables tras montaje) */}
      {randoms.map((r, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 rounded-full bg-rose-300 opacity-40"
          initial={{ y: -100, x: `${r.x}%`, rotate: 0 }}
          animate={{ 
            y: "110vh", 
            rotate: 360,
          }}
          transition={{ 
            duration: r.dur, 
            repeat: Infinity, 
            delay: r.del,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}
