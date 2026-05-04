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
      {/* Rose Bud SVG */}
      <svg 
        width={currentSize.icon} 
        height={currentSize.icon} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "transition-transform duration-700 group-hover:rotate-12",
          isLight ? "text-rose-200" : "text-rose-400"
        )}
      >
        <path d="M50 82C50 82 49 65 50 48" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M50 48C56 48 64 40 62 30C60 20 54 24 50 32C46 24 40 20 38 30C36 40 44 48 50 48Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 32C52 28 58 26 58 32C58 38 52 42 50 42C48 42 42 38 42 32C42 26 48 28 50 32Z" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 65C50 65 38 62 34 68C30 74 42 74 50 65Z" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 58C50 58 62 55 66 61C70 67 58 67 50 58Z" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className={cn("flex flex-col", horizontal ? "items-start" : "items-center")}>
        <h1 className={cn(
          "tracking-[0.05em] leading-none text-gray-800",
          currentSize.title,
          isLight ? "text-white" : ""
        )}
        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
        >
          Janneth Acevedo
        </h1>
        <div className="flex items-center gap-2 mt-1.5 w-full justify-center">
          <span className={cn("flex-1 h-[0.5px]", isLight ? "bg-white/20" : "bg-gray-200")} />
          <span className={cn(
            "font-sans uppercase tracking-[0.4em] font-medium whitespace-nowrap",
            currentSize.sub,
            isLight ? "text-rose-200/80" : "text-rose-400/80"
          )}>
            Plantas Ornamentales
          </span>
          <span className={cn("flex-1 h-[0.5px]", isLight ? "bg-white/20" : "bg-gray-200")} />
        </div>
      </div>
    </div>
  );
};
