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

// Foto de rosas de alta calidad — Unsplash (libre de uso)
const BG_IMAGE = 'https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=1600&q=85&auto=format&fit=crop';

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
        @keyframes slow-zoom {
          from { transform: scale(1.0); }
          to   { transform: scale(1.07); }
        }
        .bg-zoom {
          animation: slow-zoom 20s ease-in-out infinite alternate;
        }
        .glass {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .input-field {
          background: #f9fafb !important;
          border: 1.5px solid #e5e7eb !important;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s !important;
        }
        .input-field:focus-within,
        .input-field input:focus {
          background: #fff !important;
          border-color: #f472b6 !important;
          box-shadow: 0 0 0 3px rgba(244,114,182,0.12) !important;
          outline: none !important;
        }
        .submit-btn {
          background: linear-gradient(135deg, #e11d48 0%, #9f1239 100%);
          transition: transform 0.15s, box-shadow 0.2s, filter 0.2s;
          box-shadow: 0 4px 18px rgba(225,29,72,0.30);
        }
        .submit-btn:hover:not(:disabled) {
          filter: brightness(1.08);
          box-shadow: 0 6px 28px rgba(225,29,72,0.45);
          transform: translateY(-1px);
        }
        .submit-btn:active:not(:disabled) { transform: scale(0.98); }
      `}</style>

      {/* ── Fondo fotográfico ── */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-zoom"
          style={{ backgroundImage: `url('${BG_IMAGE}')` }}
        />
        {/* Overlay degradado: oscuro abajo, más claro arriba */}
        <div className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.70) 100%)'
          }}
        />
      </div>

      {/* ── Contenido ── */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">

        {/* Marca */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[10px] font-black uppercase tracking-[0.55em] text-rose-300 mb-3">
            Boutique Floral de Lujo
          </p>
          <h1
            className="text-5xl sm:text-6xl text-white drop-shadow-lg"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: 'italic',
              textShadow: '0 2px 20px rgba(0,0,0,0.4)',
            }}
          >
            Janneth Acevedo
          </h1>
          {/* Línea dorada */}
          <div className="mx-auto mt-4"
            style={{
              width: 80,
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.9), transparent)',
            }}
          />
        </motion.div>

        {/* Tarjeta formulario */}
        <motion.div
          className="glass rounded-3xl w-full max-w-sm sm:max-w-[400px] overflow-hidden"
          style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.35)' }}
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Franja rosa superior */}
          <div className="h-1 w-full"
            style={{ background: 'linear-gradient(90deg, #f472b6, #e11d48, #f472b6)' }}
          />

          <div className="px-8 py-9 sm:px-10">
            {/* Encabezado */}
            <div className="mb-7">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Bienvenida de vuelta
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Ingresa a tu cuenta para continuar
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                  Correo electrónico
                </label>
                <div className="input-field rounded-xl overflow-hidden">
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    icon={<Mail className="w-4 h-4 text-gray-300" />}
                    className="bg-transparent border-0 h-11 focus:ring-0 text-gray-900 text-sm placeholder:text-gray-300"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                  Contraseña
                </label>
                <div className="input-field rounded-xl overflow-hidden">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4 text-gray-300" />}
                    className="bg-transparent border-0 h-11 focus:ring-0 text-gray-900 text-sm placeholder:text-gray-300"
                    error={errors.password?.message}
                    {...register('password')}
                  />
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="submit-btn w-full h-12 rounded-xl text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Ingresando…
                    </>
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
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] text-gray-300 font-medium">o</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Registro */}
            <p className="text-sm text-gray-400 text-center">
              ¿Nueva en la boutique?{' '}
              <Link href="/registro" className="font-bold text-rose-500 hover:text-rose-600 transition-colors">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Pie */}
        <motion.p
          className="text-center text-[10px] uppercase tracking-[0.4em] text-white/30 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          © 2025 Janneth Acevedo · Todos los derechos reservados
        </motion.p>
      </div>
    </>
  );
}
