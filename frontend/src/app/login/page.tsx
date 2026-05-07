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

const GoogleLoginButton = ({ setLoading, setAuth, router }: { setLoading: (v: boolean) => void, setAuth: any, router: any }) => {
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
    onError: () => {
      toast.error('Inicio de sesión con Google cancelado o fallido');
    }
  });

  return (
    <button className="btn-google" type="button" onClick={() => login()}>
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="Google" />
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
      <style>{`
        .login-page {
          min-height: 100vh;
          background: #fdfaf7;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow-y: auto;
        }

        .login-card {
          width: 100%;
          max-width: 1100px;
          background: #fff;
          border-radius: 40px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.06);
          display: flex;
          overflow: hidden;
          min-height: min(700px, 90vh);
          position: relative;
          z-index: 10;
        }

        .left-panel {
          width: 45%;
          min-width: 300px;
          position: relative;
          z-index: 20;
          overflow: visible;
          flex-shrink: 0;
        }

        .left-panel img {
          width: 132%; /* Balanced overlap */
          height: 100%;
          object-fit: cover;
          position: relative;
          z-index: 1;
          /* Tighter, more elegant curve */
          border-radius: 0 42% 42% 0 / 0 50% 50% 0;
          filter: none;
        }

        .left-overlay {
          position: absolute;
          inset: 0;
          width: 100%; /* Only over the left panel part */
          background: linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 100%);
          z-index: 2;
          pointer-events: none;
          /* No border radius needed if it doesn't overlap the curve */
        }

        .left-content {
          position: absolute;
          top: 80px;
          left: 60px;
          z-index: 10;
          color: #fff;
          max-width: 320px;
        }

        .left-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem;
          line-height: 1;
          margin-bottom: 20px;
          font-weight: 700; /* Bolder */
          text-shadow: 0 2px 15px rgba(0,0,0,0.8);
        }

        .left-content .script-text {
          font-family: 'Alex Brush', cursive;
          color: #fca5a5;
          font-size: 4rem;
          display: block;
          margin-top: -10px;
          position: relative;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .heart-icon {
          display: inline-block;
          vertical-align: middle;
          margin-left: 10px;
          color: #fca5a5;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }

        .decor-line {
          width: 40px;
          height: 1px;
          background: #fff;
          margin: 25px 0;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }

        .left-content p {
          font-size: 1.1rem;
          opacity: 1;
          line-height: 1.4;
          font-weight: 400;
          max-width: 200px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.6); /* Stronger shadow */
        }

        .right-panel {
          flex: 1;
          padding: 40px 50px 40px 160px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          background: #fff;
          z-index: 5;
          overflow-y: auto;
          min-width: 0;
        }

        .floral-bg-decor {
          position: absolute;
          bottom: -20px;
          right: -20px;
          width: 300px;
          opacity: 0.2;
          pointer-events: none;
          z-index: 1;
        }

        .form-container {
          width: 100%;
          max-width: 400px;
          position: relative;
          z-index: 10;
        }

        .logo-wrapper {
          margin-bottom: 24px;
        }

        .form-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .form-header h1 {
          font-size: 2rem;
          font-weight: 400;
          color: #374151;
          margin-bottom: 6px;
          font-family: 'Playfair Display', serif;
        }

        .form-header p {
          color: #6b7280;
          font-size: 0.95rem;
        }

        .input-group {
          margin-bottom: 16px;
        }

        .input-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          color: #9ca3af;
        }

        .input-field {
          width: 100%;
          padding: 14px 16px 14px 48px;
          background: #f9fafb; /* Light background for inputs like in screenshot */
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          color: #1f2937;
          transition: all 0.2s;
        }

        .input-field:focus {
          outline: none;
          border-color: #ec4899;
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
        }

        .show-password {
          position: absolute;
          right: 14px;
          color: #9ca3af;
          cursor: pointer;
          background: none;
          border: none;
          padding: 5px;
        }

        .forgot-password {
          display: block;
          text-align: right;
          font-size: 0.85rem;
          color: #fca5a5;
          margin-top: 10px;
          font-weight: 500;
          text-decoration: none;
        }

        .btn-login {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          margin-top: 20px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(236, 72, 153, 0.3);
        }

        .btn-login:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 18px 0;
          color: #e5e7eb;
        }

        .divider::before, .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        .divider span {
          padding: 0 15px;
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .btn-google {
          width: 100%;
          padding: 12px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 0.95rem;
          font-weight: 500;
          color: #374151;
          transition: all 0.2s;
        }

        .btn-google:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .footer-text {
          margin-top: 24px;
          text-align: center;
          font-size: 0.95rem;
          color: #6b7280;
        }

        .footer-text a {
          color: #fca5a5;
          font-weight: 600;
          text-decoration: none;
        }

        @media (max-width: 1100px) {
          .login-card { max-width: 900px; }
          .right-panel { padding: 40px 40px 40px 120px; }
        }

        @media (max-width: 900px) {
          .left-panel { width: 40%; }
          .right-panel { padding: 40px 32px 40px 80px; }
          .left-content h2 { font-size: 2.6rem; }
          .left-content .script-text { font-size: 3rem; }
        }

        @media (max-width: 768px) {
          .left-panel { display: none; }
          .login-card { max-width: 480px; border-radius: 24px; min-height: unset; }
          .right-panel { padding: 40px 32px; }
          .login-page { padding: 16px; align-items: flex-start; padding-top: 40px; }
        }

        @media (max-width: 480px) {
          .login-card { border-radius: 20px; max-width: 100%; }
          .right-panel { padding: 28px 16px; }
          .form-header h1 { font-size: 1.6rem; }
          .form-container { max-width: 100%; }
          .login-page { padding: 12px; padding-top: 20px; }
          .input-field { font-size: 0.95rem; padding: 12px 12px 12px 44px; }
          .btn-login { padding: 13px; }
        }

        @media (max-width: 360px) {
          .right-panel { padding: 24px 12px; }
          .form-header h1 { font-size: 1.4rem; }
          .logo-wrapper { margin-bottom: 16px; }
          .form-header { margin-bottom: 16px; }
        }
      `}</style>

      <div className="login-page">
        <motion.div 
          className="login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="left-panel">
            <img src="/images/login_bg.png" alt="Janneth Acevedo" />
            <div className="left-overlay" />
            <div className="left-content">
              <h2>Cada flor<br />cuenta una<br />
                <span className="script-text">
                  historia <Heart className="heart-icon" size={32} fill="#fca5a5" />
                </span>
              </h2>
              <div className="decor-line" />
              <p>Ramos únicos para momentos inolvidables.</p>
            </div>
          </div>

          <div className="right-panel">
            <img 
              src="https://www.transparentpng.com/download/floral/floral-sketch-png-15.png" 
              className="floral-bg-decor" 
              alt="" 
            />

            <div className="form-container">
              <div className="logo-wrapper flex justify-center scale-110">
                <Logo size="xl" />
              </div>

              <div className="form-header">
                <h1>Bienvenido</h1>
                <p>Inicia sesión para gestionar tu tienda</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-group">
                  <label className="input-label">Correo electrónico</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={20} />
                    <input 
                      type="email" 
                      placeholder="ejemplo@correo.com" 
                      className="input-field"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div className="input-group">
                  <label className="input-label">Contraseña</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={20} />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      className="input-field"
                      {...register('password')}
                    />
                    <button 
                      type="button" 
                      className="show-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <Link href="/recuperar" className="forgot-password">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <button type="submit" disabled={loading} className="btn-login">
                  {loading ? 'Entrando...' : 'Iniciar sesión'}
                </button>
              </form>

              <div className="divider">
                <span>o continúa con</span>
              </div>
              <GoogleLoginButton setLoading={setLoading} setAuth={setAuth} router={router} />

              <p className="footer-text">
                ¿No tienes cuenta? <Link href="/contacto">Contáctanos</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
}
