'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
  horizontal?: boolean;
}

const MasterpieceRose = ({ size, isLight }: { size: number, isLight: boolean }) => {
  const petals = [
    // Outer Layer - 8 large petals
    { d: "M0 0C-20 -10 -40 -30 -30 -50C-20 -70 20 -70 30 -50C40 -30 20 -10 0 0Z", delay: 0.2, rotate: -30, opacity: 0.1 },
    { d: "M0 0C20 -10 40 -30 30 -50C20 -70 -20 -70 -30 -50C-40 -30 -20 -10 0 0Z", delay: 0.4, rotate: 30, opacity: 0.1 },
    { d: "M0 0C-30 0 -50 -20 -45 -40C-40 -60 0 -60 10 -40C20 -20 10 0 0 0Z", delay: 0.6, rotate: -60, opacity: 0.1 },
    { d: "M0 0C30 0 50 -20 45 -40C40 -60 0 -60 -10 -40C-20 -20 -10 0 0 0Z", delay: 0.8, rotate: 60, opacity: 0.1 },
    
    // Mid Layer - 6 medium petals
    { d: "M0 0C-15 -5 -30 -25 -25 -40C-20 -55 20 -55 25 -40C30 -25 15 -5 0 0Z", delay: 1.0, rotate: -15, opacity: 0.2 },
    { d: "M0 0C15 -5 30 -25 25 -40C20 -55 -20 -55 -25 -40C-30 -25 -15 -5 0 0Z", delay: 1.2, rotate: 15, opacity: 0.2 },
    { d: "M0 0C-20 -2 -35 -15 -30 -30C-25 -45 15 -45 20 -30C25 -15 15 -2 0 0Z", delay: 1.4, rotate: -45, opacity: 0.2 },
    
    // Inner Layer - 4 tight petals
    { d: "M0 0C-10 -5 -20 -20 -15 -30C-10 -40 10 -40 15 -30C20 -20 10 -5 0 0Z", delay: 1.6, rotate: 0, opacity: 0.3 },
    { d: "M0 0C-8 -2 -15 -15 -12 -25C-10 -35 10 -35 12 -25C15 -15 8 -2 0 0Z", delay: 1.8, rotate: 10, opacity: 0.4 },
  ];

  return (
    <motion.svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={isLight ? "text-rose-100" : "text-rose-400"}
    >
      <defs>
        <radialGradient id="petalGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Stem */}
      <motion.path 
        d="M50 95C50 95 48 85 49 70" 
        stroke="currentColor" 
        strokeWidth="0.8" 
        strokeLinecap="round" 
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Petals */}
      <g transform="translate(50, 70)">
        {petals.map((p, i) => (
          <motion.path
            key={i}
            d={p.d}
            fill="url(#petalGrad)"
            stroke="currentColor"
            strokeWidth="0.3"
            initial={{ scale: 0, rotate: p.rotate, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: p.opacity }}
            transition={{ 
              duration: 2.5, 
              delay: p.delay, 
              ease: [0.22, 1, 0.36, 1] 
            }}
          />
        ))}
        
        {/* Core Spiral */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 2 }}
        >
          <path d="M0 -15C-5 -15 -8 -22 -5 -28C-2 -34 8 -34 10 -28C12 -22 8 -15 0 -15Z" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="0.4" />
          <path d="M-3 -22C-3 -22 -1 -25 2 -25C5 -25 7 -22 7 -22" stroke="currentColor" strokeWidth="0.3" strokeLinecap="round" />
          <path d="M-1 -19C-1 -19 0 -21 2 -21C4 -21 5 -19 5 -19" stroke="currentColor" strokeWidth="0.3" strokeLinecap="round" />
        </motion.g>
      </g>

      {/* Floating Particles (Sparkles) */}
      {[...Array(6)].map((_, i) => (
        <motion.circle
          key={i}
          r="0.5"
          fill="currentColor"
          initial={{ 
            opacity: 0, 
            cx: 50, 
            cy: 50 
          }}
          animate={{ 
            opacity: [0, 1, 0],
            cx: 50 + (Math.random() - 0.5) * 60,
            cy: 50 + (Math.random() - 0.5) * 60,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: 1 + Math.random() * 2,
            repeat: Infinity,
          }}
        />
      ))}
    </motion.svg>
  );
};

export const Logo = ({ 
  className, 
  variant = 'dark', 
  size = 'md',
  centered = false,
  horizontal = false
}: LogoProps) => {
  const isLight = variant === 'light';
  
  const sizes = {
    sm: { icon: 30, title: 'text-sm', sub: 'text-[6px]' },
    md: { icon: 50, title: 'text-lg', sub: 'text-[8px]' },
    lg: { icon: 70, title: 'text-2xl', sub: 'text-[10px]' },
    xl: { icon: 120, title: 'text-4xl', sub: 'text-[12px]' },
  };

  const currentSize = sizes[size];

  return (
    <div className={cn(
      "flex group transition-all duration-300",
      horizontal ? "flex-row items-center gap-6" : "flex-col items-center gap-4",
      centered && !horizontal ? "text-center" : "",
      className
    )}>
      {/* Masterpiece Rose Branding */}
      <div className="relative flex items-center justify-center" style={{ width: currentSize.icon, height: currentSize.icon }}>
        <MasterpieceRose size={currentSize.icon} isLight={isLight} />
        
        {/* Soft background glow */}
        <div className={cn(
          "absolute inset-0 rounded-full blur-3xl opacity-20 -z-10 animate-soft-glow",
          isLight ? "bg-white" : "bg-rose-200"
        )} />
      </div>

      <div className={cn("flex flex-col", horizontal ? "items-start" : "items-center")}>
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className={cn(
            "tracking-[0.15em] leading-none text-gray-800",
            currentSize.title,
            isLight ? "text-white" : ""
          )}
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
        >
          Janneth Acevedo
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.5 }}
          className="flex items-center gap-2 mt-3 w-full justify-center"
        >
          <span className={cn("flex-1 h-[0.5px]", isLight ? "bg-white/10" : "bg-gray-100")} />
          <span className={cn(
            "font-sans uppercase tracking-[0.6em] font-medium whitespace-nowrap",
            currentSize.sub,
            isLight ? "text-gray-300/60" : "text-gray-400"
          )}>
            Plantas Ornamentales
          </span>
          <span className={cn("flex-1 h-[0.5px]", isLight ? "bg-white/10" : "bg-gray-100")} />
        </motion.div>
      </div>
    </div>
  );
};
