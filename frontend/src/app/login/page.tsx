'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LuxuryGiftSurprise } from '@/components/LuxuryGiftSurprise';
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
      toast.success(`¡Bienvenida al jardín, ${user.firstName}! 🌹`);
      router.push(user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/perfil');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Fondo con textura sutil */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/clean-gray-paper.png")' }} />

      <div className="w-full max-w-lg z-10">
        {/* LA SORPRESA DE LUJO */}
        <LuxuryGiftSurprise />

        <div className="text-center mb-10 relative">
          <h1 className="text-4xl font-serif italic text-gray-900 tracking-tight">Janneth Acevedo</h1>
          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="h-[1px] w-8 bg-pink-200" />
            <p className="text-pink-500 font-bold uppercase tracking-[0.3em] text-[10px]">Boutique Floral</p>
            <span className="h-[1px] w-8 bg-pink-200" />
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-gray-100 p-12 relative group">
          {/* Brillo decorativo en la esquina de la tarjeta */}
          <div className="absolute top-0 right-0 p-6 opacity-20 text-pink-300">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Bienvenida de vuelta</h2>
            <p className="text-gray-400 text-sm mt-2">Es un placer tenerte nuevamente en nuestro jardín.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 mb-1 block">Tu Cuenta</label>
              <Input
                type="email"
                placeholder="tu@email.com"
                icon={<Mail className="w-4 h-4 text-pink-400" />}
                className="rounded-2xl border-gray-100 focus:border-pink-300 h-14 transition-all bg-gray-50/30"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 mb-1 block">Tu Contraseña</label>
              <Input
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4 text-pink-400" />}
                className="rounded-2xl border-gray-100 focus:border-pink-300 h-14 transition-all bg-gray-50/30"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                loading={loading} 
                className="w-full h-16 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white rounded-2xl text-lg font-bold shadow-2xl transition-all active:scale-95 group"
              >
                <span className="flex items-center justify-center gap-3">
                  Ingresar a la Boutique
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </form>

          <div className="mt-12 text-center pt-8 border-t border-gray-50">
            <p className="text-sm text-gray-400">
              ¿Aún no eres parte del club?{' '}
              <Link href="/registro" className="text-gray-900 font-bold border-b-2 border-pink-200 hover:border-pink-500 transition-all pb-0.5">
                Regístrate ahora
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-16 text-center">
           <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-300">
             Luxury Experiences · Handmade with Love
           </p>
        </div>
      </div>
    </div>
  );
}
