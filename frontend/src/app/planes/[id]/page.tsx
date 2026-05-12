'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Check, ArrowLeft, ArrowRight, MapPin, User, Gift,
  CreditCard, Building2, Smartphone, CheckCircle, Loader2,
  Shield, Flower2, Plus, Trash2, X, Pen
} from 'lucide-react';
import { plansApi, subscriptionsApi, recipientsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

/* ── Componente Tarjeta de Regalo Animada ─────────────────────── */
function GiftCardModal({ value, onChange, onClose }: { value: string; onChange: (v: string) => void; onClose: () => void }) {
  const [text, setText] = useState(value);
  const lines = ['', '', '', '', ''];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={e => { if (e.target === e.currentTarget) { onChange(text); onClose(); } }}
      >
        <motion.div
          initial={{ scale: 0.7, rotateY: -90, opacity: 0 }}
          animate={{ scale: 1, rotateY: 0, opacity: 1 }}
          exit={{ scale: 0.7, rotateY: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          style={{ perspective: 1000 }}
          className="w-full max-w-sm"
        >
          {/* Tarjeta */}
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Tapa decorativa */}
            <div className="bg-gradient-to-br from-rose-400 to-pink-600 px-6 pt-8 pb-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative text-center">
                <div className="text-4xl mb-2">🌸</div>
                <p className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Tarjeta de Regalo</p>
                <p className="text-rose-100 text-xs mt-1">Escribe tu mensaje especial</p>
              </div>
              <button onClick={() => { onChange(text); onClose(); }}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Cuerpo de la tarjeta */}
            <div className="px-6 pt-5 pb-6 bg-[#fffdf8] relative">
              {/* Líneas decorativas de papel */}
              <div className="absolute inset-x-6 top-5 bottom-16 flex flex-col justify-around pointer-events-none">
                {lines.map((_, i) => <div key={i} className="h-px bg-rose-100" />)}
              </div>
              <div className="absolute left-12 top-5 bottom-16 w-px bg-rose-100 pointer-events-none" />

              <textarea
                autoFocus
                value={text}
                onChange={e => setText(e.target.value)}
                maxLength={200}
                rows={5}
                placeholder="Con todo mi amor para ti...&#10;Que estas flores alegren tu día 🌸"
                className="relative w-full bg-transparent resize-none text-sm text-gray-700 leading-7 focus:outline-none pl-8 z-10"
                style={{ fontFamily: "'Playfair Display', serif", lineHeight: '1.75rem' }}
              />

              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-gray-400">{text.length}/200 caracteres</span>
                <span className="text-[10px] text-rose-400 flex items-center gap-1">
                  <Pen className="w-3 h-3" /> La floristería escribirá esto en tu tarjeta
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 bg-[#fffdf8]">
              <button
                onClick={() => { onChange(text); onClose(); }}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-rose-200"
              >
                <Check className="w-4 h-4" /> Guardar mensaje
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

type Step = 'plan' | 'destinations' | 'payment' | 'success';
type Destination = { fullName: string; address: string; city: string; phone: string; notes: string };

const EMPTY_DEST: Destination = { fullName: '', address: '', city: '', phone: '', notes: '' };


function getFreqLabel(days: number) {
  if (days === 1) return 'Diario';
  if ([7, 8].includes(days)) return 'Semanal';
  if (days === 15) return 'Quincenal';
  if ([30, 31].includes(days)) return 'Mensual';
  return `Cada ${days} días`;
}
function getFreqUnit(days: number) {
  if (days === 1) return 'día';
  if ([7, 8].includes(days)) return 'semana';
  if (days === 15) return 'quincena';
  if ([30, 31].includes(days)) return 'mes';
  return `${days} días`;
}

export default function PlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('plan');
  const [submitting, setSubmitting] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([{ ...EMPTY_DEST }]);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [giftCardIdx, setGiftCardIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    plansApi.getOne(id)
      .then(r => setPlan(r.data.data))
      .catch(() => router.push('/planes'))
      .finally(() => setLoading(false));
  }, [id]);

  const freq = plan ? getFreqUnit(plan.intervalDays) : '';
  const freqLabel = plan ? getFreqLabel(plan.intervalDays) : '';
  const isWeekly = plan?.intervalDays < 30;
  const totalPrice = Number(plan?.price || 0) * destinations.length;

  const updateDest = (i: number, field: keyof Destination, val: string) => {
    setDestinations(prev => prev.map((d, idx) => idx === i ? { ...d, [field]: val } : d));
  };
  const addDest = () => {
    if (destinations.length >= 5) { toast.error('Máximo 5 destinos por suscripción'); return; }
    setDestinations(prev => [...prev, { ...EMPTY_DEST }]);
  };
  const removeDest = (i: number) => {
    if (destinations.length === 1) return;
    setDestinations(prev => prev.filter((_, idx) => idx !== i));
  };

  const validateDestinations = () => {
    for (let i = 0; i < destinations.length; i++) {
      const d = destinations[i];
      if (!d.fullName || !d.address || !d.city) {
        toast.error(`Destino ${i + 1}: completa nombre, dirección y ciudad`);
        return false;
      }
    }
    return true;
  };

  const handleCreateSubscriptions = async () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (!validateDestinations()) return;
    setSubmitting(true);
    try {
      for (const dest of destinations) {
        const recRes = await recipientsApi.create(dest);
        await subscriptionsApi.create({ planId: id, recipientId: recRes.data.data.id, paymentMethod });
      }
      setStep('success');
      toast.success(`🌸 ${destinations.length > 1 ? `${destinations.length} suscripciones creadas` : 'Suscripción creada'}!`);
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
    { key: 'destinations', label: 'Destinos' },
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
              else if (step === 'destinations') setStep('plan');
              else if (step === 'payment') setStep('destinations');
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
                    <p className="text-xs text-gray-400">/{freq} · por destino</p>
                  </div>
                </div>

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

                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-50">
                  {[
                    { emoji: '🚚', text: 'Envío incluido' },
                    { emoji: '⏸️', text: 'Pausa cuando quieras' },
                    { emoji: '🎁', text: 'Nota de regalo gratis' },
                    { emoji: '❌', text: 'Sin contratos' },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{item.emoji}</span><span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info multi-destino */}
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-4">
                <p className="text-sm font-semibold text-rose-700 mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> ¿Envías a más de un lugar?
                </p>
                <p className="text-xs text-rose-600 leading-relaxed">
                  En el siguiente paso puedes agregar varios destinos. Se creará una suscripción por cada dirección, todas bajo tu cuenta.
                </p>
              </div>

              {!isAuthenticated ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                  <p className="text-sm font-semibold text-amber-800 mb-1">Necesitas iniciar sesión</p>
                  <p className="text-xs text-amber-600 mb-4">Crea una cuenta o inicia sesión para suscribirte.</p>
                  <Link href="/login" className="flex items-center justify-center gap-2 w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-sm transition-all">
                    Iniciar sesión <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => setStep('destinations')}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-rose-200"
                >
                  Elegir destinos <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          )}

          {/* ── Paso 2: Destinos ── */}
          {step === 'destinations' && (
            <motion.div key="destinations" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-rose-100 rounded-2xl mb-4">
                  <MapPin className="w-7 h-7 text-rose-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  ¿A dónde enviamos?
                </h1>
                <p className="text-gray-500 text-sm">Agrega uno o más destinos de entrega</p>
              </div>

              <div className="space-y-4">
                {destinations.map((dest, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    {/* Header destino */}
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50 bg-gray-50/50">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {i + 1}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {i === 0 ? 'Destino principal' : `Destino ${i + 1}`}
                        </span>
                        <span className="text-xs text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded-full">
                          {formatCurrency(Number(plan.price))}/{freq}
                        </span>
                      </div>
                      {destinations.length > 1 && (
                        <button onClick={() => removeDest(i)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          value={dest.fullName}
                          onChange={e => updateDest(i, 'fullName', e.target.value)}
                          placeholder="Nombre completo de quien recibe *"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                        />
                      </div>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          value={dest.address}
                          onChange={e => updateDest(i, 'address', e.target.value)}
                          placeholder="Dirección completa *"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          value={dest.city}
                          onChange={e => updateDest(i, 'city', e.target.value)}
                          placeholder="Ciudad *"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                        />
                        <input
                          value={dest.phone}
                          onChange={e => updateDest(i, 'phone', e.target.value)}
                          placeholder="Teléfono"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                        />
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setGiftCardIdx(i)}
                          className={`w-full text-left pl-10 pr-4 py-3 border rounded-xl text-sm transition-all flex items-center justify-between ${
                            dest.notes ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-rose-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Gift className={`w-4 h-4 shrink-0 ${dest.notes ? 'text-rose-500' : 'text-gray-400'}`} />
                            <span className="truncate">{dest.notes || 'Añadir nota de regalo (opcional) 🌸'}</span>
                          </div>
                          {dest.notes && <Pen className="w-4 h-4 text-rose-400 shrink-0" />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Botón agregar destino */}
                {destinations.length < 5 && (
                  <button
                    onClick={addDest}
                    className="w-full border-2 border-dashed border-rose-200 hover:border-rose-400 bg-white hover:bg-rose-50/50 text-rose-500 hover:text-rose-600 py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar otro destino
                  </button>
                )}

                {/* Resumen total */}
                {destinations.length > 1 && (
                  <div className="bg-rose-50 rounded-2xl border border-rose-100 p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{destinations.length} suscripciones · {freqLabel}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{formatCurrency(Number(plan.price))} × {destinations.length} destinos</p>
                    </div>
                    <p className="text-xl font-bold text-rose-600">{formatCurrency(totalPrice)}<span className="text-sm font-normal text-gray-400">/{freq}</span></p>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (!validateDestinations()) return;
                    setStep('payment');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl text-sm transition-all hover:-translate-y-0.5 shadow-md shadow-rose-200"
                >
                  Continuar al pago <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Modal de Tarjeta Animada */}
              {giftCardIdx !== null && (
                <GiftCardModal
                  value={destinations[giftCardIdx].notes}
                  onChange={(val) => updateDest(giftCardIdx, 'notes', val)}
                  onClose={() => setGiftCardIdx(null)}
                />
              )}
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
                <div className="space-y-2">
                  {destinations.map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-rose-50 rounded-xl border border-rose-100">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">{i + 1}</div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{d.fullName || `Destino ${i + 1}`}</p>
                          <p className="text-xs text-gray-500">{d.city}</p>
                        </div>
                      </div>
                      <p className="font-bold text-rose-600 text-sm">{formatCurrency(Number(plan.price))}</p>
                    </div>
                  ))}
                  {destinations.length > 1 && (
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100 px-1">
                      <span className="text-sm font-semibold text-gray-700">Total {destinations.length} suscripciones</span>
                      <span className="text-lg font-bold text-rose-600">{formatCurrency(totalPrice)}<span className="text-xs text-gray-400">/{freq}</span></span>
                    </div>
                  )}
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
                          paymentMethod === mid ? 'border-rose-400 bg-rose-50' : 'border-gray-200 hover:border-rose-200 bg-white'
                        }`}>
                        <Icon className={`w-5 h-5 ${paymentMethod === mid ? 'text-rose-500' : 'text-gray-400'}`} />
                        <span className={`text-xs font-semibold ${paymentMethod === mid ? 'text-rose-600' : 'text-gray-500'}`}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Shield className="w-4 h-4 text-green-500 shrink-0" />
                  <p className="text-xs text-gray-500">Pago seguro procesado por <strong className="text-gray-700">Wompi</strong> con cifrado SSL</p>
                </div>

                <button
                  onClick={handleCreateSubscriptions}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-bold rounded-2xl text-sm transition-all hover:-translate-y-0.5 shadow-md shadow-rose-200"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
                  ) : (
                    <>Confirmar {destinations.length > 1 ? `${destinations.length} suscripciones` : 'suscripción'} <ArrowRight className="w-4 h-4" /></>
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
                {destinations.length > 1 ? '¡Suscripciones activas!' : '¡Suscripción activa!'} 🌸
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {destinations.length > 1
                  ? `Tu plan "${plan.name}" se activó para ${destinations.length} destinos. Las flores llegarán puntualmente a cada dirección.`
                  : `Tu suscripción a "${plan.name}" fue creada. Las flores llegarán a ${destinations[0].fullName} en ${destinations[0].city}.`
                }
              </p>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Plan</span>
                  <span className="font-semibold text-gray-800">{plan.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Frecuencia</span>
                  <span className="font-semibold text-gray-800">{freqLabel}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Destinos</span>
                  <span className="font-semibold text-gray-800">{destinations.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total</span>
                  <span className="font-semibold text-rose-600">{formatCurrency(totalPrice)}/{freq}</span>
                </div>
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
