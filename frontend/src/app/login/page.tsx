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
import { Button } from '@/components/ui/Button';
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
        @keyframes slow-zoom {
          from { transform: scale(1.0); }
          to   { transform: scale(1.08); }
        }
        @keyframes shimmer-border {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 40px 0px rgba(244,114,182,0.15); }
          50%       { box-shadow: 0 0 80px 10px rgba(244,114,182,0.30); }
        }
        .bg-zoom {
          animation: slow-zoom 30s ease-in-out infinite alternate;
        }
        .card-glow {
          animation: pulse-glow 5s ease-in-out infinite;
        }
        .luxury-card {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.6);
        }
        .btn-gradient {
          background: linear-gradient(135deg, #be185d 0%, #9f1239 50%, #881337 100%);
          background-size: 200% 200%;
          transition: background-position 0.4s ease, transform 0.15s ease, box-shadow 0.3s ease;
        }
        .btn-gradient:hover {
          background-position: right center;
          box-shadow: 0 12px 40px rgba(190,24,93,0.45);
          transform: translateY(-1px);
        }
        .btn-gradient:active { transform: scale(0.97); }
        .input-luxury {
          background: rgba(255,255,255,0.5) !important;
          border: 1.5px solid rgba(244,114,182,0.25) !important;
          transition: all 0.3s ease !important;
        }
        .input-luxury:focus-within {
          background: rgba(255,255,255,0.9) !important;
          border-color: rgba(236,72,153,0.5) !important;
          box-shadow: 0 0 0 4px rgba(244,114,182,0.12) !important;
        }
        .divider-line {
          background: linear-gradient(90deg, transparent, rgba(244,114,182,0.4), transparent);
        }
      `}</style>

      {/* ── Fondo fotográfico ── */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-zoom"
          style={{ backgroundImage: "url('/images/boutique-bg.png')" }}
        />
        {/* Overlay degradado suave */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/60 via-white/30 to-pink-50/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-white/20" />
      </div>

      {/* ── Jardín animado (flores creciendo) ── */}
      <EpicGarden />

      {/* ── Contenido principal ── */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-24">

        {/* Logo / Marca */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Ícono floral */}
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/80 shadow-lg mb-5 border border-rose-100"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Flower2 className="w-8 h-8 text-rose-500" />
          </motion.div>

          <h1
            className="text-5xl md:text-6xl text-gray-900 tracking-tight leading-none"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic' }}
          >
            Janneth Acevedo
          </h1>

          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12 divider-line" />
            <p className="text-[10px] font-black uppercase tracking-[0.45em] text-rose-500">
              Boutique Floral de Lujo
            </p>
            <div className="h-px w-12 divider-line" />
          </div>
        </motion.div>

        {/* Tarjeta de login */}
        <motion.div
          className="w-full max-w-[440px]"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="luxury-card card-glow rounded-[2.5rem] p-10 md:p-12 relative overflow-hidden">

            {/* Destellos decorativos internos */}
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-rose-300/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-pink-200/15 rounded-full blur-3xl pointer-events-none" />

            {/* Encabezado del formulario */}
            <div className="text-center mb-9 relative z-10">
              <motion.h2
                className="text-2xl font-bold text-gray-800 tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Bienvenida de vuelta
              </motion.h2>
              <motion.p
                className="text-gray-400 mt-2 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Tu espacio personal en nuestro jardín 🌸
              </motion.p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
              >
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                  Correo electrónico
                </label>
                <div className="input-luxury rounded-2xl overflow-hidden">
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    icon={<Mail className="w-4 h-4 text-rose-400" />}
                    className="bg-transparent border-0 rounded-2xl h-13 focus:ring-0 focus:outline-none pl-11 text-gray-800 placeholder:text-gray-300"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>
              </motion.div>

              {/* Contraseña */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.15 }}
              >
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                  Contraseña
                </label>
                <div className="input-luxury rounded-2xl overflow-hidden">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4 text-rose-400" />}
                    className="bg-transparent border-0 rounded-2xl h-13 focus:ring-0 focus:outline-none pl-11 text-gray-800 placeholder:text-gray-300"
                    error={errors.password?.message}
                    {...register('password')}
                  />
                </div>
              </motion.div>

              {/* Botón */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="pt-2"
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gradient w-full h-14 rounded-2xl text-white font-bold text-base tracking-wide flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Ingresando…
                    </span>
                  ) : (
                    <>
                      Ingresar al Jardín
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            {/* Separador */}
            <div className="flex items-center gap-3 my-7 relative z-10">
              <div className="flex-1 h-px divider-line" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">o</span>
              <div className="flex-1 h-px divider-line" />
            </div>

            {/* Registro */}
            <motion.div
              className="text-center relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
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

          {/* Pie de página */}
          <motion.p
            className="text-center text-[9px] font-black uppercase tracking-[0.5em] text-gray-300 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            Luxury Flower Boutique · Experiencias Reales
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}
