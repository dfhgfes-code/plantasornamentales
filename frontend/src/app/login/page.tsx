'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { Logo } from '@/components/ui/Logo';

const schema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});
type FormData = z.infer<typeof schema>;

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
    <>
      <style>{`
        .login-page {
          min-height: 100vh;
          background: #fdfaf7;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
          font-family: 'Inter', sans-serif;
        }

        .login-card {
          width: 100%;
          max-width: 1100px;
          background: #fff;
          border-radius: 40px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.06);
          display: flex;
          overflow: hidden;
          min-height: 650px;
          position: relative;
        }

        .left-panel {
          width: 42%;
          position: relative;
          background: #f3f4f6;
          overflow: hidden;
        }

        .left-panel img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 70%);
        }

        .left-content {
          position: absolute;
          top: 70px;
          left: 60px;
          z-index: 10;
          color: #fff;
          max-width: 320px;
        }

        .left-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: 3.2rem;
          line-height: 1.1;
          margin-bottom: 20px;
          font-weight: 500;
          text-shadow: 0 2px 20px rgba(0,0,0,0.3);
        }

        .left-content .decor-line {
          width: 35px;
          height: 1px;
          background: #fff;
          margin-bottom: 16px;
          opacity: 0.7;
        }

        .left-content p {
          font-size: 1rem;
          opacity: 0.9;
          line-height: 1.6;
          font-weight: 300;
        }

        /* Panel Derecho con ARCO PERFECTO */
        .right-panel {
          flex: 1;
          padding: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          background: #fff;
          margin-left: -80px; /* Montado sobre la imagen */
        }

        /* El círculo que hace la curva suave */
        .right-panel::before {
          content: "";
          position: absolute;
          top: -10%;
          bottom: -10%;
          left: -180px; /* Ajustado para el arco */
          width: 360px;
          background: #fff;
          border-radius: 100%;
          z-index: -1;
        }

        @media (max-width: 1024px) {
          .left-panel { display: none; }
          .right-panel { margin-left: 0; padding: 40px 24px; }
          .right-panel::before { display: none; }
          .login-card { max-width: 480px; min-height: unset; border-radius: 32px; }
        }

        .branch-decor {
          position: absolute;
          width: 220px;
          opacity: 0.06;
          pointer-events: none;
        }
        .branch-tr { top: 0; right: 0; transform: scaleX(-1); }
        .branch-bl { bottom: 0; left: 0; opacity: 0.04; }

        .form-container {
          width: 100%;
          max-width: 360px;
          position: relative;
        }

        .form-header {
          text-align: center;
          margin-bottom: 35px;
        }

        .form-header h1 {
          font-size: 2.5rem;
          font-weight: 400;
          color: #111827;
          margin-bottom: 8px;
          font-family: 'Playfair Display', serif;
        }

        .form-header p {
          color: #9ca3af;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 500;
        }

        .input-group {
          margin-bottom: 18px;
        }

        .input-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          color: #d1d5db;
        }

        .input-field {
          width: 100%;
          padding: 14px 16px 14px 48px;
          background: #fff !important;
          border: 1.5px solid #f3f4f6;
          border-radius: 14px;
          font-size: 1rem;
          color: #111827;
          transition: border-color 0.2s;
        }

        .input-field:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 50px white inset !important;
          -webkit-text-fill-color: #111827 !important;
        }

        .input-field:focus {
          outline: none;
          border-color: #5d6d5e;
        }

        .show-password {
          position: absolute;
          right: 14px;
          color: #d1d5db;
          cursor: pointer;
          background: none;
          border: none;
          padding: 5px;
        }

        .forgot-password {
          display: block;
          text-align: right;
          font-size: 0.75rem;
          color: #fca5a5;
          margin-top: 8px;
          font-weight: 700;
          text-decoration: none;
          text-transform: uppercase;
        }

        .btn-login {
          width: 100%;
          padding: 16px;
          background: #5d6d5e;
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 0.95rem;
          font-weight: 700;
          margin-top: 24px;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          box-shadow: 0 10px 20px rgba(93, 109, 94, 0.15);
        }

        .btn-login:hover {
          background: #4a574b;
          transform: translateY(-1px);
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 24px 0;
          color: #f3f4f6;
        }

        .divider span {
          padding: 0 16px;
          font-size: 0.75rem;
          color: #d1d5db;
          text-transform: uppercase;
        }

        .btn-google {
          width: 100%;
          padding: 12px;
          background: #fff;
          border: 1.5px solid #f3f4f6;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #4b5563;
        }

        .footer-text {
          margin-top: 35px;
          text-align: center;
          font-size: 0.85rem;
          color: #9ca3af;
        }
      `}</style>

      <div className="login-page">
        <motion.div 
          className="login-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="left-panel">
            <img src="/images/login_bg.png" alt="Janneth Acevedo" />
            <div className="left-overlay" />
            <div className="left-content">
              <h2>Cada flor<br />cuenta una<br /><span>historia</span></h2>
              <div className="decor-line" />
              <p>Ramos únicos para momentos inolvidables.</p>
            </div>
          </div>

          <div className="right-panel">
            <img src="https://www.transparentpng.com/download/floral/floral-sketch-png-15.png" className="branch-decor branch-tr" alt="" />
            <img src="https://www.transparentpng.com/download/floral/floral-sketch-png-15.png" className="branch-decor branch-bl" alt="" />

            <div className="form-container">
              <div className="flex justify-center mb-6">
                <Logo size="lg" centered />
              </div>

              <div className="form-header">
                <h1>Bienvenido</h1>
                <p>Inicia sesión para gestionar tu tienda</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-group">
                  <label className="input-label">Correo electrónico</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={18} />
                    <input 
                      type="email" 
                      placeholder="ejemplo@correo.com" 
                      className="input-field"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
                </div>

                <div className="input-group">
                  <label className="input-label">Contraseña</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={18} />
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
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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

              <button className="btn-google" type="button">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="Google" />
                Continuar con Google
              </button>

              <p className="footer-text">
                ¿No tienes cuenta? <Link href="/contacto">Contáctanos</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
