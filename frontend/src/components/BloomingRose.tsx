'use client';

export function BloomingRose() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center mx-auto">
      <style jsx>{`
        @keyframes stemGrow {
          from { stroke-dashoffset: 30; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes petalBloom {
          0% { transform: scale(0) rotate(var(--rotate)); opacity: 0; }
          60% { transform: scale(1.1) rotate(var(--rotate)); opacity: 0.8; }
          100% { transform: scale(1) rotate(var(--rotate)); opacity: 0.8; }
        }
        @keyframes centerPop {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .stem {
          stroke-dasharray: 30;
          stroke-dashoffset: 30;
          animation: stemGrow 0.8s ease-out forwards;
        }
        .petal {
          transform-origin: 50px 50px;
          animation: petalBloom 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .center {
          transform-origin: 50px 50px;
          animation: centerPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 1s forwards;
          transform: scale(0);
        }
        .sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
      `}</style>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tallo */}
        <path d="M50 95C50 95 48 80 50 70" stroke="#15803d" strokeWidth="3" strokeLinecap="round" className="stem" />
        
        {/* Hojas */}
        <path d="M50 80C40 80 35 75 35 75" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" style={{ animationDelay: '0.4s' }} className="stem" />
        <path d="M50 85C60 85 65 80 65 80" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" style={{ animationDelay: '0.5s' }} className="stem" />

        {/* Pétalos exteriores */}
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <path
            key={`outer-${i}`}
            d="M50 50C50 50 70 30 50 10C30 30 50 50 50 50Z"
            fill="#e11d48"
            className="petal"
            style={{ '--rotate': `${angle}deg`, animationDelay: `${0.2 + i * 0.1}s` } as any}
          />
        ))}

        {/* Pétalos interiores */}
        {[36, 108, 180, 252, 324].map((angle, i) => (
          <path
            key={`mid-${i}`}
            d="M50 50C50 50 65 35 50 20C35 35 50 50 50 50Z"
            fill="#fb7185"
            className="petal"
            style={{ '--rotate': `${angle}deg`, animationDelay: `${0.6 + i * 0.1}s` } as any}
          />
        ))}

        {/* Centro */}
        <circle cx="50" cy="50" r="6" fill="#be123c" className="center" />
      </svg>
      
      {/* Brillos (CSS Nativo) */}
      {[
        { x: -20, y: -25, d: '0s' },
        { x: 25, y: -15, d: '0.5s' },
        { x: -15, y: 20, d: '1s' },
        { x: 20, y: 15, d: '1.5s' },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-rose-300 rounded-full sparkle"
          style={{ 
            left: '50%',
            top: '50%',
            marginLeft: p.x,
            marginTop: p.y,
            animationDelay: p.d
          }}
        />
      ))}
    </div>
  );
}
