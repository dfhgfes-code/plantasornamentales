'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, ArrowLeft, ArrowRight, MapPin, User, FileText, CreditCard, Building2, Smartphone, CheckCircle, Loader2, Shield, Truck, Pause, Gift } from 'lucide-react';
import { plansApi, subscriptionsApi, recipientsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

type Step = 'plan' | 'recipient' | 'payment' | 'success';

// Mini resumen lateral del plan
function PlanSummaryCard({ plan, recipient, step }: { plan: any; recipient: any; step: Step }) {
  const freq = plan?.frequency === 'weekly' ? 'semana' : 'mes';
  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden sticky top-24">
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-6">
        <span className="text-3xl mb-3 block">{plan?.frequency === 'weekly' ? '🌷' : '🌹'}</span>
        <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
          {plan?.name}
        </h3>
        <div className="flex items-end gap-1 mt-3">
          <span className="text-3xl font-bold text-white">{formatCurrency(Number(plan?.price))}</span>
          <span className="text-rose-200 text-sm mb-1">/{freq}</span>
        </div>
      </div>
      <div className="p-5 space-y-3">
        {plan?.features?.slice(0, 4).map((f: string) => (
          <div key={f} className="flex items-start gap-2">
            <div className="w-4 h-4 rounded-full bg-rose-50 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-2.5 h-2.5 text-rose-500" />
            </div>
            <span className="text-xs text-gray-600 leading-relaxed">{f}</span>
          </div>
        ))}
        {step !== 'plan' && recipient.fullName && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Destinatario</p>
            <p className="text-sm font-semibold text-gray-800">{recipient.fullName}</p>
            {recipient.city && <p className="text-xs text-gray-500">{recipient.city}</p>}
          </div>
        )}
        <div className="pt-3 border-t border-gray-100 space-y-2">
          {[
            { icon: Truck, text: 'Envío incluido' },
            { icon: Pause, text: 'Pausa cuando quieras' },
            { icon: Gift, text: 'Nota de regalo gratis' },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-2 text-xs text-gray-500">
              <item.icon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

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

  const freq = plan?.frequency === 'weekly' ? 'semana' : 'mes';

  const handleCreateSubscription = async () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    setSubmitting(true);
    try {
      const recRes = await recipientsApi.create({
        fullName: recipient.fullName,
        address: recipient.address,
        city: recipient.city,
        phone: recipient.phone,
        notes: recipient.notes,
      });
      await subscriptionsApi.create({ planId: id, recipientId: recRes.data.data.id, paymentMethod });
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

  const stepList = [
    { key: 'plan', label: 'Plan', num: 1 },
    { key: 'recipient', label: 'Destinatario', num: 2 },
    { key: 'payment', label: 'Pago', num: 3 },
  ];
  const currentIdx = stepList.findIndex(s => s.key === step);

  return (
    <div className="min-h-screen bg-[#fdfaf7]">
      {/* Header sticky */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          {/* Botón atrás prominente */}
          <button
            onClick={() => {
              if (step === 'plan') router.push('/planes');
              else if (step === 'recipient') setStep('plan');
              else if (step === 'payment') setStep('recipient');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-600 rounded-xl text-sm font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:block">
              {step === 'plan' ? 'Volver a planes' : 'Paso anterior'}
            </span>
            <span className="sm:hidden">Atrás</span>
          </button>

          {/* Stepper */}
          {step !== 'success' && (
            <div className="flex items-center gap-1 sm:gap-3">
              {stepList.map((s, i) => (
                <div key={s.key} className="flex items-center gap-1 sm:gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentIdx === i ? 'bg-rose-500 text-white shadow-md shadow-rose-200' :
                      currentIdx > i ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {currentIdx > i ? '✓' : s.num}
                    </div>
                    <span className={`hidden sm:block text-xs font-semibold ${
                      currentIdx === i ? 'text-rose-600' : currentIdx > i ? 'text-green-600' : 'text-gray-300'
                    }`}>{s.label}</span>
                  </div>
                  {i < stepList.length - 1 && (
                    <div className={`w-8 h-0.5 rounded-full ${currentIdx > i ? 'bg-green-400' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="w-24 sm:w-32" /> {/* spacer */}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatePresence mode="wait">

          {/* ── Paso 1: Plan ── */}
          {step === 'plan' && (
            <motion.div key="plan" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="grid lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-3 space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Confirma tu plan
                    </h1>
                    <p className="text-gray-500 text-sm">Revisa los detalles antes de continuar</p>
                  </div>

                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6 flex items-center gap-5">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                        {plan.frequency === 'weekly' ? '🌷' : '🌹'}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{plan.name}</h2>
                        <p className="text-rose-100 text-sm mt-0.5">{plan.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-3xl font-bold text-white">{formatCurrency(Number(plan.price))}</p>
                        <p className="text-rose-200 text-sm">/{freq}</p>
                      </div>
                    </div>
                    {plan.features?.length > 0 && (
                      <div className="p-6 grid sm:grid-cols-2 gap-3">
                        {plan.features.map((f: string) => (
                          <div key={f} className="flex items-start gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-rose-50 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-rose-500" />
                            </div>
                            <span className="text-sm text-gray-600">{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { icon: Truck, label: 'Envío incluido' },
                      { icon: Pause, label: 'Pausa fácil' },
                      { icon: Gift, label: 'Nota de regalo' },
                      { icon: Shield, label: 'Sin contratos' },
                    ].map(item => (
                      <div key={item.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col items-center gap-2 text-center">
                        <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-rose-500" />
                        </div>
                        <span className="text-xs font-medium text-gray-600">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  {!isAuthenticated ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                      <p className="text-sm text-amber-800 font-semibold mb-1">Necesitas iniciar sesión</p>
                      <p className="text-xs text-amber-600 mb-4">Crea una cuenta o inicia sesión para continuar con tu suscripción.</p>
                      <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-sm transition-all">
                        Iniciar sesión <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : (
                    <button onClick={() => setStep('recipient')}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl text-base transition-all hover:-translate-y-0.5 shadow-lg shadow-rose-200">
                      Continuar con este plan <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="lg:col-span-2">
                  <PlanSummaryCard plan={plan} recipient={recipient} step={step} />
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Paso 2: Destinatario ── */}
          {step === 'recipient' && (
            <motion.div key="recipient" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="grid lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-3">
                  <div className="mb-7">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      ¿A quién le enviamos?
                    </h1>
                    <p className="text-gray-500 text-sm">Puedes enviarlo a ti mismo o sorprender a alguien especial</p>
                  </div>

                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 space-y-5">
                    {/* Nombre */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User className="inline w-4 h-4 mr-1.5 text-rose-400" />
                        Nombre completo *
                      </label>
                      <input
                        value={recipient.fullName}
                        onChange={e => setRecipient(r => ({ ...r, fullName: e.target.value }))}
                        placeholder="María García"
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                      />
                    </div>

                    {/* Dirección */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="inline w-4 h-4 mr-1.5 text-rose-400" />
                        Dirección de entrega *
                      </label>
                      <input
                        value={recipient.address}
                        onChange={e => setRecipient(r => ({ ...r, address: e.target.value }))}
                        placeholder="Calle 45 # 12-34 Apto 201"
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                      />
                    </div>

                    {/* Ciudad y teléfono */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ciudad *</label>
                        <input
                          value={recipient.city}
                          onChange={e => setRecipient(r => ({ ...r, city: e.target.value }))}
                          placeholder="Bogotá"
                          className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                        <input
                          value={recipient.phone}
                          onChange={e => setRecipient(r => ({ ...r, phone: e.target.value }))}
                          placeholder="3001234567"
                          className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                        />
                      </div>
                    </div>

                    {/* Nota */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Gift className="inline w-4 h-4 mr-1.5 text-rose-400" />
                        Nota de regalo <span className="text-gray-400 font-normal">(opcional)</span>
                      </label>
                      <textarea
                        value={recipient.notes}
                        onChange={e => setRecipient(r => ({ ...r, notes: e.target.value }))}
                        placeholder="Con amor para ti... 🌸"
                        rows={3}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                      />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setStep('plan')}
                        className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl text-sm transition-all">
                        <ArrowLeft className="w-4 h-4" /> Atrás
                      </button>
                      <button
                        onClick={() => {
                          if (!recipient.fullName || !recipient.address || !recipient.city) {
                            toast.error('Completa nombre, dirección y ciudad');
                            return;
                          }
                          setStep('payment');
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl text-sm transition-all hover:-translate-y-0.5 shadow-md shadow-rose-200"
                      >
                        Continuar al pago <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <PlanSummaryCard plan={plan} recipient={recipient} step={step} />
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Paso 3: Pago ── */}
          {step === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="grid lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-3">
                  <div className="mb-7">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Método de pago
                    </h1>
                    <p className="text-gray-500 text-sm">Elige cómo quieres pagar tu suscripción</p>
                  </div>

                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 space-y-6">
                    {/* Resumen del pedido */}
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-5 border border-rose-100">
                      <p className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-3">Resumen de tu suscripción</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{plan.frequency === 'weekly' ? '🌷' : '🌹'}</span>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{plan.name}</p>
                            <p className="text-xs text-gray-500">Para: {recipient.fullName} · {recipient.city}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-rose-600">{formatCurrency(Number(plan.price))}</p>
                          <p className="text-xs text-gray-400">/{freq}</p>
                        </div>
                      </div>
                    </div>

                    {/* Métodos de pago */}
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-4">Selecciona tu método de pago</p>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { id: 'CARD', icon: CreditCard, label: 'Tarjeta', desc: 'Débito o crédito' },
                          { id: 'PSE', icon: Building2, label: 'PSE', desc: 'Débito bancario' },
                          { id: 'NEQUI', icon: Smartphone, label: 'Nequi', desc: 'Billetera digital' },
                        ].map(({ id: mid, icon: Icon, label, desc }) => (
                          <button key={mid} onClick={() => setPaymentMethod(mid)}
                            className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all hover:-translate-y-0.5 ${
                              paymentMethod === mid
                                ? 'border-rose-400 bg-rose-50 shadow-md shadow-rose-100'
                                : 'border-gray-200 hover:border-rose-200 bg-white'
                            }`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === mid ? 'bg-rose-100' : 'bg-gray-100'}`}>
                              <Icon className={`w-5 h-5 ${paymentMethod === mid ? 'text-rose-600' : 'text-gray-400'}`} />
                            </div>
                            <span className={`text-sm font-bold ${paymentMethod === mid ? 'text-rose-700' : 'text-gray-700'}`}>{label}</span>
                            <span className="text-[10px] text-gray-400 text-center">{desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Seguridad */}
                    <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl p-4">
                      <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                        <Shield className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-green-800">Pago 100% seguro</p>
                        <p className="text-xs text-green-600">Procesado por Wompi con cifrado SSL. Tus datos están protegidos.</p>
                      </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setStep('recipient')}
                        className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl text-sm transition-all">
                        <ArrowLeft className="w-4 h-4" /> Atrás
                      </button>
                      <button
                        onClick={handleCreateSubscription}
                        disabled={submitting}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-bold rounded-2xl text-sm transition-all hover:-translate-y-0.5 shadow-md shadow-rose-200"
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
                <div className="lg:col-span-2">
                  <PlanSummaryCard plan={plan} recipient={recipient} step={step} />
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Éxito ── */}
          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center py-10">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                ¡Suscripción activa! 🌸
              </h2>
              <p className="text-gray-500 leading-relaxed mb-2">
                Tu suscripción a <strong className="text-gray-800">{plan.name}</strong> ha sido creada exitosamente.
              </p>
              <p className="text-gray-400 text-sm mb-8">
                Las flores llegarán a <strong>{recipient.fullName}</strong> en <strong>{recipient.city}</strong> según la frecuencia del plan.
              </p>
              <div className="bg-rose-50 rounded-2xl p-5 mb-8 text-left space-y-2">
                <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-3">Detalles de tu suscripción</p>
                {[
                  { label: 'Plan', value: plan.name },
                  { label: 'Destinatario', value: recipient.fullName },
                  { label: 'Ciudad', value: recipient.city },
                  { label: 'Frecuencia', value: plan.frequency === 'weekly' ? 'Semanal' : 'Mensual' },
                  { label: 'Precio', value: `${formatCurrency(Number(plan.price))}/${freq}` },
                ].map(item => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-semibold text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/perfil"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl text-sm transition-all shadow-md shadow-rose-200">
                  Ver mis suscripciones
                </Link>
                <Link href="/tienda"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold rounded-2xl text-sm transition-all">
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
