'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LivingGarden } from '@/components/LivingGarden';
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      toast.success(`¡Bienvenida al Jardín Sagrado, ${user.firstName}! 🌸✨`);
      router.push(user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/perfil');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden py-20">
      <LivingGarden />

      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[480px] z-30 relative"
      >
        <div className="absolute -top-10 -left-10 text-6xl animate-bounce opacity-80">🌸</div>
        <div className="absolute -bottom-10 -right-10 text-6xl animate-pulse opacity-80">🌻</div>

        <div className="text-center mb-8 relative">
           <motion.div 
             animate={{ rotate: [0, 5, -5, 0] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             className="inline-block p-6 bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl mb-6 border border-white/60"
           >
             <Sparkles className="w-12 h-12 text-rose-500 animate-pulse" />
           </motion.div>
           <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tighter drop-shadow-sm">
             ¡ENTRA AL <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-500">JARDÍN!</span>
           </h1>
           <p className="text-gray-600 mt-3 font-bold text-lg">Inicia sesión para una experiencia mágica</p>
        </div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white/60 backdrop-blur-3xl rounded-[3.5rem] p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/80 relative group overflow-hidden"
        >
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-300/20 rounded-full blur-3xl" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Tu Identidad Floral</label>
              <Input
                type="email"
                placeholder="tu@email.com"
                icon={<Mail className="w-5 h-5 text-rose-500" />}
                className="bg-white/80 border-white rounded-3xl h-16 text-lg focus:shadow-2xl transition-all pl-14"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Tu Contraseña Mágica</label>
              <Input
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-5 h-5 text-rose-500" />}
                className="bg-white/80 border-white rounded-3xl h-16 text-lg focus:shadow-2xl transition-all pl-14"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Button 
              type="submit" 
              loading={loading} 
              className="w-full h-20 bg-gradient-to-br from-rose-500 via-pink-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-[2rem] text-xl font-black shadow-2xl shadow-rose-200 hover:shadow-rose-400 transition-all active:scale-95 group overflow-hidden relative"
              size="lg"
            >
              <span className="flex items-center justify-center gap-4 relative z-10">
                ¡EMPEZAR LA MAGIA!
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
            </Button>
          </form>

          <div className="mt-10 text-center relative z-10">
            <Link href="/registro" className="text-sm font-bold text-gray-500 hover:text-rose-600 transition-all flex items-center justify-center gap-2 group">
              ¿Aún no eres parte del club? 
              <span className="text-gray-900 border-b-2 border-rose-500 group-hover:border-rose-600 pb-0.5">Regístrate Aquí</span>
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mt-12 text-center"
        >
           <p className="text-[12px] font-black uppercase tracking-[0.5em] text-gray-400">
             Janneth Acevedo · El Jardín de tus Sueños
           </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
