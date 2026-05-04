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
          min-height: calc(100vh - 80px); /* Ajuste por el Navbar */
          background: #fdfaf7;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 16px;
          font-family: 'Inter', sans-serif;
        }

        .login-card {
          width: 100%;
          max-width: 1050px;
          background: #fff;
          border-radius: 40px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.06);
          display: flex;
          overflow: hidden;
          min-height: 620px; /* Reducido para que quepa en pantalla */
          max-height: 85vh;
          position: relative;
        }

        .left-panel {
          width: 42%;
          position: relative;
          background: #f3f4f6;
          overflow: hidden;
          z-index: 0;
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
          top: 50px;
          left: 50px;
          z-index: 10;
          color: #fff;
          max-width: 300px;
        }

        .left-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          line-height: 1.1;
          margin-bottom: 16px;
          font-weight: 500;
          text-shadow: 0 2px 20px rgba(0,0,0,0.3);
        }

        .left-content .decor-line {
          width: 30px;
          height: 1px;
          background: #fff;
          margin-bottom: 12px;
          opacity: 0.6;
        }

        .left-content p {
          font-size: 0.95rem;
          opacity: 0.9;
          line-height: 1.5;
          font-weight: 300;
        }

        .right-panel {
          flex: 1;
          padding: 40px 60px; /* Reducido padding vertical */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          background: #fff;
          z-index: 1;
          border-top-left-radius: 45% 100%;
          border-bottom-left-radius: 45% 100%;
          margin-left: -100px;
          padding-left: 120px;
        }

        @media (max-width: 1024px) {
          .left-panel { display: none; }
          .right-panel { margin-left: 0; padding: 40px 24px; border-radius: 32px; }
          .login-card { max-width: 480px; min-height: unset; border-radius: 32px; max-height: unset; }
        }

        .branch-decor {
          position: absolute;
          width: 200px;
          opacity: 0.08;
          pointer-events: none;
        }
        .branch-tr { top: -10px; right: -10px; transform: scaleX(-1); }
        .branch-bl { bottom: -10px; left: -10px; }

        .form-container {
          width: 100%;
          max-width: 360px;
          z-index: 10;
        }

        .form-header {
          text-align: center;
          margin-bottom: 30px; /* Reducido */
        }

        .form-header h1 {
          font-size: 2.2rem; /* Reducido */
          font-weight: 400;
          color: #111827;
          margin-bottom: 6px;
          font-family: 'Playfair Display', serif;
        }

        .form-header p {
          color: #9ca3af;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .input-group {
          margin-bottom: 18px; /* Reducido */
        }

        .input-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .input-field {
          width: 100%;
          padding: 12px 16px 12px 48px; /* Reducido */
          background: #fff !important;
          border: 1.5px solid #f3f4f6;
          border-radius: 14px;
          font-size: 0.95rem;
          color: #111827;
        }

        .btn-login {
          width: 100%;
          padding: 15px; /* Reducido */
          background: #5d6d5e;
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 0.95rem;
          font-weight: 700;
          margin-top: 24px; /* Reducido */
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 24px 0;
          color: #f3f4f6;
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
          margin-top: 30px;
          text-align: center;
          font-size: 0.85rem;
          color: #9ca3af;
        }
      `}</style>

      <div className="login-page">
        <motion.div 
          className="login-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Panel Izquierdo */}
          <div className="left-panel">
            <img src="/images/login_bg.png" alt="Janneth Acevedo" />
            <div className="left-overlay" />
            <div className="left-content">
              <h2>Cada flor<br />cuenta una<br /><span>historia</span></h2>
              <div className="decor-line" />
              <p>Ramos únicos para momentos inolvidables.</p>
            </div>
          </div>

          {/* Panel Derecho */}
          <div className="right-panel">
            <img src="https://www.transparentpng.com/download/floral/floral-sketch-png-15.png" className="branch-decor branch-tr" alt="" />
            <img src="https://www.transparentpng.com/download/floral/floral-sketch-png-15.png" className="branch-decor branch-bl" alt="" />

            <div className="form-container">
              <div className="flex justify-center mb-6">
                <Logo size="lg" centered /> {/* Logo más pequeño */}
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
                      className="absolute right-4 text-gray-300 hover:text-gray-500"
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
                  {loading ? 'Cargando...' : 'Iniciar sesión'}
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
