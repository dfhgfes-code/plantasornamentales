'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});
type FormData = z.infer<typeof schema>;

/* ── Canvas de partículas de pétalos ─────────────────────── */
function PetalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#f9a8d4', '#fda4af', '#fbcfe8', '#fce7f3', '#e9d5ff', '#fef3c7'];

    const petals = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: 4 + Math.random() * 8,
      speedY: 0.4 + Math.random() * 0.8,
      speedX: (Math.random() - 0.5) * 0.6,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      opacity: 0.3 + Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.005 + Math.random() * 0.01,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach(p => {
        p.y += p.speedY;
        p.sway += p.swaySpeed;
        p.x += p.speedX + Math.sin(p.sway) * 0.5;
        p.rotation += p.rotSpeed;
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none"
    />
  );
}

/* ── Página ───────────────────────────────────────────────── */
export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      toast.success(`Bienvenida, ${user.firstName} 🌹`);
      router.push(user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/perfil');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Correo o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        .login-bg {
          background:
            radial-gradient(ellipse 80% 60% at 20% 80%, rgba(190,24,93,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(139,92,246,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 70% 70% at 50% 50%, rgba(253,164,175,0.08) 0%, transparent 70%),
            linear-gradient(160deg, #0f0a0c 0%, #1a0d12 35%, #160b10 65%, #0a0608 100%);
        }
        .glass-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.10);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .field {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
        }
        .field:focus-within {
          background: rgba(255,255,255,0.10);
          border-color: rgba(244,114,182,0.55);
          box-shadow: 0 0 0 3px rgba(244,114,182,0.10);
        }
        .field input {
          color: #fff !important;
        }
        .field input::placeholder { color: rgba(255,255,255,0.25) !important; }
        .field svg { color: rgba(255,255,255,0.35) !important; }
        .btn-main {
          background: linear-gradient(135deg, #be185d, #9f1239);
          border-radius: 10px;
          transition: filter 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .btn-main:hover:not(:disabled) {
          filter: brightness(1.15);
          box-shadow: 0 8px 32px rgba(190,24,93,0.45);
          transform: translateY(-1px);
        }
        .btn-main:active:not(:disabled) { transform: scale(0.98); }
        .gold-bar {
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent);
          height: 1px;
        }
        .label-text { color: rgba(255,255,255,0.45); }
        .link-register { color: rgba(255,255,255,0.45); }
        .link-register span { color: rgba(255,255,255,0.85); border-bottom: 1px solid rgba(255,255,255,0.2); }
        .link-register:hover span { color: #f472b6; border-color: #f472b6; }
      `}</style>

      {/* Fondo oscuro */}
      <div className="login-bg fixed inset-0 z-0" />

      {/* Pétalos canvas */}
      <PetalCanvas />

      {/* Contenido */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
        <motion.div
          className="w-full max-w-[400px]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >

          {/* Marca */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            {/* ── Arreglo floral que florece ── */}
            <div className="flex justify-center mb-6">
              <svg width="220" height="130" viewBox="0 0 220 130" fill="none" overflow="visible">

                {/* ── Tallos principales ── */}
                <motion.path d="M110 128 Q108 100 110 72" stroke="#4a7c59" strokeWidth="2" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.2 }} />
                <motion.path d="M110 110 Q88 95 72 78" stroke="#4a7c59" strokeWidth="1.8" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.5 }} />
                <motion.path d="M110 110 Q132 95 148 78" stroke="#4a7c59" strokeWidth="1.8" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.5 }} />
                <motion.path d="M110 100 Q80 88 58 68" stroke="#3d6b4a" strokeWidth="1.5" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.7 }} />
                <motion.path d="M110 100 Q140 88 162 68" stroke="#3d6b4a" strokeWidth="1.5" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.7 }} />
                <motion.path d="M110 95 Q95 75 90 52" stroke="#4a7c59" strokeWidth="1.4" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.9 }} />
                <motion.path d="M110 95 Q125 75 130 52" stroke="#4a7c59" strokeWidth="1.4" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.9 }} />

                {/* ── Hojas ── */}
                {[
                  { d: "M110 108 Q96 100 98 90 Q106 94 110 108Z", delay: 1.1 },
                  { d: "M110 108 Q124 100 122 90 Q114 94 110 108Z", delay: 1.2 },
                  { d: "M90 80 Q78 72 82 62 Q90 68 90 80Z", delay: 1.4 },
                  { d: "M130 80 Q142 72 138 62 Q130 68 130 80Z", delay: 1.4 },
                ].map((leaf, i) => (
                  <motion.path key={i} d={leaf.d} fill="#5a9e6f" opacity="0.75"
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.75 }}
                    transition={{ duration: 0.6, delay: leaf.delay, ease: [0.34,1.56,0.64,1] }}
                    style={{ transformOrigin: '110px 108px' }} />
                ))}

                {/* ── Rosa central grande ── */}
                {[0,51,102,153,204,255,306].map((a, i) => (
                  <motion.ellipse key={`rc${i}`}
                    cx={110 + Math.sin(a*Math.PI/180)*13} cy={72 - Math.cos(a*Math.PI/180)*13}
                    rx="7" ry="14"
                    fill={i % 2 === 0 ? '#f9a8d4' : '#ec4899'} opacity="0.88"
                    transform={`rotate(${a} ${110 + Math.sin(a*Math.PI/180)*13} ${72 - Math.cos(a*Math.PI/180)*13})`}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.3 + i*0.07, ease: [0.34,1.56,0.64,1] }}
                    style={{ transformOrigin: `${110 + Math.sin(a*Math.PI/180)*13}px ${72 - Math.cos(a*Math.PI/180)*13}px` }}
                  />
                ))}
                {[0,60,120,180,240,300].map((a, i) => (
                  <motion.ellipse key={`ri${i}`}
                    cx={110 + Math.sin(a*Math.PI/180)*7} cy={72 - Math.cos(a*Math.PI/180)*7}
                    rx="5" ry="10"
                    fill="#be185d" opacity="0.9"
                    transform={`rotate(${a} ${110 + Math.sin(a*Math.PI/180)*7} ${72 - Math.cos(a*Math.PI/180)*7})`}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.8 + i*0.06, ease: [0.34,1.56,0.64,1] }}
                    style={{ transformOrigin: `${110 + Math.sin(a*Math.PI/180)*7}px ${72 - Math.cos(a*Math.PI/180)*7}px` }}
                  />
                ))}
                <motion.circle cx="110" cy="72" r="7" fill="#fbbf24"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ duration: 0.35, delay: 2.2, ease: [0.34,1.56,0.64,1] }}
                  style={{ transformOrigin: '110px 72px' }} />
                <motion.circle cx="110" cy="72" r="3.5" fill="#f59e0b"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ duration: 0.25, delay: 2.4 }}
                  style={{ transformOrigin: '110px 72px' }} />

                {/* ── Flor izquierda media (lila) ── */}
                {[0,72,144,216,288].map((a, i) => (
                  <motion.ellipse key={`lm${i}`}
                    cx={72 + Math.sin(a*Math.PI/180)*9} cy={78 - Math.cos(a*Math.PI/180)*9}
                    rx="5" ry="10"
                    fill={i%2===0 ? '#c4b5fd' : '#a78bfa'} opacity="0.85"
                    transform={`rotate(${a} ${72 + Math.sin(a*Math.PI/180)*9} ${78 - Math.cos(a*Math.PI/180)*9})`}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ duration: 0.45, delay: 1.5 + i*0.08, ease: [0.34,1.56,0.64,1] }}
                    style={{ transformOrigin: `${72 + Math.sin(a*Math.PI/180)*9}px ${78 - Math.cos(a*Math.PI/180)*9}px` }}
                  />
                ))}
                <motion.circle cx="72" cy="78" r="5" fill="#fde68a"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.95, ease: [0.34,1.56,0.64,1] }}
                  style={{ transformOrigin: '72px 78px' }} />

                {/* ── Flor derecha media (durazno) ── */}
                {[0,72,144,216,288].map((a, i) => (
                  <motion.ellipse key={`rm${i}`}
                    cx={148 + Math.sin(a*Math.PI/180)*9} cy={78 - Math.cos(a*Math.PI/180)*9}
                    rx="5" ry="10"
                    fill={i%2===0 ? '#fed7aa' : '#fb923c'} opacity="0.85"
                    transform={`rotate(${a} ${148 + Math.sin(a*Math.PI/180)*9} ${78 - Math.cos(a*Math.PI/180)*9})`}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ duration: 0.45, delay: 1.5 + i*0.08, ease: [0.34,1.56,0.64,1] }}
                    style={{ transformOrigin: `${148 + Math.sin(a*Math.PI/180)*9}px ${78 - Math.cos(a*Math.PI/180)*9}px` }}
                  />
                ))}
                <motion.circle cx="148" cy="78" r="5" fill="#fde68a"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.95, ease: [0.34,1.56,0.64,1] }}
                  style={{ transformOrigin: '148px 78px' }} />

                {/* ── Flor izquierda pequeña (blanca/rosa) ── */}
                {[0,60,120,180,240,300].map((a, i) => (
                  <motion.ellipse key={`ls${i}`}
                    cx={58 + Math.sin(a*Math.PI/180)*7} cy={68 - Math.cos(a*Math.PI/180)*7}
                    rx="4" ry="8"
                    fill={i%2===0 ? '#fce7f3' : '#fbcfe8'} opacity="0.8"
                    transform={`rotate(${a} ${58 + Math.sin(a*Math.PI/180)*7} ${68 - Math.cos(a*Math.PI/180)*7})`}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.7 + i*0.07, ease: [0.34,1.56,0.64,1] }}
                    style={{ transformOrigin: `${58 + Math.sin(a*Math.PI/180)*7}px ${68 - Math.cos(a*Math.PI/180)*7}px` }}
                  />
                ))}
                <motion.circle cx="58" cy="68" r="4" fill="#fbbf24"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ duration: 0.25, delay: 2.1 }}
                  style={{ transformOrigin: '58px 68px' }} />

                {/* ── Flor derecha pequeña (roja) ── */}
                {[0,60,120,180,240,300].map((a, i) => (
                  <motion.ellipse key={`rs${i}`}
                    cx={162 + Math.sin(a*Math.PI/180)*7} cy={68 - Math.cos(a*Math.PI/180)*7}
                    rx="4" ry="8"
                    fill={i%2===0 ? '#fca5a5' : '#f87171'} opacity="0.8"
                    transform={`rotate(${a} ${162 + Math.sin(a*Math.PI/180)*7} ${68 - Math.cos(a*Math.PI/180)*7})`}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.7 + i*0.07, ease: [0.34,1.56,0.64,1] }}
                    style={{ transformOrigin: `${162 + Math.sin(a*Math.PI/180)*7}px ${68 - Math.cos(a*Math.PI/180)*7}px` }}
                  />
                ))}
                <motion.circle cx="162" cy="68" r="4" fill="#fbbf24"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ duration: 0.25, delay: 2.1 }}
                  style={{ transformOrigin: '162px 68px' }} />

                {/* ── Capullo izquierdo (rosa cerrado) ── */}
                <motion.ellipse cx="90" cy="52" rx="5" ry="10" fill="#f472b6" opacity="0.7"
                  initial={{ scale: 0, y: 8 }} animate={{ scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.6, ease: [0.34,1.56,0.64,1] }}
                  style={{ transformOrigin: '90px 52px' }} />
                <motion.ellipse cx="90" cy="52" rx="3" ry="7" fill="#db2777" opacity="0.8"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.8 }}
                  style={{ transformOrigin: '90px 52px' }} />

                {/* ── Capullo derecho ── */}
                <motion.ellipse cx="130" cy="52" rx="5" ry="10" fill="#c084fc" opacity="0.7"
                  initial={{ scale: 0, y: 8 }} animate={{ scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.6, ease: [0.34,1.56,0.64,1] }}
                  style={{ transformOrigin: '130px 52px' }} />
                <motion.ellipse cx="130" cy="52" rx="3" ry="7" fill="#9333ea" opacity="0.8"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.8 }}
                  style={{ transformOrigin: '130px 52px' }} />

                {/* ── Destellos de luz ── */}
                {[[110,72],[72,78],[148,78]].map(([cx,cy],i) => (
                  <motion.circle key={`gl${i}`} cx={cx} cy={cy} r="18"
                    fill="rgba(255,255,255,0.04)"
                    animate={{ r: [16, 22, 16], opacity: [0.04, 0.08, 0.04] }}
                    transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
                  />
                ))}
              </svg>
            </div>

            <h1
              className="text-[2.6rem] leading-none text-white"
              style={{ fontFamily: "Georgia, serif", fontStyle: 'italic', letterSpacing: '-0.01em' }}
            >
              Janneth Acevedo
            </h1>
            <div className="gold-bar w-20 mx-auto mt-4 mb-3" />
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-rose-400">
              Boutique Floral de Lujo
            </p>
          </motion.div>

          {/* Tarjeta */}
          <motion.div
            className="glass-card rounded-2xl p-8"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="mb-7">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Bienvenida de vuelta
              </h2>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Ingresa a tu cuenta para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label-text block text-[10px] font-bold uppercase tracking-widest mb-1.5">
                  Correo electrónico
                </label>
                <div className="field">
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    icon={<Mail className="w-4 h-4" />}
                    className="bg-transparent border-0 h-11 focus:ring-0 text-sm"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>
              </div>

              <div>
                <label className="label-text block text-[10px] font-bold uppercase tracking-widest mb-1.5">
                  Contraseña
                </label>
                <div className="field">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4" />}
                    className="bg-transparent border-0 h-11 focus:ring-0 text-sm"
                    error={errors.password?.message}
                    {...register('password')}
                  />
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-main w-full h-11 text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Ingresando…
                    </span>
                  ) : (
                    <>
                      Ingresar al Jardín
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>o</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            </div>

            <p className="link-register text-sm text-center transition-colors">
              ¿Nueva en la boutique?{' '}
              <Link href="/registro">
                <span className="font-semibold transition-colors pb-0.5">
                  Regístrate aquí
                </span>
              </Link>
            </p>
          </motion.div>

          <motion.p
            className="text-center text-[9px] uppercase tracking-[0.4em] mt-7"
            style={{ color: 'rgba(255,255,255,0.15)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            © 2025 Janneth Acevedo · Todos los derechos reservados
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}
