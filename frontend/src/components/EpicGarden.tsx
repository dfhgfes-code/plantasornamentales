'use client';
import { motion } from 'framer-motion';

const RosePetal = ({ d, color, delay, rotate }: { d: string, color: string, delay: number, rotate: number }) => (
  <motion.path
    d={d}
    fill={color}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 0.8 }}
    transition={{ duration: 3, delay, ease: [0.16, 1, 0.3, 1] }}
    style={{ transformOrigin: '50% 50%', rotate }}
  />
);

const EpicRose = ({ x, y, delay, scale = 1 }: { x: string, y: string, delay: number, scale?: number }) => (
  <motion.div 
    className="absolute pointer-events-none"
    style={{ left: x, top: y, scale }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 2, delay }}
  >
    <svg width="300" height="300" viewBox="0 0 100 100" filter="url(#glow)">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#e11d48" />
        </radialGradient>
      </defs>
      
      {/* Tallo */}
      <motion.path
        d="M50 100 Q45 80 50 60"
        stroke="#065f46"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay }}
      />
      
      {/* Capas de Pétalos */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <RosePetal
          key={`p1-${i}`}
          d="M50 55 C70 35 60 15 50 15 C40 15 30 35 50 55Z"
          color="url(#grad1)"
          delay={delay + 1 + i * 0.2}
          rotate={angle}
        />
      ))}
      {[30, 90, 150, 210, 270, 330].map((angle, i) => (
        <RosePetal
          key={`p2-${i}`}
          d="M50 55 C65 40 55 25 50 25 C45 25 35 40 50 55Z"
          color="#f43f5e"
          delay={delay + 2 + i * 0.2}
          rotate={angle}
        />
      ))}
    </svg>
  </motion.div>
);

export function EpicGarden() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <EpicRose x="-5%" y="10%" delay={0.5} scale={1.2} />
      <EpicRose x="75%" y="60%" delay={1.5} scale={1.5} />
      <EpicRose x="60%" y="-10%" delay={2.5} scale={1} />
      <EpicRose x="-10%" y="70%" delay={3.5} scale={1.3} />
    </div>
  );
}
