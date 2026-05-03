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
      toast.success(`¡Bienvenida de vuelta! 🌸`);
      router.push(user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/perfil');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] scale-110 animate-subtle-zoom"
        style={{ backgroundImage: "url('/images/login-bg.png')" }}
      />
      <div className="absolute inset-0 z-10 bg-white/20 backdrop-blur-[2px]" />
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-white via-white/40 to-transparent" />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes subtle-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-subtle-zoom {
          animation: subtle-zoom 20s ease-in-out infinite alternate;
        }
        .glass-container {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.15);
        }
      `}} />

      <div className="w-full max-w-[440px] z-30">
        <div className="text-center mb-10">
           <div className="inline-block p-4 bg-white/80 backdrop-blur-md rounded-full shadow-sm mb-6 border border-white">
             <span className="text-4xl">🌸</span>
           </div>
           <h1 className="text-4xl font-serif italic text-gray-900 leading-tight">Bienvenida</h1>
           <p className="text-gray-500 mt-3 font-medium tracking-wide uppercase text-[10px]">Inicia sesión en tu cuenta</p>
        </div>

        <div className="glass-container rounded-[3rem] p-12 relative overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Email</label>
              <Input
                type="email"
                placeholder="tu@email.com"
                icon={<Mail className="w-4 h-4 text-pink-300" />}
                className="bg-transparent border-b-2 border-x-0 border-t-0 border-gray-100 rounded-none focus:ring-0 focus:border-pink-500 transition-all px-0 h-12 text-lg"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Contraseña</label>
              <Input
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4 text-pink-300" />}
                className="bg-transparent border-b-2 border-x-0 border-t-0 border-gray-100 rounded-none focus:ring-0 focus:border-pink-500 transition-all px-0 h-12 text-lg"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Button 
              type="submit" 
              loading={loading} 
              className="w-full h-16 bg-gray-900 hover:bg-black text-white rounded-full text-lg font-medium shadow-2xl transition-all active:scale-95 group"
            >
              <span className="flex items-center justify-center gap-3">
                Ingresar ahora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </form>

          <div className="mt-10 text-center relative z-10">
            <Link href="/registro" className="text-sm text-gray-400 hover:text-pink-500 transition-colors font-medium">
              ¿No tienes cuenta? <span className="text-gray-900 font-bold border-b border-gray-900 pb-0.5">Regístrate gratis</span>
            </Link>
          </div>
        </div>
        
        <div className="mt-12 flex items-center justify-center gap-8 opacity-40">
           <span className="h-[1px] w-12 bg-gray-300" />
           <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-400 whitespace-nowrap">
             Janneth Acevedo · Luxury Flowers
           </p>
           <span className="h-[1px] w-12 bg-gray-300" />
        </div>
      </div>
    </div>
  );
}
