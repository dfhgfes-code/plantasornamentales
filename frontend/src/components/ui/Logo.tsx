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
      {/* Professional Boutique Blooming Rose SVG */}
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
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Stem - Growing Animation */}
        <path 
          d="M50 92C50 92 48 75 50 48" 
          stroke="currentColor" 
          strokeWidth="1.2" 
          strokeLinecap="round" 
          className="animate-bloom-stem"
        />

        {/* Leaves - Emerging after stem */}
        <path 
          d="M50 78C40 75 35 82 40 88C45 92 50 88 50 78Z" 
          fill="currentColor" 
          fillOpacity="0.15" 
          stroke="currentColor" 
          strokeWidth="0.8" 
          className="animate-bloom-leaf"
          style={{ animationDelay: '0.4s', opacity: 0 }}
        />
        <path 
          d="M50 62C60 58 65 65 60 70C55 75 50 70 50 62Z" 
          fill="currentColor" 
          fillOpacity="0.15" 
          stroke="currentColor" 
          strokeWidth="0.8" 
          className="animate-bloom-leaf"
          style={{ animationDelay: '0.6s', opacity: 0 }}
        />

        {/* The Blooming Flower - Multi-layered petals */}
        <g className="animate-bloom-petal" style={{ animationDelay: '1s', opacity: 0, filter: 'url(#glow)' }}>
          {/* Outer Layer Petals - Opening wide */}
          <path d="M50 48C30 48 25 35 35 22C40 15 60 15 65 22C75 35 70 48 50 48Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="0.6" />
          
          {/* Secondary Layer - Delicate petals */}
          <path d="M50 48C38 48 35 40 40 32C44 26 56 26 60 32C65 40 62 48 50 48Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="0.6" />
          <path d="M50 48C45 48 42 45 42 40C42 36 58 36 58 40C58 45 55 48 50 48Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="0.6" />

          {/* Core Bud - Reaching upwards */}
          <path d="M50 40C48 40 46 38 46 35C46 32 54 32 54 35C54 38 52 40 50 40Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="0.6" />
          
          {/* Detail lines for depth */}
          <path d="M44 34C44 34 47 30 50 30C53 30 56 34 56 34" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" opacity="0.6" />
          <path d="M48 38C48 38 49 36 50 36C51 36 52 38 52 38" stroke="currentColor" strokeWidth="0.4" strokeLinecap="round" opacity="0.4" />
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
