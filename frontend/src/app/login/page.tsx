'use client';
import { useState, useEffect } from 'react';
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

/* ─── Flor SVG animada ─────────────────────────────────────── */
function AnimatedFlower({
  x, y, delay, size = 1, color1, color2, stemColor,
}: {
  x: string; y: string; delay: number; size?: number;
  color1: string; color2: string; stemColor: string;
}) {
  const petals = [0, 60, 120, 180, 240, 300];
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.3, y: 40 }}
      animate={{ opacity: 1, scale: size, y: 0 }}
      transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg width="90" height="130" viewBox="0 0 90 130" overflow="visible">
        {/* Tallo */}
        <motion.path
          d="M45 130 Q40 100 45 70"
          stroke={stemColor} strokeWidth="2.5" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: delay + 0.2 }}
        />
        {/* Hoja */}
        <motion.path
          d="M44 100 Q25 88 30 75 Q40 80 44 100Z"
          fill={stemColor} opacity="0.8"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ duration: 0.7, delay: delay + 0.9, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ transformOrigin: '44px 100px' }}
        />
        {/* Pétalos exteriores */}
        {petals.map((angle, i) => (
          <motion.ellipse
            key={`o${i}`} cx="45" cy="45" rx="10" ry="22"
            fill={color1} opacity="0.85"
            transform={`rotate(${angle} 45 45) translate(0 -18)`}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: delay + 1.0 + i * 0.07, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ transformOrigin: '45px 45px' }}
          />
        ))}
        {/* Pétalos interiores */}
        {petals.map((angle, i) => (
          <motion.ellipse
            key={`i${i}`} cx="45" cy="45" rx="7" ry="15"
            fill={color2} opacity="0.9"
            transform={`rotate(${angle + 30} 45 45) translate(0 -12)`}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 1.5 + i * 0.06, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ transformOrigin: '45px 45px' }}
          />
        ))}
        {/* Centro */}
        <motion.circle
          cx="45" cy="45" r="9" fill="#fbbf24"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: delay + 2.0, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ transformOrigin: '45px 45px' }}
        />
        <motion.circle
          cx="45" cy="45" r="5" fill="#f59e0b"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: delay + 2.2 }}
          style={{ transformOrigin: '45px 45px' }}
        />
      </svg>
    </motion.div>
  );
}

/* ─── Pétalo flotante ──────────────────────────────────────── */
function FallingPetal({ x, delay, color }: { x: string; delay: number; color: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: '-20px' }}
      animate={{ y: ['0vh', '110vh'], x: [0, 30, -20, 15, -10], rotate: [0, 180, 360], opacity: [0, 0.7, 0.6, 0] }}
      transition={{ duration: 9 + Math.random() * 4, delay, repeat: Infinity, repeatDelay: 6 + Math.random() * 8, ease: 'easeInOut' }}
    >
      <svg width="14" height="20" viewBox="0 0 14 20">
        <ellipse cx="7" cy="10" rx="5" ry="9" fill={color} opacity="0.75" transform="rotate(15 7 10)" />
      </svg>
    </motion.div>
  );
}

/* ─── Página ───────────────────────────────────────────────── */
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
      toast.success(`¡Bienvenida, ${user.firstName}! 🌹`);
      router.push(user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/perfil');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const flowers = [
    { x: '5%',  y: '30%', delay: 0.2, size: 1.1, color1: '#f9a8d4', color2: '#ec4899', stemColor: '#4a7c59' },
    { x: '18%', y: '55%', delay: 0.7, size: 0.85,color1: '#fda4af', color2: '#f43f5e', stemColor: '#3d6b4a' },
    { x: '32%', y: '20%', delay: 1.2, size: 0.75,color1: '#c4b5fd', color2: '#8b5cf6', stemColor: '#4a7c59' },
    { x: '48%', y: '60%', delay: 0.4, size: 1.0, color1: '#fed7aa', color2: '#f97316', stemColor: '#3d6b4a' },
    { x: '62%', y: '25%', delay: 1.5, size: 0.9, color1: '#fbcfe8', color2: '#db2777', stemColor: '#4a7c59' },
    { x: '75%', y: '50%', delay: 0.9, size: 1.15,color1: '#f9a8d4', color2: '#be185d', stemColor: '#3d6b4a' },
    { x: '88%', y: '35%', delay: 1.8, size: 0.8, color1: '#fde68a', color2: '#f59e0b', stemColor: '#4a7c59' },
  ];

  const petals = [
    { x: '10%', delay: 0,   color: '#fda4af' },
    { x: '25%', delay: 2.5, color: '#f9a8d4' },
    { x: '40%', delay: 5,   color: '#c4b5fd' },
    { x: '55%', delay: 1.5, color: '#fbcfe8' },
    { x: '70%', delay: 3.5, color: '#fda4af' },
    { x: '82%', delay: 7,   color: '#f9a8d4' },
    { x: '92%', delay: 4,   color: '#fde68a' },
  ];

  return (
    <>
      <style>{`
        .login-left {
          background: linear-gradient(145deg, #1a0a0f 0%, #2d0f1a 40%, #1f0d15 70%, #0f0608 100%);
        }
        .login-right {
          background: #fafafa;
        }
        .field-box {
          background: #f5f5f5;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .field-box:focus-within {
          background: #fff;
          border-color: #f472b6;
          box-shadow: 0 0 0 3px rgba(244,114,182,0.12);
        }
        .submit-btn {
          background: #111;
          border-radius: 12px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
          background: #1f1f1f;
          box-shadow: 0 8px 30px rgba(0,0,0,0.25);
          transform: translateY(-1px);
        }
        .submit-btn:active:not(:disabled) { transform: scale(0.98); }
        .gold-line {
          background: linear-gradient(90deg, transparent, #d4af37, transparent);
          height: 1px;
        }
      `}</style>

      <div className="min-h-screen flex flex-col lg:flex-row">

        {/* ══ LADO IZQUIERDO — jardín oscuro de lujo ══ */}
        <div className="login-left relative lg:w-1/2 min-h-[320px] lg:min-h-screen overflow-hidden flex flex-col items-center justify-center">

          {/* Flores animadas */}
          {flowers.map((f, i) => <AnimatedFlower key={i} {...f} />)}

          {/* Pétalos cayendo */}
          {petals.map((p, i) => <FallingPetal key={i} {...p} />)}

          {/* Texto sobre el jardín */}
          <motion.div
            className="relative z-10 text-center px-8 mt-8 lg:mt-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 2.5 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-400 mb-4">
              Boutique Floral de Lujo
            </p>
            <h2
              className="text-3xl lg:text-4xl text-white leading-snug"
              style={{ fontFamily: "Georgia, serif", fontStyle: 'italic' }}
            >
              Donde cada flor<br />cuenta una historia
            </h2>
            <div className="gold-line w-24 mx-auto mt-5" />
            <p className="text-white/40 text-xs mt-4 tracking-wider">
              Flores frescas · Suscripciones · Entregas a domicilio
            </p>
          </motion.div>
        </div>

        {/* ══ LADO DERECHO — formulario limpio ══ */}
        <div className="login-right lg:w-1/2 flex items-center justify-center px-6 py-12 lg:py-0">
          <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Logo */}
            <div className="mb-10">
              <h1
                className="text-4xl text-gray-900"
                style={{ fontFamily: "Georgia, serif", fontStyle: 'italic' }}
              >
                Janneth Acevedo
              </h1>
              <div className="gold-line w-16 mt-3 mb-1" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500 mt-2">
                Boutique Floral
              </p>
            </div>

            {/* Encabezado */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Bienvenida de vuelta
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Ingresa a tu cuenta para continuar
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Correo electrónico
                </label>
                <div className="field-box">
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    icon={<Mail className="w-4 h-4 text-gray-400" />}
                    className="bg-transparent border-0 h-12 focus:ring-0 text-gray-900 placeholder:text-gray-300 text-sm"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Contraseña
                </label>
                <div className="field-box">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4 text-gray-400" />}
                    className="bg-transparent border-0 h-12 focus:ring-0 text-gray-900 placeholder:text-gray-300 text-sm"
                    error={errors.password?.message}
                    {...register('password')}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="submit-btn w-full h-12 text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Separador */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-300 font-medium">o</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Registro */}
            <p className="text-sm text-gray-500 text-center">
              ¿Nueva en la boutique?{' '}
              <Link href="/registro" className="font-semibold text-gray-900 hover:text-rose-600 transition-colors border-b border-gray-200 hover:border-rose-400 pb-0.5">
                Regístrate aquí
              </Link>
            </p>

            {/* Pie */}
            <p className="text-[10px] text-gray-300 text-center mt-10 uppercase tracking-widest">
              © 2025 Janneth Acevedo · Todos los derechos reservados
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
