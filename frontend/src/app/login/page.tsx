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
          min-height: 700px;
          position: relative;
        }

        /* Panel Izquierdo - Curva muy pronunciada */
        .left-panel {
          width: 50%;
          position: relative;
          background: #1a1a1a;
          overflow: hidden;
          /* Curva orgánica como en el diseño de referencia */
          clip-path: ellipse(110% 110% at 0% 50%);
        }

        .left-panel img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.95;
        }

        .left-content {
          position: absolute;
          top: 60px;
          left: 60px;
          z-index: 10;
          color: #fff;
          max-width: 320px;
        }

        .left-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: 3.8rem;
          line-height: 1.1;
          margin-bottom: 20px;
          font-weight: 500;
          text-shadow: 0 2px 20px rgba(0,0,0,0.3);
        }

        .left-content h2 span {
          color: #fda4af;
          font-style: italic;
        }

        .left-content p {
          font-size: 1.15rem;
          opacity: 0.9;
          line-height: 1.6;
          font-weight: 300;
          text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        /* Panel Derecho */
        .right-panel {
          flex: 1;
          padding: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          background: #fff;
        }

        /* Ramas Decorativas en las esquinas de la tarjeta blanca */
        .branch-decor {
          position: absolute;
          width: 250px;
          opacity: 0.15;
          pointer-events: none;
        }
        .branch-tl { top: -40px; right: -40px; transform: scaleX(-1) rotate(20deg); }
        .branch-br { bottom: -40px; left: -40px; transform: rotate(-15deg); }

        .form-container {
          width: 100%;
          max-width: 400px;
          z-index: 1;
        }

        .form-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .form-header h1 {
          font-size: 2.8rem;
          font-weight: 500;
          color: #111827;
          margin-bottom: 8px;
          font-family: 'Playfair Display', serif;
        }

        .form-header p {
          color: #6b7280;
          font-size: 1.05rem;
        }

        .input-group {
          margin-bottom: 24px;
        }

        .input-label {
          display: block;
          font-size: 0.95rem;
          font-weight: 500;
          color: #4b5563;
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

        .show-password {
          position: absolute;
          right: 18px;
          color: #d1d5db;
          cursor: pointer;
          background: none;
          border: none;
          padding: 8px;
        }

        .forgot-password {
          display: block;
          text-align: right;
          font-size: 0.85rem;
          color: #fca5a5;
          margin-top: 10px;
          text-decoration: none;
          font-weight: 500;
        }

        .btn-login {
          width: 100%;
          padding: 18px;
          background: #5d6d5e; /* Verde oliva premium */
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
          box-shadow: 0 15px 35px rgba(93, 109, 94, 0.3);
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
          padding: 14px;
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
          transition: all 0.2s;
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

        /* RESPONSIVIDAD */
        @media (max-width: 1024px) {
          .left-panel { display: none; }
          .login-card { max-width: 500px; min-height: unset; border-radius: 32px; }
          .right-panel { padding: 48px 32px; }
          .branch-decor { display: none; }
        }
      `}</style>

      <div className="login-page">
        <motion.div 
          className="login-card"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Panel Izquierdo */}
          <div className="left-panel">
            <img src="/images/login_bg.png" alt="Janneth Acevedo" />
            <div className="left-overlay" />
            <div className="left-content">
              <h2>Cada flor<br />cuenta una<br /><span>historia</span></h2>
              <p>Ramos únicos para momentos inolvidables.</p>
            </div>
          </div>

          {/* Panel Derecho */}
          <div className="right-panel">
            {/* Ramas decorativas */}
            <img src="https://www.transparentpng.com/download/floral/floral-sketch-png-15.png" className="branch-decor branch-tl" alt="" />
            <img src="https://www.transparentpng.com/download/floral/floral-sketch-png-15.png" className="branch-decor branch-br" alt="" />

            <div className="form-container">
              <div className="flex justify-center mb-10">
                <Logo size="xl" centered />
              </div>

              <div className="form-header">
                <h1>Bienvenida</h1>
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
                  {loading ? 'Validando...' : 'Iniciar sesión'}
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
