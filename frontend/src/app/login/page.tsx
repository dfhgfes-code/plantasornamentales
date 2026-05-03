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
          background: #fffcf9; /* Fondo crema muy sutil */
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

        /* Panel Izquierdo - Imagen con curva */
        .left-panel {
          width: 48%;
          position: relative;
          background: #1a1a1a;
          overflow: hidden;
          display: block;
        }

        @media (max-width: 1024px) {
          .left-panel { display: none; }
          .login-card { max-width: 500px; min-height: unset; border-radius: 32px; }
        }

        .left-panel img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.85;
          filter: brightness(0.85);
        }

        /* Overlay para mejorar legibilidad del texto sobre la foto */
        .left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.4), transparent);
        }

        .left-content {
          position: absolute;
          top: 80px;
          left: 60px;
          z-index: 10;
          color: #fff;
          max-width: 400px;
        }

        .left-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem;
          line-height: 1.1;
          margin-bottom: 24px;
          font-weight: 500;
        }

        .left-content h2 span {
          color: #fda4af; /* Rosa suave */
          font-style: italic;
        }

        .left-content p {
          font-size: 1.1rem;
          opacity: 0.9;
          line-height: 1.6;
          font-weight: 300;
        }

        /* Panel Derecho - Formulario */
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

        @media (max-width: 640px) {
          .right-panel { padding: 40px 24px; }
          .form-header h1 { font-size: 1.75rem !important; }
        }

        /* Ramita decorativa SVG fondo (Rosa muy pálido) */
        .decor-sketch {
          position: absolute;
          bottom: -40px;
          right: -40px;
          width: 250px;
          height: 250px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' fill='none'%3E%3Cpath d='M180 180 Q140 120 100 100 Q60 80 20 20' stroke='%23fff1f2' stroke-width='2' stroke-linecap='round'/%3E%3Cellipse cx='100' cy='100' rx='8' ry='14' fill='%23fff1f2' transform='rotate(-30 100 100)'/%3E%3Cellipse cx='120' cy='80' rx='6' ry='11' fill='%23fff1f2' transform='rotate(20 120 80)'/%3E%3C/svg%3E");
          background-size: contain;
          background-repeat: no-repeat;
          opacity: 0.8;
          pointer-events: none;
        }

        .form-container {
          width: 100%;
          max-width: 380px;
          z-index: 1;
        }

        .form-header {
          text-align: center;
          margin-bottom: 36px;
        }

        .form-header h1 {
          font-size: 2.2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .form-header p {
          color: #9ca3af;
          font-size: 1rem;
        }

        .input-group {
          margin-bottom: 20px;
        }

        .input-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
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
          width: 18px;
          height: 18px;
        }

        .input-field {
          width: 100%;
          padding: 14px 16px 14px 48px;
          background: #fcfcfc;
          border: 1.5px solid #f3f4f6;
          border-radius: 14px;
          font-size: 1rem;
          color: #111827;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-field::placeholder { color: #d1d5db; }

        .input-field:focus {
          outline: none;
          background: #fff;
          border-color: #ec4899; /* Rosa vibrante de la página */
          box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.08);
        }

        .show-password {
          position: absolute;
          right: 16px;
          color: #d1d5db;
          cursor: pointer;
          background: none;
          border: none;
          padding: 8px;
          border-radius: 8px;
          transition: color 0.2s;
        }
        .show-password:hover { color: #ec4899; }

        .forgot-password {
          display: block;
          text-align: right;
          font-size: 0.85rem;
          color: #f472b6;
          margin-top: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .forgot-password:hover { color: #db2777; }

        .btn-login {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #f472b6 0%, #db2777 100%); /* Degradado rosa de la página */
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 700;
          margin-top: 32px;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(219, 39, 119, 0.25);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-login:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(219, 39, 119, 0.35);
          filter: brightness(1.05);
        }

        .btn-login:active:not(:disabled) { transform: translateY(0); }
        .btn-login:disabled { opacity: 0.6; cursor: not-allowed; }

        .divider {
          display: flex;
          align-items: center;
          margin: 32px 0;
          color: #e5e7eb;
        }

        .divider::before, .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #f3f4f6;
        }

        .divider span {
          padding: 0 16px;
          font-size: 0.8rem;
          font-weight: 500;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .btn-google {
          width: 100%;
          padding: 14px;
          background: #fff;
          border: 1.5px solid #f3f4f6;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-google:hover {
          background: #fafafa;
          border-color: #e5e7eb;
          color: #1f2937;
        }

        .footer-text {
          margin-top: 40px;
          text-align: center;
          font-size: 0.9rem;
          color: #9ca3af;
        }

        .footer-text a {
          color: #f472b6;
          font-weight: 700;
          text-decoration: none;
          margin-left: 4px;
        }
        .footer-text a:hover { text-decoration: underline; }
      `}</style>

      <div className="login-page">
        <motion.div 
          className="login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Panel Izquierdo */}
          <div className="left-panel">
            <img src="/images/login_bg.png" alt="Premium Bouquet" />
            <div className="left-overlay" />
            <div className="left-content">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <h2>Cada flor<br />cuenta una<br /><span>historia</span></h2>
                <p>Arreglos únicos diseñados para transformar momentos ordinarios en recuerdos inolvidables.</p>
              </motion.div>
            </div>
          </div>

          {/* Panel Derecho */}
          <div className="right-panel">
            {/* Sketch decorativo */}
            <div className="decor-sketch" />

            <div className="form-container">
              <div className="flex justify-center mb-10">
                <Logo size="xl" centered />
              </div>

              <div className="form-header">
                <h1>Bienvenido</h1>
                <p>Inicia sesión para continuar</p>
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
                  {errors.email && <p className="text-pink-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
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
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-pink-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
                  <Link href="/recuperar" className="forgot-password">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <button type="submit" disabled={loading} className="btn-login">
                  {loading ? 'Validando...' : 'Ingresar al Jardín'}
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
