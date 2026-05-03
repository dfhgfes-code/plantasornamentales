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
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ZenGarden } from '@/components/ZenGarden';
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
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-[#fafafa]">
      {/* EL JARDÍN ZEN (ARTÍSTICO Y LIMPIO) */}
      <ZenGarden />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="w-full max-w-[420px] z-30 relative"
      >
        <div className="text-center mb-10">
           <h1 className="text-5xl font-serif italic text-gray-900 tracking-tight">Bienvenida</h1>
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mt-4">Janneth Acevedo · Boutique Floral</p>
        </div>

        <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-white/60 relative overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Correo Electrónico</label>
              <Input
                type="email"
                placeholder="tu@email.com"
                icon={<Mail className="w-4 h-4 text-rose-300" />}
                className="bg-transparent border-b border-x-0 border-t-0 border-gray-100 rounded-none focus:ring-0 focus:border-rose-400 transition-all px-0 h-12 text-gray-800"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Contraseña</label>
              <Input
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4 text-rose-300" />}
                className="bg-transparent border-b border-x-0 border-t-0 border-gray-100 rounded-none focus:ring-0 focus:border-rose-400 transition-all px-0 h-12 text-gray-800"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Button 
              type="submit" 
              loading={loading} 
              className="w-full h-16 bg-gray-900 hover:bg-black text-white rounded-2xl text-base font-bold shadow-2xl transition-all active:scale-95 group"
            >
              <span className="flex items-center justify-center gap-3">
                ENTRAR AL JARDÍN
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </form>

          <div className="mt-10 text-center relative z-10">
            <Link href="/registro" className="text-xs text-gray-400 hover:text-rose-500 transition-all font-medium">
              ¿Nueva aquí? <span className="text-gray-900 font-bold border-b border-gray-900 pb-0.5">Crea tu cuenta</span>
            </Link>
          </div>
        </div>
        
        <div className="mt-12 text-center opacity-30">
           <p className="text-[9px] font-bold uppercase tracking-[0.6em] text-gray-400">
             Arte & Naturaleza
           </p>
        </div>
      </motion.div>
    </div>
  );
}
