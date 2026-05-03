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

const FLOWER_PHOTO = 'https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=900&q=90&auto=format&fit=crop';

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
        /* Fondo general crema/beige muy suave */
        .login-page {
          min-height: 100vh;
          background: #fdf6f0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
        }

        /* Contenedor principal */
        .login-container {
          width: 100%;
          max-width: 960px;
          min-height: 600px;
          background: #fff;
          border-radius: 32px;
          box-shadow: 0 20px 80px rgba(0,0,0,0.10);
          display: flex;
          overflow: hidden;
          position: relative;
        }

        /* Panel izquierdo — foto con curva */
        .left-panel {
          position: relative;
          width: 45%;
          flex-shrink: 0;
          overflow: hidden;
          border-radius: 32px;
        }
        .left-panel img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
        /* Overlay degradado sobre la foto */
        .left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(190,24,93,0.55) 0%,
            rgba(157,23,77,0.35) 40%,
            rgba(0,0,0,0.15) 100%
          );
        }
        /* Texto sobre la foto */
        .left-text {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 40px 36px;
        }
        .left-text .tagline {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          margin-bottom: 12px;
        }
        .left-text h2 {
          font-family: Georgia, serif;
          font-style: italic;
          font-size: 2.4rem;
          line-height: 1.2;
          color: #fff;
          text-shadow: 0 2px 16px rgba(0,0,0,0.3);
          margin-bottom: 8px;
        }
        .left-text h2 span {
          color: #fda4af;
        }
        .left-text p {
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          line-height: 1.6;
          max-width: 240px;
        }
        /* Línea decorativa */
        .left-text .deco-line {
          width: 48px;
          height: 2px;
          background: linear-gradient(90deg, #fda4af, transparent);
          margin-bottom: 16px;
          border-radius: 2px;
        }

        /* Panel derecho — formulario */
        .right-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          background: #fff;
          position: relative;
          overflow: hidden;
        }
        /* Ramita decorativa SVG fondo */
        .right-panel::before {
          content: '';
          position: absolute;
          bottom: -40px;
          right: -40px;
          width: 220px;
          height: 220px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' fill='none'%3E%3Cpath d='M180 180 Q140 120 100 100 Q60 80 20 20' stroke='%23fce7f3' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M160 180 Q130 140 110 110' stroke='%23fce7f3' stroke-width='1.5' stroke-linecap='round'/%3E%3Cellipse cx='100' cy='100' rx='8' ry='14' fill='%23fce7f3' transform='rotate(-30 100 100)'/%3E%3Cellipse cx='120' cy='80' rx='6' ry='11' fill='%23fce7f3' transform='rotate(20 120 80)'/%3E%3Cellipse cx='80' cy='120' rx='6' ry='11' fill='%23fce7f3' transform='rotate(-50 80 120)'/%3E%3C/svg%3E");
          background-size: contain;
          background-repeat: no-repeat;
          opacity: 0.8;
          pointer-events: none;
        }
        .right-panel::after {
          content: '';
          position: absolute;
          top: -30px;
          left: -30px;
          width: 160px;
          height: 160px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160' fill='none'%3E%3Cpath d='M20 20 Q60 60 80 80 Q100 100 140 140' stroke='%23fce7f3' stroke-width='1.5' stroke-linecap='round'/%3E%3Cellipse cx='80' cy='80' rx='7' ry='12' fill='%23fce7f3' transform='rotate(45 80 80)'/%3E%3C/svg%3E");
          background-size: contain;
          background-repeat: no-repeat;
          opacity: 0.6;
          pointer-events: none;
        }

        .form-inner { width: 100%; max-width: 320px; position: relative; z-index: 1; }

        /* Logo / marca */
        .brand-logo {
          text-align: center;
          margin-bottom: 28px;
        }
        .brand-logo .icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px; height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fce7f3, #fda4af);
          margin-bottom: 12px;
          font-size: 22px;
        }
        .brand-logo h1 {
          font-family: Georgia, serif;
          font-style: italic;
          font-size: 1.6rem;
          color: #1f2937;
          margin-bottom: 4px;
        }
        .brand-logo .sub {
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: #f472b6;
        }
        .brand-divider {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 8px auto 0;
          width: fit-content;
        }
        .brand-divider span {
          width: 32px; height: 1px;
          background: linear-gradient(90deg, transparent, #fda4af);
        }
        .brand-divider span:last-child {
          background: linear-gradient(90deg, #fda4af, transparent);
        }

        /* Encabezado del form */
        .form-header { margin-bottom: 24px; }
        .form-header h2 {
          font-size: 1.35rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 4px;
        }
        .form-header p { font-size: 13px; color: #9ca3af; }

        /* Campos */
        .field-group { margin-bottom: 16px; }
        .field-label {
          display: block;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #6b7280;
          margin-bottom: 6px;
        }
        .field-wrap {
          background: #fafafa;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .field-wrap:focus-within {
          background: #fff;
          border-color: #f472b6;
          box-shadow: 0 0 0 3px rgba(244,114,182,0.12);
        }
        .field-wrap input {
          background: transparent !important;
          border: 0 !important;
          height: 44px;
          font-size: 14px;
          color: #111827;
        }
        .field-wrap input::placeholder { color: #d1d5db; }
        .field-wrap input:focus { outline: none; box-shadow: none; }

        /* Botón */
        .btn-submit {
          width: 100%;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #e11d48 0%, #9f1239 100%);
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.03em;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
          box-shadow: 0 4px 18px rgba(225,29,72,0.28);
          transition: filter 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .btn-submit:hover:not(:disabled) {
          filter: brightness(1.08);
          box-shadow: 0 6px 28px rgba(225,29,72,0.42);
          transform: translateY(-1px);
        }
        .btn-submit:active:not(:disabled) { transform: scale(0.98); }
        .btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        /* Separador */
        .sep {
          display: flex; align-items: center; gap: 10px;
          margin: 18px 0;
        }
        .sep div { flex: 1; height: 1px; background: #f3f4f6; }
        .sep span { font-size: 11px; color: #d1d5db; font-weight: 600; }

        /* Link registro */
        .register-link {
          text-align: center;
          font-size: 13px;
          color: #9ca3af;
        }
        .register-link a {
          font-weight: 700;
          color: #e11d48;
          text-decoration: none;
          transition: color 0.2s;
        }
        .register-link a:hover { color: #9f1239; }

        /* Responsive móvil */
        @media (max-width: 700px) {
          .login-container {
            flex-direction: column;
            border-radius: 24px;
            min-height: unset;
          }
          .left-panel {
            width: 100%;
            height: 220px;
            border-radius: 24px 24px 0 0;
          }
          .left-text h2 { font-size: 1.7rem; }
          .right-panel { padding: 36px 24px; }
        }
      `}</style>

      <div className="login-page">
        <motion.div
          className="login-container"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >

          {/* ── Panel izquierdo ── */}
          <div className="left-panel">
            <img src={FLOWER_PHOTO} alt="Flores Janneth Acevedo" />
            <div className="left-overlay" />
            <div className="left-text">
              <p className="tagline">Boutique Floral de Lujo</p>
              <div className="deco-line" />
              <h2>
                Cada flor<br />
                cuenta una <span>historia</span>
              </h2>
              <p>Ramos únicos para momentos inolvidables.</p>
            </div>
          </div>

          {/* ── Panel derecho ── */}
          <div className="right-panel">
            <motion.div
              className="form-inner"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Logo */}
              <div className="brand-logo">
                <div className="icon">🌸</div>
                <h1>Janneth Acevedo</h1>
                <p className="sub">Florería</p>
                <div className="brand-divider">
                  <span /><span className="text-[9px] text-rose-300 font-black tracking-widest">✦</span><span />
                </div>
              </div>

              {/* Encabezado */}
              <div className="form-header">
                <h2>Bienvenida</h2>
                <p>Inicia sesión para continuar</p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="field-group">
                  <label className="field-label">Correo electrónico</label>
                  <div className="field-wrap">
                    <Input
                      type="email"
                      placeholder="ejemplo@correo.com"
                      icon={<Mail className="w-4 h-4 text-gray-300" />}
                      className="bg-transparent border-0 focus:ring-0 text-sm"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">Contraseña</label>
                  <div className="field-wrap">
                    <Input
                      type="password"
                      placeholder="••••••••"
                      icon={<Lock className="w-4 h-4 text-gray-300" />}
                      className="bg-transparent border-0 focus:ring-0 text-sm"
                      error={errors.password?.message}
                      {...register('password')}
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-submit">
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Ingresando…
                    </>
                  ) : (
                    <>Ingresar al Jardín <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <div className="sep">
                <div /><span>o</span><div />
              </div>

              <p className="register-link">
                ¿Nueva en la boutique?{' '}
                <Link href="/registro">Regístrate aquí</Link>
              </p>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </>
  );
}
