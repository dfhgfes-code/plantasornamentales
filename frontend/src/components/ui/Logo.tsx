import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
  horizontal?: boolean;
}

export const Logo = ({ 
  className, 
  variant = 'dark', 
  size = 'md',
  centered = false,
  horizontal = false
}: LogoProps) => {
  const isLight = variant === 'light';
  
  const sizes = {
    sm: { icon: 20, title: 'text-sm', sub: 'text-[6px]' },
    md: { icon: 28, title: 'text-lg', sub: 'text-[8px]' },
    lg: { icon: 40, title: 'text-2xl', sub: 'text-[10px]' },
    xl: { icon: 60, title: 'text-4xl', sub: 'text-[12px]' },
  };

  const currentSize = sizes[size];

  return (
    <div className={cn(
      "flex group transition-all duration-300",
      horizontal ? "flex-row items-center gap-3" : "flex-col items-center gap-2",
      centered && !horizontal ? "text-center" : "",
      className
    )}>
      {/* Fine-Line Art Rose SVG - Minimalist & Professional */}
      <div className="relative">
        <svg 
          width={currentSize.icon} 
          height={currentSize.icon} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "transition-all duration-1000",
            isLight ? "text-rose-200/80" : "text-rose-300"
          )}
        >
          {/* Detailed Fine-Line Rose - Drawn effect */}
          <g className="animate-draw-rose">
            {/* Stem & Leaves - Single elegant line */}
            <path 
              d="M50 95C50 95 48 85 49 75C50 65 50 55 50 45M50 82C45 80 40 82 38 88C36 94 45 95 50 82M50 72C55 70 60 72 62 78C64 84 55 85 50 72" 
              stroke="currentColor" 
              strokeWidth="0.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            
            {/* Rose Head - Concentric delicate petals */}
            <path d="M50 45C55 45 60 42 62 38C65 32 60 25 50 25C40 25 35 32 38 38C40 42 45 45 50 45Z" stroke="currentColor" strokeWidth="0.6" />
            <path d="M50 42C53 42 56 40 57 37C59 33 56 28 50 28C44 28 41 33 43 37C44 40 47 42 50 42Z" stroke="currentColor" strokeWidth="0.5" />
            <path d="M50 38C52 38 53 37 54 35C55 33 53 30 50 30C47 30 45 33 46 35C47 37 48 38 50 38Z" stroke="currentColor" strokeWidth="0.4" />
            
            {/* Outer Petal Accents - Fine details */}
            <path d="M38 35C35 32 32 28 35 22C38 16 45 18 50 22C55 18 62 16 65 22C68 28 65 32 62 35" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 2" />
            <path d="M42 22C42 22 45 15 50 15C55 15 58 22 58 22" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1 2" />
          </g>
        </svg>
        
        {/* Subtle radial glow for depth */}
        <div className={cn(
          "absolute inset-0 rounded-full blur-2xl opacity-20 -z-10 animate-soft-glow",
          isLight ? "bg-white" : "bg-rose-200"
        )} />
      </div>

      <div className={cn("flex flex-col", horizontal ? "items-start" : "items-center")}>
        <h1 className={cn(
          "tracking-[0.08em] leading-none text-gray-800",
          currentSize.title,
          isLight ? "text-white" : ""
        )}
        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
        >
          Janneth Acevedo
        </h1>
        <div className="flex items-center gap-2 mt-2 w-full justify-center">
          <span className={cn("flex-1 h-[0.5px]", isLight ? "bg-white/10" : "bg-gray-100")} />
          <span className={cn(
            "font-sans uppercase tracking-[0.45em] font-medium whitespace-nowrap",
            currentSize.sub,
            isLight ? "text-gray-300/60" : "text-gray-400"
          )}>
            Plantas Ornamentales
          </span>
          <span className={cn("flex-1 h-[0.5px]", isLight ? "bg-white/10" : "bg-gray-100")} />
        </div>
      </div>
    </div>
  );
};
