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

const RoseIcon = ({ color, delay, size }: { color: string, delay: number, size: number }) => (
  <motion.svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 1, delay, ease: "easeOut" }}
    className={color}
  >
    {/* Elegant Curved Stem */}
    <motion.path 
      d="M50 95C50 95 45 80 50 60" 
      stroke="currentColor" 
      strokeWidth="1.2" 
      strokeLinecap="round" 
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: delay - 0.3 }}
    />

    {/* Leaves at the base */}
    <motion.path 
      d="M50 75C42 72 38 78 42 82C46 86 50 82 50 75Z" 
      fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.5"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: delay + 0.2 }}
    />
    <motion.path 
      d="M50 68C58 65 62 72 58 75C54 78 50 75 50 68Z" 
      fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.5"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: delay + 0.3 }}
    />
    
    {/* Organic Unfolding Petals */}
    <g transform="translate(50, 60)">
      {/* Outer Petal 1 */}
      <motion.path 
        d="M0 0C-15 -5 -25 -25 -10 -40C0 -50 10 -50 20 -40C35 -25 25 -5 0 0Z" 
        fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.6"
        initial={{ rotate: -20, scale: 0.5 }} animate={{ rotate: 0, scale: 1 }} transition={{ duration: 1.5, delay: delay + 0.1 }}
      />
      {/* Outer Petal 2 */}
      <motion.path 
        d="M0 0C15 -5 25 -25 10 -40C0 -50 -10 -50 -20 -40C-35 -25 -25 -5 0 0Z" 
        fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.6"
        initial={{ rotate: 20, scale: 0.5 }} animate={{ rotate: 0, scale: 1 }} transition={{ duration: 1.5, delay: delay + 0.2 }}
      />
      {/* Mid Petal 1 */}
      <motion.path 
        d="M0 0C-10 -5 -18 -18 -8 -30C0 -38 8 -38 18 -30C28 -18 18 -5 0 0Z" 
        fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="0.6"
        initial={{ rotate: -10, scale: 0.4 }} animate={{ rotate: 0, scale: 1 }} transition={{ duration: 1.2, delay: delay + 0.4 }}
      />
      {/* Mid Petal 2 */}
      <motion.path 
        d="M0 0C10 -5 18 -18 8 -30C0 -38 -8 -38 -18 -30C-28 -18 -18 -5 0 0Z" 
        fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="0.6"
        initial={{ rotate: 10, scale: 0.4 }} animate={{ rotate: 0, scale: 1 }} transition={{ duration: 1.2, delay: delay + 0.5 }}
      />
      {/* Center Bud */}
      <motion.path 
        d="M0 0C-5 -2 -8 -10 -4 -18C0 -22 0 -22 4 -18C8 -10 5 -2 0 0Z" 
        fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="0.8"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 1, delay: delay + 0.7 }}
      />
    </g>
  </motion.svg>
);

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
    md: { icon: 45, title: 'text-lg', sub: 'text-[8px]' },
    lg: { icon: 60, title: 'text-2xl', sub: 'text-[10px]' },
    xl: { icon: 90, title: 'text-4xl', sub: 'text-[12px]' },
  };

  const currentSize = sizes[size];

  return (
    <div className={cn(
      "flex group transition-all duration-300",
      horizontal ? "flex-row items-center gap-4" : "flex-col items-center gap-3",
      centered && !horizontal ? "text-center" : "",
      className
    )}>
      {/* Animated Boutique Garden of Roses */}
      <div className="relative flex items-center justify-center" style={{ width: currentSize.icon, height: currentSize.icon * 0.8 }}>
        {/* Rose 1: Main Pink */}
        <div className="z-20">
          <RoseIcon 
            color={isLight ? "text-rose-100" : "text-rose-400"} 
            delay={0.5} 
            size={currentSize.icon * 0.8} 
          />
        </div>

        {/* Rose 2: Soft Peach (Left) */}
        <div className="absolute -left-1/4 bottom-0 z-10">
          <RoseIcon 
            color={isLight ? "text-orange-100/60" : "text-orange-300/80"} 
            delay={0.8} 
            size={currentSize.icon * 0.6} 
          />
        </div>

        {/* Rose 3: Deep Rose (Right) */}
        <div className="absolute -right-1/4 bottom-0 z-10">
          <RoseIcon 
            color={isLight ? "text-pink-100/60" : "text-pink-400/80"} 
            delay={1.1} 
            size={currentSize.icon * 0.6} 
          />
        </div>

        {/* Soft background glow */}
        <div className={cn(
          "absolute inset-0 rounded-full blur-3xl opacity-20 -z-10 animate-soft-glow",
          isLight ? "bg-white" : "bg-rose-200"
        )} />
      </div>

      <div className={cn("flex flex-col", horizontal ? "items-start" : "items-center")}>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className={cn(
            "tracking-[0.12em] leading-none text-gray-800",
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
          transition={{ duration: 1, delay: 1.8 }}
          className="flex items-center gap-2 mt-2 w-full justify-center"
        >
          <span className={cn("flex-1 h-[0.5px]", isLight ? "bg-white/10" : "bg-gray-100")} />
          <span className={cn(
            "font-sans uppercase tracking-[0.5em] font-medium whitespace-nowrap",
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
