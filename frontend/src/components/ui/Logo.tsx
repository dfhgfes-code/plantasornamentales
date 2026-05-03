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
    xl: { icon: 56, title: 'text-4xl', sub: 'text-[12px]' },
  };

  const currentSize = sizes[size];

  return (
    <div className={cn(
      "flex group transition-all duration-300",
      horizontal ? "flex-row items-center gap-3" : "flex-col items-center gap-1.5",
      centered && !horizontal ? "text-center" : "",
      className
    )}>
      {/* Hand-drawn Flower SVG */}
      <svg 
        width={currentSize.icon} 
        height={currentSize.icon} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "transition-transform duration-500 group-hover:scale-110",
          isLight ? "text-pink-300" : "text-pink-400"
        )}
      >
        <path 
          d="M50 80C50 80 48 65 50 50" 
          stroke="currentColor" 
          strokeWidth="1.2" 
          strokeLinecap="round"
        />
        <path 
          d="M50 50C55 50 65 42 62 32C59 22 53 26 50 34C47 26 41 22 38 32C35 42 45 50 50 50Z" 
          stroke="currentColor" 
          strokeWidth="1.2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M50 68C50 68 32 65 28 72C24 79 40 79 50 68Z" 
          stroke="currentColor" 
          strokeWidth="1" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M50 60C50 60 68 57 72 64C76 71 60 71 50 60Z" 
          stroke="currentColor" 
          strokeWidth="1" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>

      <div className={cn("flex flex-col", horizontal ? "items-start" : "items-center")}>
        <h1 className={cn(
          "tracking-[0.15em] leading-none uppercase",
          currentSize.title,
          isLight ? "text-white" : "text-gray-800"
        )}
        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
        >
          Flor & Vida
        </h1>
        <div className="flex items-center gap-2 mt-1 w-full justify-center">
          <span className={cn("flex-1 h-[0.5px]", isLight ? "bg-white/20" : "bg-gray-200")} />
          <span className={cn(
            "font-sans uppercase tracking-[0.4em] font-medium whitespace-nowrap",
            currentSize.sub,
            isLight ? "text-pink-300/80" : "text-pink-500/80"
          )}>
            Florería
          </span>
          <span className={cn("flex-1 h-[0.5px]", isLight ? "bg-white/20" : "bg-gray-200")} />
        </div>
      </div>
    </div>
  );
};
