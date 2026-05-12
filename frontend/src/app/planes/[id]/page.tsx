'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Check, ArrowLeft, ArrowRight, MapPin, User, Gift,
  CreditCard, Building2, Smartphone, CheckCircle, Loader2, Shield, Flower2
} from 'lucide-react';
import { plansApi, subscriptionsApi, recipientsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

type Step = 'plan' | 'recipient' | 'payment' | 'success';

export default function PlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('plan');
  const [submitting, setSubmitting] = useState(false);
  const [recipient, setRecipient] = useState({ fullName: '', address: '', city: '', phone: '', notes: '' });
  const [paymentMethod, setPaymentMethod] = useState('CARD');

  useEffect(() => {
    if (!id) return;
    plansApi.getOne(id)
      .then(r => setPlan(r.data.data))
      .catch(() => router.push('/planes'))
      .finally(() => setLoading(false));
  }, [id]);

  const freq = plan?.intervalDays === 1 ? 'día' : 
               [7, 8].includes(plan?.intervalDays) ? 'semana' : 
               plan?.intervalDays === 15 ? 'quincena' : 
               [30, 31].includes(plan?.intervalDays) ? 'mes' : 
               `${plan?.intervalDays} días`;
  const freqLabel = plan?.intervalDays === 1 ? 'Diario' : 
                    [7, 8].includes(plan?.intervalDays) ? 'Semanal' : 
                    plan?.intervalDays === 15 ? 'Quincenal' : 
                    [30, 31].includes(plan?.intervalDays) ? 'Mensual' : 
                    `Cada ${plan?.intervalDays} días`;
  const isWeekly = plan?.intervalDays < 30;

  const handleCreateSubscription = async () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    setSubmitting(true);
    try {
      const recRes = await recipientsApi.create(recipient);
      await subscriptionsApi.create({ planId: id, recipientId: recRes.data.data.id, paymentMethod });
      setStep('success');
      toast.success('¡Suscripción creada! 🌸');
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

  const stepList = [
    { key: 'plan', label: 'Plan' },
    { key: 'recipient', label: 'Destinatario' },
    { key: 'payment', label: 'Pago' },
  ];
  const currentIdx = stepList.findIndex(s => s.key === step);

  return (
    <div className="min-h-screen bg-[#fdfaf7] px-4 py-10">
      <div className="max-w-lg mx-auto">

        {/* Botón atrás */}
        {step !== 'success' && (
          <button
            onClick={() => {
              if (step === 'plan') router.push('/planes');
              else if (step === 'recipient') setStep('plan');
              else if (step === 'payment') setStep('recipient');
            }}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-rose-600 font-medium mb-6 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-rose-300 group-hover:bg-rose-50 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            {step === 'plan' ? 'Volver a planes' : 'Paso anterior'}
          </button>
        )}

        {/* Stepper */}
        {step !== 'success' && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {stepList.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentIdx === i ? 'bg-rose-500 text-white shadow-md shadow-rose-200' :
                    currentIdx > i ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {currentIdx > i ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${
                    currentIdx === i ? 'text-rose-600' : currentIdx > i ? 'text-rose-400' : 'text-gray-300'
                  }`}>{s.label}</span>
                </div>
                {i < stepList.length - 1 && (
                  <div className={`w-10 h-px ${currentIdx > i ? 'bg-rose-300' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* ── Paso 1: Plan ── */}
          {step === 'plan' && (
            <motion.div key="plan" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-rose-100 rounded-2xl mb-4">
                  <Flower2 className="w-7 h-7 text-rose-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Confirma tu plan
                </h1>
                <p className="text-gray-500 text-sm">Revisa los detalles antes de continuar</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
                {/* Header del plan */}
                <div className="flex items-center gap-4 pb-5 border-b border-gray-100 mb-5">
                  <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                    {isWeekly ? '🌷' : '🌹'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-gray-900 text-lg leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {plan.name}
                    </h2>
                    <p className="text-gray-500 text-sm mt-0.5 line-clamp-2">{plan.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-rose-600" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {formatCurrency(Number(plan.price))}
                    </p>
                    <p className="text-xs text-gray-400">/{freq}</p>
                  </div>
                </div>

                {/* Features */}
                {plan.features?.length > 0 && (
                  <ul className="space-y-2.5 mb-5">
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

                {/* Beneficios */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100">
                  {[
                    { emoji: '🚚', text: 'Envío incluido' },
                    { emoji: '⏸️', text: 'Pausa cuando quieras' },
                    { emoji: '🎁', text: 'Nota de regalo gratis' },
                    { emoji: '❌', text: 'Sin contratos' },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{item.emoji}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {!isAuthenticated ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-4">
                  <p className="text-sm font-semibold text-amber-800 mb-1">Necesitas iniciar sesión</p>
                  <p className="text-xs text-amber-600 mb-4">Crea una cuenta o inicia sesión para suscribirte.</p>
                  <Link href="/login" className="flex items-center justify-center gap-2 w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-sm transition-all">
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
            </motion.div>
          )}

          {/* ── Paso 2: Destinatario ── */}
          {step === 'recipient' && (
            <motion.div key="recipient" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-rose-100 rounded-2xl mb-4">
                  <User className="w-7 h-7 text-rose-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  ¿A quién le enviamos?
                </h1>
                <p className="text-gray-500 text-sm">Puedes enviarlo a ti mismo o a alguien especial</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre completo *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      value={recipient.fullName}
                      onChange={e => setRecipient(r => ({ ...r, fullName: e.target.value }))}
                      placeholder="María García"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Dirección de entrega *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      value={recipient.address}
                      onChange={e => setRecipient(r => ({ ...r, address: e.target.value }))}
                      placeholder="Calle 45 # 12-34 Apto 201"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
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
                    <Gift className="inline w-3.5 h-3.5 mr-1 text-rose-400" />
                    Nota de regalo <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <textarea
                    value={recipient.notes}
                    onChange={e => setRecipient(r => ({ ...r, notes: e.target.value }))}
                    placeholder="Con amor para ti... 🌸"
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                  />
                </div>

                <button
                  onClick={() => {
                    if (!recipient.fullName || !recipient.address || !recipient.city) {
                      toast.error('Completa nombre, dirección y ciudad');
                      return;
                    }
                    setStep('payment');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl text-sm transition-all hover:-translate-y-0.5 shadow-md shadow-rose-200 mt-2"
                >
                  Continuar al pago <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Paso 3: Pago ── */}
          {step === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-rose-100 rounded-2xl mb-4">
                  <CreditCard className="w-7 h-7 text-rose-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Método de pago
                </h1>
                <p className="text-gray-500 text-sm">Elige cómo quieres pagar tu suscripción</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                {/* Resumen */}
                <div className="flex items-center justify-between p-4 bg-rose-50 rounded-xl border border-rose-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{isWeekly ? '🌷' : '🌹'}</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{plan.name}</p>
                      <p className="text-xs text-gray-500">Para: {recipient.fullName} · {recipient.city}</p>
                    </div>
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
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === mid
                            ? 'border-rose-400 bg-rose-50'
                            : 'border-gray-200 hover:border-rose-200 bg-white'
                        }`}>
                        <Icon className={`w-5 h-5 ${paymentMethod === mid ? 'text-rose-500' : 'text-gray-400'}`} />
                        <span className={`text-xs font-semibold ${paymentMethod === mid ? 'text-rose-600' : 'text-gray-500'}`}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seguridad */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Shield className="w-4 h-4 text-green-500 shrink-0" />
                  <p className="text-xs text-gray-500">Pago seguro procesado por <strong className="text-gray-700">Wompi</strong> con cifrado SSL</p>
                </div>

                <button
                  onClick={handleCreateSubscription}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-bold rounded-2xl text-sm transition-all hover:-translate-y-0.5 shadow-md shadow-rose-200"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
                  ) : (
                    <>Confirmar suscripción <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Éxito ── */}
          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                ¡Suscripción activa! 🌸
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Tu suscripción a <strong>{plan.name}</strong> fue creada. Las flores llegarán a <strong>{recipient.fullName}</strong> en {recipient.city}.
              </p>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 text-left space-y-3">
                {[
                  { label: 'Plan', value: plan.name },
                  { label: 'Destinatario', value: recipient.fullName },
                  { label: 'Ciudad', value: recipient.city },
                  { label: 'Frecuencia', value: freqLabel },
                  { label: 'Precio', value: `${formatCurrency(Number(plan.price))}/${freq}` },
                ].map(item => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="font-semibold text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/perfil"
                  className="flex items-center justify-center gap-2 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl text-sm transition-all shadow-md shadow-rose-200">
                  Ver mis suscripciones
                </Link>
                <Link href="/tienda"
                  className="flex items-center justify-center gap-2 py-3.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium rounded-2xl text-sm transition-all">
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
