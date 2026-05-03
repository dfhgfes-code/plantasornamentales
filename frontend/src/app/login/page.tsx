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
            {/* Rosa decorativa SVG simple */}
            <motion.div
              className="inline-block mb-5"
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="22" r="21" stroke="rgba(244,114,182,0.3)" strokeWidth="1"/>
                {[0,60,120,180,240,300].map((a,i) => (
                  <ellipse key={i}
                    cx={22 + Math.sin(a*Math.PI/180)*9}
                    cy={22 - Math.cos(a*Math.PI/180)*9}
                    rx="5" ry="8"
                    fill="rgba(244,114,182,0.55)"
                    transform={`rotate(${a} ${22 + Math.sin(a*Math.PI/180)*9} ${22 - Math.cos(a*Math.PI/180)*9})`}
                  />
                ))}
                <circle cx="22" cy="22" r="5" fill="rgba(251,191,36,0.7)" />
                <circle cx="22" cy="22" r="2.5" fill="rgba(245,158,11,0.9)" />
              </svg>
            </motion.div>

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
