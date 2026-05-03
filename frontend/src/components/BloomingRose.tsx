'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function BloomingRose() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-16 h-16" />;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center mx-auto">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tallo */}
        <motion.path
          d="M50 95C50 95 48 80 50 70"
          stroke="#15803d"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        
        {/* Hojas */}
        <motion.path
          d="M50 80C40 80 35 75 35 75"
          stroke="#16a34a"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />
        <motion.path
          d="M50 85C60 85 65 80 65 80"
          stroke="#16a34a"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        />

        {/* Pétalos exteriores */}
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <motion.path
            key={`outer-${i}`}
            d="M50 50C50 50 70 30 50 10C30 30 50 50 50 50Z"
            fill="#e11d48"
            style={{ originX: "50px", originY: "50px" }}
            initial={{ scale: 0, rotate: angle, opacity: 0 }}
            animate={{ 
              scale: 1, 
              rotate: angle, 
              opacity: 0.8,
            }}
            transition={{ 
              duration: 1.2, 
              delay: 0.2 + i * 0.1,
              ease: [0.34, 1.56, 0.64, 1] // Custom spring-like easing
            }}
          />
        ))}

        {/* Pétalos interiores */}
        {[36, 108, 180, 252, 324].map((angle, i) => (
          <motion.path
            key={`mid-${i}`}
            d="M50 50C50 50 65 35 50 20C35 35 50 50 50 50Z"
            fill="#fb7185"
            style={{ originX: "50px", originY: "50px" }}
            initial={{ scale: 0, rotate: angle, opacity: 0 }}
            animate={{ scale: 1, rotate: angle, opacity: 0.9 }}
            transition={{ 
              duration: 1, 
              delay: 0.6 + i * 0.1,
              ease: "easeOut"
            }}
          />
        ))}

        {/* Centro */}
        <motion.circle
          cx="50"
          cy="50"
          r="6"
          fill="#be123c"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2, type: "spring" }}
        />
      </svg>
      
      {/* Brillos fijos (sin Math.random para evitar hidratación fallida) */}
      {[
        { x: -20, y: -25, d: 2 },
        { x: 25, y: -15, d: 2.5 },
        { x: -15, y: 20, d: 3 },
        { x: 20, y: 15, d: 2.2 },
      ].map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-rose-300 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0],
            scale: [0, 1.2, 0],
            x: p.x,
            y: p.y,
          }}
          transition={{ 
            duration: p.d,
            delay: 1.5 + i * 0.4,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}
