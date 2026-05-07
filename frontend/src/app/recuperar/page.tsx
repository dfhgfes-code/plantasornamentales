'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function RecuperarPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      // Siempre mostramos éxito por seguridad (no revelar si el email existe)
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf7] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10">
          <div className="flex justify-center mb-6">
            <Logo size="md" />
          </div>

          {!sent ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  ¿Olvidaste tu contraseña?
                </h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Ingresa tu correo y te enviaremos un enlace para restablecerla.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                </button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                ¡Correo enviado!
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Si existe una cuenta con <strong>{email}</strong>, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
              </p>
              <p className="text-xs text-gray-400 mb-6">
                Revisa también tu carpeta de spam.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="text-sm text-rose-500 hover:text-rose-600 font-medium transition-colors"
              >
                Intentar con otro correo
              </button>
            </motion.div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-rose-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
