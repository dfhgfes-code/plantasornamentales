'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BloomingBouquet } from '@/components/BloomingBouquet';
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
      toast.success(`¡Bienvenida, ${user.firstName}! 🌸`);
      router.push(user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/perfil');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-slate-50">
      {/* Fondo Animado de Flores */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-sky-50 animate-gradient" />
        
        {/* Pétalos/Flores flotantes (CSS Puro) */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-random opacity-20 pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${20 + Math.random() * 30}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`
            }}
          >
            {['🌸', '🌷', '🌹', '🌻', '🍃'][i % 5]}
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float-random {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, 50px) rotate(120deg); }
          66% { transform: translate(-20px, 100px) rotate(240deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
        .animate-float-random {
          animation: float-random linear infinite;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.05);
        }
      `}} />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-6">
          <div className="scale-110 drop-shadow-2xl">
            <BloomingBouquet />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Bienvenida de vuelta</h1>
          <p className="text-gray-500 mt-2 font-medium">Tu jardín personal te espera 🌸</p>
        </div>

        <div className="glass-card rounded-[2.5rem] p-10 relative overflow-hidden group">
          {/* Brillo decorativo */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-200/30 rounded-full blur-3xl group-hover:bg-rose-300/40 transition-colors" />
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-1 block">Identidad</label>
              <Input
                type="email"
                placeholder="tu@email.com"
                icon={<Mail className="w-4 h-4 text-rose-400" />}
                className="bg-white/50 border-white/50 rounded-2xl focus:bg-white transition-all h-12"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-1 block">Llave de acceso</label>
              <Input
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4 text-rose-400" />}
                className="bg-white/50 border-white/50 rounded-2xl focus:bg-white transition-all h-12"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Button 
              type="submit" 
              loading={loading} 
              className="w-full h-14 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-2xl text-lg font-bold shadow-xl shadow-rose-200 hover:shadow-rose-300 transition-all group/btn"
              size="lg"
            >
              <span className="flex items-center justify-center gap-2">
                Entrar al Jardín
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100/50 text-center relative z-10">
            <p className="text-sm text-gray-500">
              ¿Nueva en el club?{' '}
              <Link href="/registro" className="text-rose-500 hover:text-rose-600 font-bold underline-offset-4 hover:underline">
                Crea tu cuenta aquí
              </Link>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
          Janneth Acevedo · Flores & Plantas
        </p>
      </div>
    </div>
  );
}
