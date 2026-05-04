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
          padding: 20px;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
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
          z-index: 10;
        }

        .left-panel {
          width: 42%;
          position: relative;
          background: #fdfaf7;
          overflow: visible;
          z-index: 20;
        }

        .left-panel img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        /* Large Convex Curve "Barriga" */
        .left-panel::after {
          content: "";
          position: absolute;
          top: -5%;
          bottom: -5%;
          right: -140px;
          width: 280px;
          background: inherit;
          background-image: url('/images/login_bg.png');
          background-size: cover;
          background-position: 85% center;
          border-radius: 100%;
          z-index: 2;
          box-shadow: 20px 0 40px rgba(0,0,0,0.08);
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
          font-weight: 400;
          text-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .left-content .script-text {
          font-family: 'Alex Brush', cursive;
          color: #fca5a5;
          font-size: 4rem;
          display: block;
          margin-top: -10px;
          position: relative;
        }

        .heart-icon {
          display: inline-block;
          vertical-align: middle;
          margin-left: 10px;
          color: #fca5a5;
        }

        .decor-line {
          width: 40px;
          height: 1px;
          background: rgba(255, 255, 255, 0.6);
          margin: 25px 0;
        }

        .left-content p {
          font-size: 1.1rem;
          opacity: 0.9;
          line-height: 1.4;
          font-weight: 300;
          max-width: 200px;
        }

        .right-panel {
          flex: 1;
          padding: 60px 60px 60px 180px; /* Increased left padding for the curve */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          background: #fff;
          z-index: 5;
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
          margin-bottom: 40px;
        }

        .form-header {
          text-align: center;
          margin-bottom: 35px;
        }

        .form-header h1 {
          font-size: 2.2rem;
          font-weight: 400;
          color: #374151;
          margin-bottom: 8px;
          font-family: 'Playfair Display', serif;
        }

        .form-header p {
          color: #6b7280;
          font-size: 1rem;
        }

        .input-group {
          margin-bottom: 20px;
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
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          color: #1f2937;
          transition: all 0.2s;
        }

        .input-field:focus {
          outline: none;
          border-color: #5d6d5e;
          box-shadow: 0 0 0 3px rgba(93, 109, 94, 0.1);
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
          padding: 16px;
          background: #5d6d5e;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          margin-top: 30px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-login:hover {
          background: #4a574b;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 25px 0;
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
          margin-top: 40px;
          text-align: center;
          font-size: 0.95rem;
          color: #6b7280;
        }

        .footer-text a {
          color: #fca5a5;
          font-weight: 600;
          text-decoration: none;
        }

        @media (max-width: 1024px) {
          .left-panel { display: none; }
          .login-card { max-width: 500px; border-radius: 0; min-height: 100vh; }
          .right-panel { padding: 40px 24px; }
          .login-page { padding: 0; }
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
              <div className="logo-wrapper flex justify-center">
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
