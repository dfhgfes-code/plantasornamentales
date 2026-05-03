'use client';

export function BloomingRose() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center mx-auto">
      {/* Definición de animaciones via CSS estándar */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes stemGrow {
          from { stroke-dashoffset: 50; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes petalBloom {
          0% { transform: scale(0) rotate(var(--angle)); opacity: 0; }
          100% { transform: scale(1) rotate(var(--angle)); opacity: 0.8; }
        }
        @keyframes centerPop {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
        }
      `}} />
      
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tallo */}
        <path 
          d="M50 95C50 95 48 80 50 70" 
          stroke="#15803d" 
          strokeWidth="3" 
          strokeLinecap="round"
          style={{ 
            strokeDasharray: 50, 
            strokeDashoffset: 50, 
            animation: 'stemGrow 0.8s ease-out forwards' 
          }}
        />
        
        {/* Hojas */}
        <path 
          d="M50 80C40 80 35 75 35 75" 
          stroke="#16a34a" 
          strokeWidth="2" 
          strokeLinecap="round"
          style={{ 
            strokeDasharray: 20, 
            strokeDashoffset: 20, 
            animation: 'stemGrow 0.6s ease-out 0.4s forwards' 
          }}
        />
        <path 
          d="M50 85C60 85 65 80 65 80" 
          stroke="#16a34a" 
          strokeWidth="2" 
          strokeLinecap="round"
          style={{ 
            strokeDasharray: 20, 
            strokeDashoffset: 20, 
            animation: 'stemGrow 0.6s ease-out 0.5s forwards' 
          }}
        />

        {/* Pétalos exteriores */}
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <path
            key={`outer-${i}`}
            d="M50 50C50 50 70 30 50 10C30 30 50 50 50 50Z"
            fill="#e11d48"
            style={{ 
              transformOrigin: '50% 50%',
              // @ts-ignore
              '--angle': `${angle}deg`,
              animation: `petalBloom 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${0.2 + i * 0.1}s forwards`,
              opacity: 0,
              transform: 'scale(0)'
            }}
          />
        ))}

        {/* Pétalos interiores */}
        {[36, 108, 180, 252, 324].map((angle, i) => (
          <path
            key={`inner-${i}`}
            d="M50 50C50 50 65 35 50 20C35 35 50 50 50 50Z"
            fill="#fb7185"
            style={{ 
              transformOrigin: '50% 50%',
              // @ts-ignore
              '--angle': `${angle}deg`,
              animation: `petalBloom 1s ease-out ${0.6 + i * 0.1}s forwards`,
              opacity: 0,
              transform: 'scale(0)'
            }}
          />
        ))}

        {/* Centro */}
        <circle 
          cx="50" 
          cy="50" 
          r="6" 
          fill="#be123c"
          style={{ 
            transformOrigin: '50% 50%',
            animation: 'centerPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 1.2s forwards',
            transform: 'scale(0)'
          }}
        />
      </svg>
      
      {/* Brillos flotantes */}
      {[
        { x: -15, y: -20, d: '2s' },
        { x: 15, y: -15, d: '2.5s' },
        { x: -10, y: 15, d: '3s' },
        { x: 10, y: 10, d: '2.2s' },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-rose-300 rounded-full"
          style={{ 
            left: '50%',
            top: '50%',
            marginLeft: p.x,
            marginTop: p.y,
            animation: `float ${p.d} ease-in-out infinite`,
            opacity: 0
          }}
        />
      ))}
    </div>
  );
}
