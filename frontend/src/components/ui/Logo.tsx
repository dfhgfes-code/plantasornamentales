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
      {/* Dynamic Blooming Rose SVG */}
      <svg 
        width={currentSize.icon} 
        height={currentSize.icon} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "transition-transform duration-700",
          isLight ? "text-rose-200/90" : "text-rose-400"
        )}
      >
        {/* Stem - Growing Animation */}
        <path 
          d="M50 90C50 90 49 70 50 45" 
          stroke="currentColor" 
          strokeWidth="1.2" 
          strokeLinecap="round" 
          className="animate-bloom-stem"
        />

        {/* Leaf 1 */}
        <path 
          d="M50 75C42 72 38 78 42 82C46 86 50 82 50 75Z" 
          fill="currentColor" 
          fillOpacity="0.2" 
          stroke="currentColor" 
          strokeWidth="0.8" 
          className="animate-bloom-leaf"
          style={{ animationDelay: '0.4s', opacity: 0 }}
        />

        {/* Leaf 2 */}
        <path 
          d="M50 65C58 62 62 68 58 72C54 76 50 72 50 65Z" 
          fill="currentColor" 
          fillOpacity="0.2" 
          stroke="currentColor" 
          strokeWidth="0.8" 
          className="animate-bloom-leaf"
          style={{ animationDelay: '0.6s', opacity: 0 }}
        />

        {/* Petals - Blooming Animation */}
        <g className="animate-bloom-petal" style={{ animationDelay: '1s', opacity: 0 }}>
          {/* Outer Petals */}
          <path d="M50 45C35 45 30 30 40 20C45 15 55 15 60 20C70 30 65 45 50 45Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.8" />
          
          {/* Middle Petals - Slightly offset for depth */}
          <path d="M50 45C42 45 38 38 42 32C45 28 55 28 58 32C62 38 58 45 50 45Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.8" />
          
          {/* Core - The heart of the rose */}
          <path d="M50 40C47 40 45 37 45 35C45 33 55 33 55 35C55 37 53 40 50 40Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="0.8" />
          
          {/* Opening Details */}
          <path d="M45 32C45 32 48 28 50 28C52 28 55 32 55 32" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" />
        </g>
      </svg>

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
