'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EpicGarden } from '@/components/EpicGarden';
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
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden py-20 bg-slate-50">
      {/* FONDO FOTOGRÁFICO DE ALTA CALIDAD */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105 animate-slow-zoom"
        style={{ backgroundImage: "url('/images/boutique-bg.png')" }}
      />
      <div className="absolute inset-0 z-10 bg-white/20 backdrop-blur-[1px]" />
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-white via-transparent to-white/40" />

      {/* JARDÍN ÉPICO (FLORES CRECIENDO) */}
      <EpicGarden />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 30s ease-in-out infinite alternate;
        }
        .luxury-glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.12);
        }
      `}} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-[460px] z-30 relative"
      >
        <div className="text-center mb-10">
           <h1 className="text-5xl font-serif italic text-gray-900 tracking-tight drop-shadow-sm">Janneth Acevedo</h1>
           <p className="text-[11px] font-black uppercase tracking-[0.4em] text-rose-500 mt-3 border-t border-rose-100 pt-3 inline-block">
             Boutique Floral de Lujo
           </p>
        </div>

        <div className="luxury-glass rounded-[3.5rem] p-12 relative overflow-hidden group">
          {/* Luz interna decorativa */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-200/20 rounded-full blur-3xl group-hover:bg-rose-300/30 transition-colors" />

          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Bienvenida de vuelta</h2>
            <p className="text-gray-500 mt-2 text-sm">Tu espacio personal en nuestro jardín.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Tu Cuenta</label>
              <Input
                type="email"
                placeholder="tu@email.com"
                icon={<Mail className="w-5 h-5 text-rose-300" />}
                className="bg-white/40 border-white/60 rounded-3xl h-14 focus:bg-white transition-all pl-12"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Tu Contraseña</label>
              <Input
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-5 h-5 text-rose-300" />}
                className="bg-white/40 border-white/60 rounded-3xl h-14 focus:bg-white transition-all pl-12"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Button 
              type="submit" 
              loading={loading} 
              className="w-full h-18 bg-gray-900 hover:bg-black text-white rounded-3xl text-lg font-bold shadow-2xl transition-all active:scale-95 group/btn overflow-hidden"
              size="lg"
            >
              <span className="flex items-center justify-center gap-3 relative z-10">
                Ingresar al Jardín
                <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </Button>
          </form>

          <div className="mt-12 text-center relative z-10">
            <Link href="/registro" className="text-sm font-medium text-gray-500 hover:text-rose-600 transition-colors">
              ¿Nueva en la boutique? <span className="text-gray-900 font-bold border-b border-gray-900 pb-0.5">Regístrate aquí</span>
            </Link>
          </div>
        </div>
        
        <div className="mt-14 text-center opacity-40">
           <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-400">
             Luxury Flower Boutique · Experiencias Reales
           </p>
        </div>
      </motion.div>
    </div>
  );
}
