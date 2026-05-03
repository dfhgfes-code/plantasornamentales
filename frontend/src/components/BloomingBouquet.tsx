'use client';

export function BloomingBouquet() {
  return (
    <div className="relative w-48 h-32 flex items-center justify-center mx-auto mb-8">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes stemGrow {
          from { stroke-dashoffset: 50; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes petalBloom {
          0% { transform: scale(0) rotate(var(--angle, 0deg)); opacity: 0; }
          100% { transform: scale(1) rotate(var(--angle, 0deg)); opacity: 0.9; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}} />

      {/* Flor 1: Girasol (Izquierda) */}
      <div className="absolute left-4 bottom-4 w-20 h-20" style={{ animation: 'float 4s ease-in-out infinite' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50 100 Q45 80 50 60" stroke="#15803d" strokeWidth="3" fill="none" className="stem" 
            style={{ strokeDasharray: 50, strokeDashoffset: 50, animation: 'stemGrow 1s ease-out forwards' }} />
          {[...Array(12)].map((_, i) => (
            <path key={i} d="M50 50 Q65 30 50 10 Q35 30 50 50" fill="#facc15" 
              style={{ 
                transformOrigin: '50% 50%', 
                // @ts-ignore
                '--angle': `${i * 30}deg`,
                animation: `petalBloom 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${0.8 + i * 0.05}s forwards`,
                opacity: 0, transform: 'scale(0)'
              }} />
          ))}
          <circle cx="50" cy="50" r="10" fill="#422006" 
            style={{ transformOrigin: '50% 50%', animation: 'petalBloom 0.5s ease-out 1.5s forwards', opacity: 0, transform: 'scale(0)' }} />
        </svg>
      </div>

      {/* Flor 2: Rosa (Centro - Principal) */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 w-24 h-24 z-10" style={{ animation: 'float 5s ease-in-out infinite reverse' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50 100 C50 80 48 70 50 55" stroke="#15803d" strokeWidth="4" fill="none"
            style={{ strokeDasharray: 50, strokeDashoffset: 50, animation: 'stemGrow 1s ease-out forwards' }} />
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <path key={`r1-${i}`} d="M50 50C50 50 70 30 50 10C30 30 50 50 50 50Z" fill="#e11d48" 
              style={{ 
                transformOrigin: '50% 50%', 
                // @ts-ignore
                '--angle': `${angle}deg`,
                animation: `petalBloom 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${0.5 + i * 0.1}s forwards`,
                opacity: 0, transform: 'scale(0)'
              }} />
          ))}
          {[36, 108, 180, 252, 324].map((angle, i) => (
            <path key={`r2-${i}`} d="M50 50C50 50 65 35 50 20C35 35 50 50 50 50Z" fill="#fb7185" 
              style={{ 
                transformOrigin: '50% 50%', 
                // @ts-ignore
                '--angle': `${angle}deg`,
                animation: `petalBloom 1s ease-out ${1 + i * 0.1}s forwards`,
                opacity: 0, transform: 'scale(0)'
              }} />
          ))}
          <circle cx="50" cy="50" r="6" fill="#be123c" 
            style={{ transformOrigin: '50% 50%', animation: 'petalBloom 0.5s ease-out 1.8s forwards', opacity: 0, transform: 'scale(0)' }} />
        </svg>
      </div>

      {/* Flor 3: Tulipán (Derecha) */}
      <div className="absolute right-4 bottom-4 w-16 h-16" style={{ animation: 'float 3.5s ease-in-out infinite 1s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50 100 Q55 85 50 65" stroke="#15803d" strokeWidth="3" fill="none"
            style={{ strokeDasharray: 50, strokeDashoffset: 50, animation: 'stemGrow 1s ease-out forwards' }} />
          <path d="M50 60 Q30 40 40 10 Q50 30 60 10 Q70 40 50 60" fill="#a855f7" 
            style={{ 
              transformOrigin: '50% 60px', 
              animation: 'petalBloom 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) 1.2s forwards',
              opacity: 0, transform: 'scale(0)'
            }} />
          <path d="M50 60 Q35 45 45 20 Q50 35 55 20 Q65 45 50 60" fill="#d8b4fe" 
            style={{ 
              transformOrigin: '50% 60px', 
              animation: 'petalBloom 1s ease-out 1.6s forwards',
              opacity: 0, transform: 'scale(0)'
            }} />
        </svg>
      </div>
    </div>
  );
}
