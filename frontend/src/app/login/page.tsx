'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';
import { Logo } from '@/components/ui/Logo';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

const schema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});
type FormData = z.infer<typeof schema>;

const GoogleLoginButton = ({ setLoading, setAuth, router }: {
  setLoading: (v: boolean) => void;
  setAuth: any;
  router: any;
}) => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await authApi.googleLogin({ token: tokenResponse.access_token });
        const { user, accessToken } = res.data.data;
        setAuth(user, accessToken);
        toast.success(`Bienvenido, ${user.firstName} 🌹`);
        router.push(user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/perfil');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error al iniciar sesión con Google');
      } finally {
        setLoading(false);
      }
    },
    onError: () => toast.error('Inicio de sesión con Google cancelado o fallido'),
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
    >
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="Google" />
      Continuar con Google
    </button>
  );
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      toast.success(`Bienvenido, ${user.firstName} 🌹`);
      router.push(user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/perfil');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Correo o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '606760776980-m49qk52hum9m39cb21puvnqsih5ubcc7.apps.googleusercontent.com'}>
      <div className="min-h-screen bg-[#fdfaf7] flex">

        {/* ── Panel izquierdo — solo visible en lg+ ── */}
        <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-shrink-0">
          <img
            src="/images/login_bg.png"
            alt="Janneth Acevedo"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ borderRadius: '0 40% 40% 0 / 0 50% 50% 0' }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"
            style={{ borderRadius: '0 40% 40% 0 / 0 50% 50% 0' }} />
          {/* Texto */}
          <div className="relative z-10 flex flex-col justify-center px-14 py-16 max-w-md">
            <h2 className="text-white font-bold leading-tight mb-5"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.2rem, 3vw, 3.5rem)' }}>
              Cada flor<br />cuenta una
            </h2>
            <span style={{
              fontFamily: "'Alex Brush', cursive",
              color: '#fca5a5',
              fontSize: 'clamp(2.5rem, 3.5vw, 4rem)',
              lineHeight: 1,
              display: 'block',
              marginTop: '-8px',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}>
              historia <Heart className="inline-block align-middle ml-2 text-rose-300" size={28} fill="#fca5a5" />
            </span>
            <div className="w-10 h-px bg-white/60 my-6" />
            <p className="text-white/80 text-base leading-relaxed">
              Ramos únicos para momentos inolvidables.
            </p>
          </div>
        </div>

        {/* ── Panel derecho — formulario ── */}
        <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm"
          >
            {/* Logo */}
            <div className="flex justify-center mb-7">
              <Logo size="lg" />
            </div>

            {/* Header */}
            <div className="text-center mb-7">
              <h1 className="text-2xl font-semibold text-gray-800 mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                Bienvenido
              </h1>
              <p className="text-gray-400 text-sm">Inicia sesión para continuar</p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" size={18} />
                  <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
                <div className="flex justify-end mt-1.5">
                  <Link href="/recuperar" className="text-xs text-rose-400 hover:text-rose-500 font-medium transition-colors">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              {/* Botón login */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rose-200 disabled:opacity-60 disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Entrando...
                  </span>
                ) : 'Iniciar sesión'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">o continúa con</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google */}
            <GoogleLoginButton setLoading={setLoading} setAuth={setAuth} router={router} />

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-6">
              ¿No tienes cuenta?{' '}
              <Link href="/contacto" className="text-rose-500 hover:text-rose-600 font-semibold transition-colors">
                Contáctanos
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
