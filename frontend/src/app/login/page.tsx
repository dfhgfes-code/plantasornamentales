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
          min-height: calc(100vh - 80px);
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
          min-height: 620px;
          max-height: 85vh;
          position: relative;
        }

        /* Panel Izquierdo */
        .left-panel {
          width: 45%;
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

        /* Panel Derecho con CURVA HACIA AFUERA (Convexa hacia la izquierda) */
        .right-panel {
          flex: 1;
          padding: 40px 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          background: #fff;
          z-index: 1;
          /* Usamos clip-path para lograr la curva perfecta hacia la izquierda */
          clip-path: ellipse(150% 100% at 145% 50%);
          margin-left: -15%; /* Montado sobre la imagen */
          padding-left: 15%; /* Compensar el montaje */
        }

        @media (max-width: 1024px) {
          .left-panel { display: none; }
          .right-panel { margin-left: 0; padding: 40px 24px; clip-path: none; border-radius: 32px; }
          .login-card { max-width: 480px; min-height: unset; border-radius: 32px; max-height: unset; }
        }

        .branch-decor {
          position: absolute;
          width: 200px;
          opacity: 0.08;
          pointer-events: none;
        }
        .branch-tr { top: -10px; right: -10px; transform: scaleX(-1); }
        .branch-bl { bottom: -10px; left: 0; }

        .form-container {
          width: 100%;
          max-width: 360px;
          z-index: 10;
        }

        .form-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .form-header h1 {
          font-size: 2.2rem;
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
          margin-bottom: 20px;
          position: relative;
        }

        .input-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .input-field {
          width: 100%;
          padding: 14px 16px 14px 48px;
          background: #fff !important;
          border: 1.5px solid #f3f4f6;
          border-radius: 14px;
          font-size: 0.95rem;
          color: #111827;
          transition: all 0.25s;
        }

        .input-field:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 50px white inset !important;
          -webkit-text-fill-color: #111827 !important;
        }

        .input-field:focus {
          outline: none;
          border-color: #5d6d5e;
          box-shadow: 0 0 0 4px rgba(93, 109, 94, 0.08);
        }

        .input-icon {
          position: absolute;
          left: 18px;
          top: 40px; /* Ajustado para la etiqueta */
          color: #d1d5db;
        }

        .show-password {
          position: absolute;
          right: 16px;
          top: 38px;
          color: #d1d5db;
          cursor: pointer;
          background: none;
          border: none;
          padding: 5px;
          z-index: 10;
        }

        .forgot-password {
          display: block;
          text-align: right;
          font-size: 0.8rem;
          color: #fca5a5;
          margin-top: 8px;
          font-weight: 600;
          text-decoration: none;
        }

        .btn-login {
          width: 100%;
          padding: 15px;
          background: #5d6d5e;
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 700;
          margin-top: 24px;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 10px 20px rgba(93, 109, 94, 0.2);
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

          {/* Panel Derecho con Curva Convexa */}
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
                  <Mail className="input-icon" size={18} />
                  <input 
                    type="email" 
                    placeholder="ejemplo@correo.com" 
                    className="input-field"
                    {...register('email')}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
                </div>

                <div className="input-group">
                  <label className="input-label">Contraseña</label>
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
                  {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
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
