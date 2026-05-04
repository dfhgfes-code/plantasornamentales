'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const FlowerIcon = ({ className, size = 20 }: { className?: string, size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M50 82C50 82 49 65 50 48" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M50 48C56 48 64 40 62 30C60 20 54 24 50 32C46 24 40 20 38 30C36 40 44 48 50 48Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M50 32C52 28 58 26 58 32C58 38 52 42 50 42C48 42 42 38 42 32C42 26 48 28 50 32Z" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M50 65C50 65 38 62 34 68C30 74 42 74 50 65Z" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M50 58C50 58 62 55 66 61C70 67 58 67 50 58Z" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const AnimatedGardenLogo = () => {
  const gardenFlowers = [
    { delay: 0.2, x: -25, y: -15, scale: 0.6, rotate: -15 },
    { delay: 0.4, x: 25, y: -20, scale: 0.5, rotate: 20 },
    { delay: 0.6, x: -15, y: -35, scale: 0.4, rotate: -10 },
    { delay: 0.8, x: 15, y: -30, scale: 0.45, rotate: 15 },
    { delay: 1.0, x: 0, y: -45, scale: 0.35, rotate: 5 },
  ];

  return (
    <div className="flex flex-col items-center gap-2 relative">
      <div className="relative mb-2">
        {/* Main central flower */}
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-rose-400 z-10 relative"
        >
          <FlowerIcon size={45} />
        </motion.div>

        {/* The blooming garden around it */}
        {gardenFlowers.map((flower, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: [0, 1, 0.8],
              scale: flower.scale,
              x: flower.x,
              y: flower.y,
              rotate: flower.rotate,
            }}
            transition={{
              duration: 2,
              delay: flower.delay,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeOut"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-rose-300/60"
          >
            <FlowerIcon size={30} />
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col items-center">
        <h1 className="text-3xl tracking-[0.08em] leading-none text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
          Janneth Acevedo
        </h1>
        <div className="flex items-center gap-2 mt-2 w-full justify-center opacity-60">
          <span className="w-12 h-[0.5px] bg-gray-300" />
          <span className="font-sans uppercase tracking-[0.45em] text-[9px] font-medium text-gray-400 whitespace-nowrap">
            Plantas Ornamentales
          </span>
          <span className="w-12 h-[0.5px] bg-gray-300" />
        </div>
      </div>
    </div>
  );
};
