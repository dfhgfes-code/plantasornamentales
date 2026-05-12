'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Flower2, User, Mail, Lock, Phone } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const schema = z.object({
  firstName: z.string().min(2, 'Mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Correo inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  phone: z.string().optional(),
  role: z.enum(['customer', 'wholesaler']),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'customer' }
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await authApi.register(data);
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      toast.success('¡Cuenta creada exitosamente! 🌸');
      router.push('/perfil');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-rose-100 rounded-2xl mb-4">
            <Flower2 className="w-7 h-7 text-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Crea tu cuenta</h1>
          <p className="text-gray-500 mt-1">Empieza a recibir flores hoy mismo</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de cuenta</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setValue('role', 'customer')}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${watch('role') === 'customer' ? 'border-rose-500 bg-rose-50 text-rose-700 font-semibold' : 'border-gray-100 hover:border-gray-200 text-gray-500 font-medium'}`}
                >
                  Cliente
                </button>
                <button
                  type="button"
                  onClick={() => setValue('role', 'wholesaler')}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${watch('role') === 'wholesaler' ? 'border-rose-500 bg-rose-50 text-rose-700 font-semibold' : 'border-gray-100 hover:border-gray-200 text-gray-500 font-medium'}`}
                >
                  Mayorista
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Nombre" placeholder="María" icon={<User className="w-4 h-4" />} error={errors.firstName?.message} {...register('firstName')} />
              <Input label="Apellido" placeholder="García" error={errors.lastName?.message} {...register('lastName')} />
            </div>
            <Input label="Correo electrónico" type="email" placeholder="tu@email.com" icon={<Mail className="w-4 h-4" />} error={errors.email?.message} {...register('email')} />
            <Input label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" icon={<Lock className="w-4 h-4" />} error={errors.password?.message} {...register('password')} />
            <Input label="Teléfono (opcional)" placeholder="3001234567" icon={<Phone className="w-4 h-4" />} {...register('phone')} />
            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              Crear cuenta
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-rose-500 hover:text-rose-600 font-medium">Ingresar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
