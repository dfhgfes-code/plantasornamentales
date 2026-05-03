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
    <div className="min-h-screen flex">

      {/* ── Panel izquierdo: imagen + marca ── */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-14"
        style={{
          background: 'linear-gradient(160deg, #f8e8ee 0%, #fce4ec 40%, #f3e5f5 100%)',
        }}
      >
        {/* Círculos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.05) 0%, transparent 60%)' }} />
        </div>

        {/* Logo arriba */}
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌸</span>
            <span className="text-sm font-bold tracking-widest uppercase text-rose-400">Janneth Acevedo</span>
          </div>
        </div>

        {/* Contenido central */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Ilustración floral grande */}
          <div className="mb-10">
            <svg width="280" height="220" viewBox="0 0 280 220" fill="none" overflow="visible">
              {/* Tallos */}
              <motion.path d="M140 220 Q136 185 140 150" stroke="#6aad7a" strokeWidth="3" strokeLinecap="round" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.4 }} />
              <motion.path d="M140 195 Q112 178 92 155" stroke="#5a9e6f" strokeWidth="2.5" strokeLinecap="round" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.6 }} />
              <motion.path d="M140 195 Q168 178 188 155" stroke="#5a9e6f" strokeWidth="2.5" strokeLinecap="round" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.6 }} />
              <motion.path d="M140 180 Q108 162 82 138" stroke="#4a8c5c" strokeWidth="2" strokeLinecap="round" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.8 }} />
              <motion.path d="M140 180 Q172 162 198 138" stroke="#4a8c5c" strokeWidth="2" strokeLinecap="round" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.8 }} />
              <motion.path d="M140 170 Q122 148 118 122" stroke="#5a9e6f" strokeWidth="1.8" strokeLinecap="round" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 1.0 }} />
              <motion.path d="M140 170 Q158 148 162 122" stroke="#5a9e6f" strokeWidth="1.8" strokeLinecap="round" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 1.0 }} />

              {/* Hojas */}
              {[
                { d: "M140 192 Q124 183 127 172 Q136 177 140 192Z", delay: 1.3 },
                { d: "M140 192 Q156 183 153 172 Q144 177 140 192Z", delay: 1.4 },
                { d: "M116 168 Q100 158 105 146 Q115 153 116 168Z", delay: 1.5 },
                { d: "M164 168 Q180 158 175 146 Q165 153 164 168Z", delay: 1.5 },
              ].map((l, i) => (
                <motion.path key={i} d={l.d} fill="#6aad7a" opacity="0.7"
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.7 }}
                  transition={{ duration: 0.6, delay: l.delay, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{ transformOrigin: '140px 192px' }} />
              ))}

              {/* Rosa central — pétalos exteriores */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
                const rad = a * Math.PI / 180;
                const cx = 140 + Math.sin(rad) * 16;
                const cy = 150 - Math.cos(rad) * 16;
                return (
                  <motion.ellipse key={`rco${i}`} cx={cx} cy={cy} rx="9" ry="18"
                    fill={i % 2 === 0 ? '#f9a8d4' : '#f472b6'} opacity="0.9"
                    transform={`rotate(${a} ${cx} ${cy})`}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.6 + i * 0.06, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{ transformOrigin: `${cx}px ${cy}px` }} />
                );
              })}
              {/* Rosa central — pétalos interiores */}
              {[0, 60, 120, 180, 240, 300].map((a, i) => {
                const rad = a * Math.PI / 180;
                const cx = 140 + Math.sin(rad) * 9;
                const cy = 150 - Math.cos(rad) * 9;
                return (
                  <motion.ellipse key={`rci${i}`} cx={cx} cy={cy} rx="6" ry="12"
                    fill="#ec4899" opacity="0.95"
                    transform={`rotate(${a} ${cx} ${cy})`}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 2.1 + i * 0.05, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{ transformOrigin: `${cx}px ${cy}px` }} />
                );
              })}
              <motion.circle cx="140" cy="150" r="8" fill="#fbbf24"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ duration: 0.35, delay: 2.5, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ transformOrigin: '140px 150px' }} />
              <motion.circle cx="140" cy="150" r="4" fill="#f59e0b"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ duration: 0.25, delay: 2.7 }}
                style={{ transformOrigin: '140px 150px' }} />

              {/* Flor izquierda — lila */}
              {[0, 72, 144, 216, 288].map((a, i) => {
                const rad = a * Math.PI / 180;
                const cx = 92 + Math.sin(rad) * 11;
                const cy = 155 - Math.cos(rad) * 11;
                return (
                  <motion.ellipse key={`fl${i}`} cx={cx} cy={cy} rx="6" ry="13"
                    fill={i % 2 === 0 ? '#c4b5fd' : '#a78bfa'} opacity="0.88"
                    transform={`rotate(${a} ${cx} ${cy})`}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ duration: 0.45, delay: 1.8 + i * 0.07, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{ transformOrigin: `${cx}px ${cy}px` }} />
                );
              })}
              <motion.circle cx="92" cy="155" r="6" fill="#fde68a"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 2.2, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ transformOrigin: '92px 155px' }} />

              {/* Flor derecha — durazno */}
              {[0, 72, 144, 216, 288].map((a, i) => {
                const rad = a * Math.PI / 180;
                const cx = 188 + Math.sin(rad) * 11;
                const cy = 155 - Math.cos(rad) * 11;
                return (
                  <motion.ellipse key={`fr${i}`} cx={cx} cy={cy} rx="6" ry="13"
                    fill={i % 2 === 0 ? '#fed7aa' : '#fb923c'} opacity="0.88"
                    transform={`rotate(${a} ${cx} ${cy})`}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ duration: 0.45, delay: 1.8 + i * 0.07, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{ transformOrigin: `${cx}px ${cy}px` }} />
                );
              })}
              <motion.circle cx="188" cy="155" r="6" fill="#fde68a"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 2.2, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ transformOrigin: '188px 155px' }} />

              {/* Flores pequeñas laterales */}
              {[
                { cx: 82, cy: 138, color1: '#fce7f3', color2: '#fbcfe8', delay: 2.0 },
                { cx: 198, cy: 138, color1: '#fca5a5', color2: '#f87171', delay: 2.0 },
                { cx: 118, cy: 122, color1: '#f472b6', color2: '#db2777', delay: 2.3 },
                { cx: 162, cy: 122, color1: '#c084fc', color2: '#9333ea', delay: 2.3 },
              ].map((f, fi) => (
                [0, 60, 120, 180, 240, 300].map((a, i) => {
                  const rad = a * Math.PI / 180;
                  const cx = f.cx + Math.sin(rad) * 8;
                  const cy = f.cy - Math.cos(rad) * 8;
                  return (
                    <motion.ellipse key={`fs${fi}-${i}`} cx={cx} cy={cy} rx="4" ry="9"
                      fill={i % 2 === 0 ? f.color1 : f.color2} opacity="0.82"
                      transform={`rotate(${a} ${cx} ${cy})`}
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: f.delay + i * 0.06, ease: [0.34, 1.56, 0.64, 1] }}
                      style={{ transformOrigin: `${cx}px ${cy}px` }} />
                  );
                })
              ))}
              {[
                { cx: 82, cy: 138 }, { cx: 198, cy: 138 },
                { cx: 118, cy: 122 }, { cx: 162, cy: 122 },
              ].map((c, i) => (
                <motion.circle key={`fc${i}`} cx={c.cx} cy={c.cy} r="4" fill="#fbbf24"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ duration: 0.25, delay: 2.6 + i * 0.1 }}
                  style={{ transformOrigin: `${c.cx}px ${c.cy}px` }} />
              ))}
            </svg>
          </div>

          <h2
            className="text-4xl xl:text-5xl text-gray-800 leading-tight mb-4"
            style={{ fontFamily: "Georgia, serif", fontStyle: 'italic' }}
          >
            Donde cada flor<br />cuenta una historia
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Flores frescas, suscripciones personalizadas y arreglos premium para transformar cada momento.
          </p>
        </motion.div>

        {/* Pie del panel */}
        <div className="relative z-10">
          <p className="text-[10px] text-gray-300 uppercase tracking-widest">
            © 2025 Janneth Acevedo · Boutique Floral
          </p>
        </div>
      </div>

      {/* ── Panel derecho: formulario ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo móvil (solo visible en móvil) */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <span className="text-xl">🌸</span>
            <span className="text-sm font-bold tracking-widest uppercase text-rose-400">Janneth Acevedo</span>
          </div>

          {/* Encabezado */}
          <div className="mb-8">
            <h1
              className="text-3xl text-gray-900 mb-1"
              style={{ fontFamily: "Georgia, serif", fontStyle: 'italic' }}
            >
              Bienvenida
            </h1>
            <p className="text-gray-400 text-sm">Ingresa a tu cuenta para continuar</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Correo electrónico
              </label>
              <Input
                type="email"
                placeholder="tu@email.com"
                icon={<Mail className="w-4 h-4 text-gray-300" />}
                className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-gray-900 text-sm placeholder:text-gray-300 transition-all"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4 text-gray-300" />}
                className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-gray-900 text-sm placeholder:text-gray-300 transition-all"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: loading ? '#9f1239' : 'linear-gradient(135deg, #e11d48 0%, #9f1239 100%)',
                boxShadow: '0 4px 20px rgba(225,29,72,0.25)',
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 28px rgba(225,29,72,0.40)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(225,29,72,0.25)'; }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Ingresando…
                </>
              ) : (
                <>
                  Ingresar al Jardín
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Separador */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-300">o</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Registro */}
          <p className="text-sm text-gray-400 text-center">
            ¿Nueva en la boutique?{' '}
            <Link href="/registro" className="font-semibold text-rose-500 hover:text-rose-600 transition-colors">
              Regístrate aquí
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
