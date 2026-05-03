'use client';
import { motion } from 'framer-motion';

export function BloomingRose() {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
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
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        {/* Hojas */}
        <motion.path
          d="M50 80C40 80 35 75 35 75"
          stroke="#16a34a"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
        <motion.path
          d="M50 85C60 85 65 80 65 80"
          stroke="#16a34a"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        />

        {/* Pétalos de afuera (más grandes) */}
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <motion.path
            key={`outer-${i}`}
            d="M50 50C50 50 70 30 50 10C30 30 50 50 50 50Z"
            fill="#e11d48"
            className="origin-center"
            initial={{ scale: 0, rotate: angle, opacity: 0 }}
            animate={{ 
              scale: 1, 
              rotate: angle, 
              opacity: 0.8,
              y: [0, -2, 0] 
            }}
            transition={{ 
              duration: 2, 
              delay: 0.2 + i * 0.1,
              ease: "backOut",
              y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
            }}
          />
        ))}

        {/* Pétalos del medio */}
        {[36, 108, 180, 252, 324].map((angle, i) => (
          <motion.path
            key={`mid-${i}`}
            d="M50 50C50 50 65 35 50 20C35 35 50 50 50 50Z"
            fill="#fb7185"
            className="origin-center"
            initial={{ scale: 0, rotate: angle, opacity: 0 }}
            animate={{ scale: 1, rotate: angle, opacity: 0.9 }}
            transition={{ 
              duration: 1.5, 
              delay: 0.8 + i * 0.1,
              ease: "backOut" 
            }}
          />
        ))}

        {/* Centro de la rosa */}
        <motion.circle
          cx="50"
          cy="50"
          r="8"
          fill="#be123c"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 1.5, type: "spring", stiffness: 200, damping: 10 }}
        />

        {/* Brillo suave */}
        <motion.circle
          cx="45"
          cy="45"
          r="2"
          fill="white"
          fillOpacity="0.3"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>
      
      {/* Partículas de polen/brillo alrededor */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-rose-300 rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: (Math.random() - 0.5) * 60,
            y: (Math.random() - 0.5) * 60,
          }}
          transition={{ 
            duration: 2 + Math.random() * 2,
            delay: 2 + i * 0.5,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}
