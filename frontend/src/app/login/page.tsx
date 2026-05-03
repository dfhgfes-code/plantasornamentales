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
import { SurpriseGarden } from '@/components/SurpriseGarden';
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
      toast.success(`¡Bienvenida, ${user.firstName}! 🌹`);
      router.push(user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/perfil');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* ANIMACIÓN DE SORPRESA (Caja que se abre y crecen rosas) */}
        <SurpriseGarden />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Janneth Acevedo</h1>
          <p className="text-pink-500 font-bold uppercase tracking-widest text-xs mt-1">Boutique Floral</p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-10">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-bold text-gray-800">Bienvenida de vuelta</h2>
            <p className="text-gray-400 text-sm mt-1">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@email.com"
              icon={<Mail className="w-4 h-4 text-gray-400" />}
              className="rounded-2xl"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4 text-gray-400" />}
              className="rounded-2xl"
              error={errors.password?.message}
              {...register('password')}
            />
            
            <div className="pt-2">
              <Button 
                type="submit" 
                loading={loading} 
                className="w-full h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl text-lg font-bold shadow-lg shadow-pink-100 transition-all active:scale-95"
              >
                <span className="flex items-center justify-center gap-2">
                  Ingresar
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-pink-500 hover:text-pink-600 font-bold underline-offset-4 hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </div>
        
        <p className="text-center mt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">
          Experiencias que Florecen
        </p>
      </div>
    </div>
  );
}
