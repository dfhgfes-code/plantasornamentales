'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, ArrowLeft, ArrowRight, MapPin, User, FileText, CreditCard, Building2, Smartphone, CheckCircle, Loader2 } from 'lucide-react';
import { plansApi, subscriptionsApi, recipientsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

type Step = 'plan' | 'recipient' | 'payment' | 'success';

export default function PlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('plan');
  const [submitting, setSubmitting] = useState(false);

  const [recipient, setRecipient] = useState({
    fullName: '',
    address: '',
    city: '',
    phone: '',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [subscriptionId, setSubscriptionId] = useState('');

  useEffect(() => {
    if (!id) return;
    plansApi.getOne(id)
      .then(r => setPlan(r.data.data))
      .catch(() => router.push('/planes'))
      .finally(() => setLoading(false));
  }, [id]);

  const freq = plan?.frequency === 'weekly' ? 'semana' : 'mes';

  const handleCreateSubscription = async () => {
    if (!recipient.fullName || !recipient.address || !recipient.city) {
      toast.error('Completa todos los campos obligatorios');
      return;
    }
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para suscribirte');
      router.push('/login');
      return;
    }
    setSubmitting(true);
    try {
      // Crear destinatario
      const recRes = await recipientsApi.create({
        fullName: recipient.fullName,
        address: recipient.address,
        city: recipient.city,
        phone: recipient.phone,
        notes: recipient.notes,
      });
      const recipientId = recRes.data.data.id;

      // Crear suscripción
      const subRes = await subscriptionsApi.create({
        planId: id,
        recipientId,
        paymentMethod,
      });
      setSubscriptionId(subRes.data.data.id);
      setStep('success');
      toast.success('¡Suscripción creada exitosamente! 🌸');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al crear la suscripción');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7]">
      <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
    </div>
  );

  if (!plan) return null;

  const steps = [
    { key: 'plan', label: 'Plan', num: '1' },
    { key: 'recipient', label: 'Destinatario', num: '2' },
    { key: 'payment', label: 'Pago', num: '3' },
  ];

  return (
    <div className="min-h-screen bg-[#fdfaf7]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/planes" className="flex items-center gap-2 text-sm text-gray-500 hover:text-rose-600 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Volver a planes
          </Link>
          {step !== 'success' && (
            <div className="flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={s.key} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                    step === s.key ? 'text-rose-600' : steps.indexOf(steps.find(x => x.key === step)!) > i ? 'text-green-600' : 'text-gray-300'
                  }`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      step === s.key ? 'bg-rose-500 text-white' : steps.indexOf(steps.find(x => x.key === step)!) > i ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {steps.indexOf(steps.find(x => x.key === step)!) > i ? '✓' : s.num}
                    </span>
                    <span className="hidden sm:block">{s.label}</span>
                  </div>
                  {i < steps.length - 1 && <div className="w-6 h-px bg-gray-200" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatePresence mode="wait">

          {/* ── Paso 1: Resumen del plan ── */}
          {step === 'plan' && (
            <motion.div key="plan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Card del plan */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-rose-100">
                  <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-8">
                    <span className="text-4xl mb-4 block">{plan.frequency === 'weekly' ? '🌷' : '🌹'}</span>
                    <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {plan.name}
                    </h1>
                    <p className="text-rose-100 text-sm leading-relaxed">{plan.description}</p>
                    <div className="mt-5 flex items-end gap-1.5">
                      <span className="text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {formatCurrency(Number(plan.price))}
                      </span>
                      <span className="text-rose-200 text-sm mb-1.5">/{freq}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    {plan.features && plan.features.length > 0 && (
                      <ul className="space-y-3">
                        {plan.features.map((f: string) => (
                          <li key={f} className="flex items-start gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-rose-50 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-rose-500" />
                            </div>
                            <span className="text-sm text-gray-600">{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Info y CTA */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                      ¿Listo para suscribirte?
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      En el siguiente paso indicarás a quién le llegará el ramo y la dirección de entrega. Puedes pausar o cancelar cuando quieras.
                    </p>
                  </div>

                  <div className="bg-rose-50 rounded-2xl p-5 space-y-3">
                    {[
                      { icon: '🚚', text: 'Envío incluido en el precio' },
                      { icon: '⏸️', text: 'Pausa o cancela cuando quieras' },
                      { icon: '🌸', text: 'Flores frescas de temporada' },
                      { icon: '🎁', text: 'Nota de regalo incluida' },
                    ].map(item => (
                      <div key={item.text} className="flex items-center gap-3 text-sm text-gray-700">
                        <span>{item.icon}</span>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>

                  {!isAuthenticated ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                      <p className="text-sm text-amber-700 font-medium mb-3">Necesitas iniciar sesión para suscribirte</p>
                      <Link href="/login"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-sm transition-all">
                        Iniciar sesión <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={() => setStep('recipient')}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-rose-200"
                    >
                      Continuar <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Paso 2: Destinatario ── */}
          {step === 'recipient' && (
            <motion.div key="recipient" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="max-w-lg mx-auto">
                <div className="text-center mb-8">
                  <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User className="w-7 h-7 text-rose-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    ¿A quién le enviamos?
                  </h2>
                  <p className="text-gray-500 text-sm">Puedes enviarlo a ti mismo o a alguien especial</p>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre completo *</label>
                    <input
                      value={recipient.fullName}
                      onChange={e => setRecipient(r => ({ ...r, fullName: e.target.value }))}
                      placeholder="María García"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Dirección de entrega *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        value={recipient.address}
                        onChange={e => setRecipient(r => ({ ...r, address: e.target.value }))}
                        placeholder="Calle 45 # 12-34 Apto 201"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Ciudad *</label>
                      <input
                        value={recipient.city}
                        onChange={e => setRecipient(r => ({ ...r, city: e.target.value }))}
                        placeholder="Bogotá"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono</label>
                      <input
                        value={recipient.phone}
                        onChange={e => setRecipient(r => ({ ...r, phone: e.target.value }))}
                        placeholder="3001234567"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <FileText className="inline w-3.5 h-3.5 mr-1" />
                      Nota de regalo (opcional)
                    </label>
                    <textarea
                      value={recipient.notes}
                      onChange={e => setRecipient(r => ({ ...r, notes: e.target.value }))}
                      placeholder="Con amor para ti... 🌸"
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setStep('plan')}
                      className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50 transition-all">
                      Atrás
                    </button>
                    <button
                      onClick={() => {
                        if (!recipient.fullName || !recipient.address || !recipient.city) {
                          toast.error('Completa los campos obligatorios');
                          return;
                        }
                        setStep('payment');
                      }}
                      className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                    >
                      Continuar <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Paso 3: Pago ── */}
          {step === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="max-w-lg mx-auto">
                <div className="text-center mb-8">
                  <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-7 h-7 text-rose-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Método de pago
                  </h2>
                  <p className="text-gray-500 text-sm">Pago seguro procesado por Wompi</p>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7 space-y-5">
                  {/* Resumen */}
                  <div className="bg-rose-50 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{plan.name}</p>
                      <p className="text-xs text-gray-500">Para: {recipient.fullName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-rose-600 text-lg">{formatCurrency(Number(plan.price))}</p>
                      <p className="text-xs text-gray-400">/{freq}</p>
                    </div>
                  </div>

                  {/* Métodos */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Selecciona tu método</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'CARD', icon: CreditCard, label: 'Tarjeta' },
                        { id: 'PSE', icon: Building2, label: 'PSE' },
                        { id: 'NEQUI', icon: Smartphone, label: 'Nequi' },
                      ].map(({ id: mid, icon: Icon, label }) => (
                        <button key={mid} onClick={() => setPaymentMethod(mid)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                            paymentMethod === mid
                              ? 'border-rose-400 bg-rose-50'
                              : 'border-gray-200 hover:border-rose-200'
                          }`}>
                          <Icon className={`w-5 h-5 ${paymentMethod === mid ? 'text-rose-500' : 'text-gray-400'}`} />
                          <span className={`text-xs font-semibold ${paymentMethod === mid ? 'text-rose-600' : 'text-gray-500'}`}>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-2 text-xs text-blue-700">
                    🔒 Tus datos de pago están protegidos con cifrado SSL
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep('recipient')}
                      className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50 transition-all">
                      Atrás
                    </button>
                    <button
                      onClick={handleCreateSubscription}
                      disabled={submitting}
                      className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
                      ) : (
                        <>Confirmar suscripción <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Éxito ── */}
          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center py-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                ¡Suscripción activa!
              </h2>
              <p className="text-gray-500 leading-relaxed mb-2">
                Tu suscripción a <strong>{plan.name}</strong> ha sido creada exitosamente.
              </p>
              <p className="text-gray-400 text-sm mb-8">
                Las flores llegarán a <strong>{recipient.fullName}</strong> en {recipient.city} según la frecuencia del plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/perfil"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl text-sm transition-all">
                  Ver mis suscripciones
                </Link>
                <Link href="/tienda"
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium rounded-2xl text-sm transition-all">
                  Ir a la tienda
                </Link>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
