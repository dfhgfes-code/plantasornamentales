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
      {/* Photorealistic Rose - High-End Realistic Branding */}
      <div className="relative overflow-hidden flex items-center justify-center" style={{ width: currentSize.icon, height: currentSize.icon }}>
        <img 
          src="/images/rose_real.png" 
          alt="Rose" 
          className={cn(
            "w-full h-full object-contain animate-real-bloom",
            isLight ? "brightness-110 contrast-110" : ""
          )}
        />
        
        {/* Subtle radial glow to blend with the realistic image */}
        <div className={cn(
          "absolute inset-0 rounded-full blur-xl opacity-30 -z-10 animate-soft-glow",
          isLight ? "bg-white" : "bg-rose-100"
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
