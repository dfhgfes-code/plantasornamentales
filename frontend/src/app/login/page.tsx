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
          padding: 24px 16px;
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
          min-height: 750px;
          position: relative;
        }

        /* Panel Izquierdo - Ahora es el fondo */
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
          opacity: 1;
        }

        .left-content {
          position: absolute;
          top: 60px;
          left: 50px;
          z-index: 10;
          color: #fff;
          max-width: 320px;
        }

        .left-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem;
          line-height: 1.1;
          margin-bottom: 20px;
          font-weight: 500;
          text-shadow: 0 4px 30px rgba(0,0,0,0.4);
        }

        .left-content h2 span {
          color: #fda4af;
          font-style: italic;
        }

        .left-content p {
          font-size: 1.1rem;
          opacity: 0.95;
          line-height: 1.6;
          font-weight: 400;
          text-shadow: 0 2px 15px rgba(0,0,0,0.3);
        }

        /* Panel Derecho - El que tiene la CURVA hacia la izquierda */
        .right-panel {
          flex: 1;
          padding: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          background: #fff;
          z-index: 1;
          /* Curva que "entra" en la imagen */
          border-top-left-radius: 50% 100%;
          border-bottom-left-radius: 50% 100%;
          margin-left: -120px;
          padding-left: 140px; /* Compensar el margen negativo */
        }

        @media (max-width: 1024px) {
          .left-panel { display: none; }
          .right-panel { margin-left: 0; padding-left: 32px; border-radius: 32px; }
          .login-card { max-width: 500px; min-height: unset; border-radius: 32px; }
        }

        /* Ramas Decorativas */
        .branch-decor {
          position: absolute;
          width: 250px;
          opacity: 0.1;
          pointer-events: none;
        }
        .branch-tr { top: 0; right: 0; transform: scaleX(-1); }
        .branch-bl { bottom: 0; left: 0; opacity: 0.08; }

        .form-container {
          width: 100%;
          max-width: 400px;
          z-index: 10;
        }

        .form-header {
          text-align: center;
          margin-bottom: 45px;
        }

        .form-header h1 {
          font-size: 2.8rem;
          font-weight: 500;
          color: #111827;
          margin-bottom: 10px;
          font-family: 'Playfair Display', serif;
        }

        .form-header p {
          color: #6b7280;
          font-size: 1rem;
        }

        .input-group {
          margin-bottom: 24px;
        }

        .input-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 10px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 18px;
          color: #d1d5db;
          width: 18px;
        }

        .input-field {
          width: 100%;
          padding: 15px 20px 15px 54px;
          background: #fff !important;
          border: 1.5px solid #f3f4f6;
          border-radius: 16px;
          font-size: 1rem;
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
          box-shadow: 0 0 0 4px rgba(93, 109, 94, 0.1);
        }

        .btn-login {
          width: 100%;
          padding: 18px;
          background: #5d6d5e;
          color: #fff;
          border: none;
          border-radius: 16px;
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 36px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 10px 25px rgba(93, 109, 94, 0.2);
        }

        .btn-login:hover {
          background: #4a574b;
          transform: translateY(-1px);
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 36px 0;
          color: #e5e7eb;
        }

        .divider span {
          padding: 0 16px;
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .btn-google {
          width: 100%;
          padding: 15px;
          background: #fff;
          border: 1.5px solid #f3f4f6;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 0.95rem;
          font-weight: 500;
          color: #4b5563;
          cursor: pointer;
        }

        .footer-text {
          margin-top: 45px;
          text-align: center;
          font-size: 0.95rem;
          color: #6b7280;
        }

        .footer-text a {
          color: #fca5a5;
          font-weight: 600;
          text-decoration: none;
        }
      `}</style>

      <div className="login-page">
        <motion.div 
          className="login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Panel Izquierdo */}
          <div className="left-panel">
            <img src="/images/login_bg.png" alt="Janneth Acevedo" />
            <div className="left-content">
              <h2>Cada flor<br />cuenta una<br /><span>historia</span></h2>
              <p>Ramos únicos para momentos inolvidables.</p>
            </div>
          </div>

          {/* Panel Derecho */}
          <div className="right-panel">
            <img src="https://www.transparentpng.com/download/floral/floral-sketch-png-15.png" className="branch-decor branch-tr" alt="" />
            <img src="https://www.transparentpng.com/download/floral/floral-sketch-png-15.png" className="branch-decor branch-bl" alt="" />

            <div className="form-container">
              <div className="flex justify-center mb-10">
                <Logo size="xl" centered />
              </div>

              <div className="form-header">
                <h1>Bienvenido</h1>
                <p>Inicia sesión para gestionar tu tienda</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-group">
                  <label className="input-label">Correo electrónico</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" />
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
                    <Lock className="input-icon" />
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
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="Google" />
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
