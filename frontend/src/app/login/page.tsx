'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, ArrowRight, Flower2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { Input } from '@/components/ui/Input';
import { EpicGarden } from '@/components/EpicGarden';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

type FormData = z.infer<typeof schema>;

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
      toast.success(`¡Bienvenida al jardín, ${user.firstName}! 🌹`);
      router.push(user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/perfil');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        .login-bg {
          background: linear-gradient(160deg,
            #fff0f5 0%,
            #fce7f3 25%,
            #fdf4ff 50%,
            #fff1f2 75%,
            #fef9c3 100%
          );
          background-size: 400% 400%;
          animation: gradient-shift 12s ease infinite;
        }
        @keyframes gradient-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 8px 60px rgba(244,114,182,0.12), 0 2px 20px rgba(0,0,0,0.06); }
          50%       { box-shadow: 0 8px 80px rgba(244,114,182,0.22), 0 2px 20px rgba(0,0,0,0.06); }
        }
        .card-glow {
          animation: pulse-glow 5s ease-in-out infinite;
        }
        .luxury-card {
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(28px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.7);
        }
        .btn-rose {
          background: linear-gradient(135deg, #e11d48 0%, #be185d 60%, #9f1239 100%);
          transition: filter 0.25s ease, transform 0.15s ease, box-shadow 0.25s ease;
        }
        .btn-rose:hover:not(:disabled) {
          filter: brightness(1.1);
          box-shadow: 0 10px 36px rgba(190,24,93,0.40);
          transform: translateY(-1px);
        }
        .btn-rose:active:not(:disabled) { transform: scale(0.97); }
        .input-wrap {
          background: rgba(255,255,255,0.55);
          border: 1.5px solid rgba(244,114,182,0.22);
          border-radius: 14px;
          transition: background 0.25s, border-color 0.25s, box-shadow 0.25s;
        }
        .input-wrap:focus-within {
          background: rgba(255,255,255,0.95);
          border-color: rgba(236,72,153,0.45);
          box-shadow: 0 0 0 4px rgba(244,114,182,0.10);
        }
        .divider {
          background: linear-gradient(90deg, transparent, rgba(244,114,182,0.35), transparent);
          height: 1px;
        }
      `}</style>

      {/* ── Fondo degradado animado (sin imagen) ── */}
      <div className="login-bg fixed inset-0 z-0" />

      {/* ── Círculos decorativos de fondo ── */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-72 h-72 rounded-full bg-pink-200/25 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full bg-fuchsia-100/30 blur-3xl" />
      </div>

      {/* ── Jardín animado ── */}
      <EpicGarden />

      {/* ── Contenido ── */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-16 sm:py-20">

        {/* Marca */}
        <motion.div
          className="text-center mb-8 sm:mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/80 shadow-md mb-4 border border-rose-100"
            animate={{ rotate: [0, 6, -6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Flower2 className="w-7 h-7 sm:w-8 sm:h-8 text-rose-500" />
          </motion.div>

          <h1
            className="text-4xl sm:text-5xl text-gray-900 leading-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic' }}
          >
            Janneth Acevedo
          </h1>

          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="divider w-10" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500">
              Boutique Floral de Lujo
            </p>
            <div className="divider w-10" />
          </div>
        </motion.div>

        {/* Tarjeta */}
        <motion.div
          className="w-full max-w-sm sm:max-w-[420px]"
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="luxury-card card-glow rounded-[2rem] sm:rounded-[2.5rem] p-7 sm:p-10 relative overflow-hidden">

            {/* Destellos internos */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-rose-200/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-pink-100/20 rounded-full blur-3xl pointer-events-none" />

            {/* Encabezado */}
            <div className="text-center mb-7 relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
                Bienvenida de vuelta
              </h2>
              <p className="text-gray-400 mt-1.5 text-sm">
                Tu espacio personal en nuestro jardín 🌸
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
                  Correo electrónico
                </label>
                <div className="input-wrap">
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    icon={<Mail className="w-4 h-4 text-rose-400" />}
                    className="bg-transparent border-0 rounded-[13px] h-12 focus:ring-0 focus:outline-none text-gray-800 placeholder:text-gray-300 text-sm"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>
              </motion.div>

              {/* Contraseña */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.85 }}
              >
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
                  Contraseña
                </label>
                <div className="input-wrap">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4 text-rose-400" />}
                    className="bg-transparent border-0 rounded-[13px] h-12 focus:ring-0 focus:outline-none text-gray-800 placeholder:text-gray-300 text-sm"
                    error={errors.password?.message}
                    {...register('password')}
                  />
                </div>
              </motion.div>

              {/* Botón */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="pt-1"
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-rose w-full h-13 rounded-2xl text-white font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed py-3.5"
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
              </motion.div>
            </form>

            {/* Separador */}
            <div className="flex items-center gap-3 my-5 relative z-10">
              <div className="flex-1 divider" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">o</span>
              <div className="flex-1 divider" />
            </div>

            {/* Registro */}
            <motion.div
              className="text-center relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <Link
                href="/registro"
                className="text-sm text-gray-500 hover:text-rose-600 transition-colors group"
              >
                ¿Nueva en la boutique?{' '}
                <span className="font-bold text-gray-800 group-hover:text-rose-600 border-b border-gray-300 group-hover:border-rose-400 pb-0.5 transition-all">
                  Regístrate aquí
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Pie */}
          <motion.p
            className="text-center text-[9px] font-black uppercase tracking-[0.45em] text-gray-300 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            Luxury Flower Boutique · Experiencias Reales
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}
