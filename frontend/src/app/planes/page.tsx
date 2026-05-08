'use client';
import { useEffect, useState } from 'react';
import { plansApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Check, Star, ArrowRight, Pause, X, RefreshCw, Truck, Gift, Shield } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PERKS = [
  { icon: Truck,      label: 'Envío incluido',         desc: 'Sin costos ocultos' },
  { icon: Pause,      label: 'Pausa cuando quieras',   desc: 'Sin penalizaciones' },
  { icon: X,          label: 'Cancela fácil',          desc: 'Desde tu perfil' },
  { icon: Gift,       label: 'Nota de regalo',         desc: 'Incluida gratis' },
  { icon: RefreshCw,  label: 'Flores de temporada',    desc: 'Siempre frescas' },
  { icon: Shield,     label: 'Frescura garantizada',   desc: 'O te la reponemos' },
];

const FAQS = [
  ['¿Puedo cancelar en cualquier momento?',
   'Sí, puedes cancelar tu suscripción cuando quieras desde tu perfil, sin penalizaciones ni cargos adicionales.'],
  ['¿Qué flores recibiré?',
   'Seleccionamos las flores más frescas de temporada. Puedes indicar preferencias en las notas de tu pedido.'],
  ['¿A qué ciudades entregan?',
   'Actualmente entregamos en Bogotá y ciudades principales de Colombia. Escríbenos para confirmar tu zona.'],
  ['¿Puedo pausar mi suscripción?',
   'Sí, puedes pausarla temporalmente desde tu perfil y reactivarla cuando quieras, sin perder tu plan.'],
  ['¿Cómo se realiza el pago?',
   'El pago se procesa de forma segura a través de Wompi. Se cobra automáticamente según la frecuencia elegida.'],
  ['¿Puedo cambiar de plan?',
   'Sí, puedes cambiar tu plan en cualquier momento. El cambio aplica a partir del siguiente ciclo de facturación.'],
];

function PlanCard({ plan, featured, index }: { plan: any; featured: boolean; index: number }) {
  const freq = plan.frequency === 'weekly' ? 'semana' : 'mes';
  const isWeekly = plan.frequency === 'weekly';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group"
    >
      {/* Badge popular flotante */}
      {featured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
          <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap">
            <Star className="w-3 h-3 fill-white" /> Más popular
          </span>
        </div>
      )}

      <div className={`relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl ${
        featured
          ? 'shadow-xl shadow-rose-200/40 ring-2 ring-rose-400'
          : 'shadow-md shadow-gray-200/60 ring-1 ring-gray-200'
      }`}>

        {/* Header oscuro elegante */}
        <div className={`relative px-6 pt-8 pb-6 ${
          featured
            ? 'bg-gradient-to-br from-gray-900 to-gray-800'
            : 'bg-gradient-to-br from-gray-800 to-gray-700'
        }`}>
          {/* Patrón decorativo muy sutil */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />

          {/* Icono floral */}
          <div className="relative w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl mb-4">
            {isWeekly ? '🌷' : '🌹'}
          </div>

          <h3 className="relative text-xl font-bold text-white mb-1.5"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            {plan.name}
          </h3>
          <p className="relative text-sm leading-relaxed text-gray-400 line-clamp-2">
            {plan.description}
          </p>

          {/* Precio — acento rosa */}
          <div className="relative mt-5 flex items-end gap-1.5">
            <span className="text-4xl font-bold text-rose-400" style={{ fontFamily: "'Playfair Display', serif" }}>
              {formatCurrency(Number(plan.price))}
            </span>
            <span className="text-gray-500 text-sm mb-1.5">/{freq}</span>
          </div>
          {plan.frequency === 'monthly' && (
            <p className="relative text-xs text-gray-500 mt-1">
              ≈ {formatCurrency(Math.round(Number(plan.price) / 4))} por semana
            </p>
          )}
        </div>

        {/* Body blanco con features */}
        <div className="bg-white px-6 py-5 flex flex-col flex-1">
          {plan.features && plan.features.length > 0 && (
            <ul className="space-y-2.5 mb-6 flex-1">
              {plan.features.map((f: string) => (
                <li key={f} className="flex items-start gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    featured ? 'bg-rose-100' : 'bg-rose-50'
                  }`}>
                    <Check className="w-3 h-3 text-rose-500" />
                  </div>
                  <span className="text-sm text-gray-600 leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          )}

          <Link
            href={`/planes/${plan.id}`}
            className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 ${
              featured
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200'
                : 'bg-gray-900 hover:bg-gray-800 text-white shadow-md'
            }`}
          >
            Suscribirme ahora <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-rose-50/50 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-sm pr-4">{q}</span>
        <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
          open ? 'bg-rose-600 text-white rotate-45' : 'bg-gray-100 text-gray-500'
        }`}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
        </div>
      )}
    </motion.div>
  );
}

export default function PlanesPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    plansApi.getAll(true).then((r) => setPlans(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  const weekly  = plans.filter((p) => p.frequency === 'weekly');
  const monthly = plans.filter((p) => p.frequency === 'monthly');
  const allPlans = [...weekly, ...monthly];

  return (
    <div className="min-h-screen bg-[#fdfaf7]">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20 pb-32">
        {/* Decoración sutil */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 bg-rose-500/15 backdrop-blur-sm text-rose-300 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-rose-500/20">
              🌸 Suscripciones florales
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl font-bold text-white mb-5 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Flores frescas,<br />
            <span className="italic text-rose-400">cada semana</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed mb-8"
          >
            Elige tu plan y nosotros nos encargamos de todo. Sin compromisos, sin complicaciones.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 text-sm text-gray-400"
          >
            {['✓ Cancela cuando quieras', '✓ Envío incluido', '✓ Flores de temporada'].map(t => (
              <span key={t} className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10">{t}</span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Cards de planes (superpuestas al hero) ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 mb-20">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-7 animate-pulse shadow-sm">
                <div className="h-8 w-8 bg-gray-200 rounded-full mb-4" />
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full mb-6" />
                <div className="h-10 bg-gray-200 rounded w-1/2 mb-6" />
                <div className="space-y-2">
                  {[1,2,3,4].map(j => <div key={j} className="h-3 bg-gray-200 rounded" />)}
                </div>
              </div>
            ))}
          </div>
        ) : allPlans.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
            <p className="text-4xl mb-4">🌿</p>
            <p className="text-gray-500">No hay planes disponibles en este momento.</p>
          </div>
        ) : (
          /* ── Layout lado a lado con divisor vertical ── */
          <div className="bg-[#f8f4f1] rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col lg:flex-row">

              {/* Columna semanales */}
              {weekly.length > 0 && (
                <div className="flex-1 p-8">
                  {/* Header columna */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-xl shrink-0">📅</div>
                    <div>
                      <p className="font-bold text-gray-900 text-base">Planes Semanales</p>
                      <p className="text-xs text-gray-400">Flores cada semana</p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    {weekly.map((plan, i) => (
                      <PlanCard key={plan.id} plan={plan} featured={i === 0 && weekly.length === 1 ? false : i === 1} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {/* Divisor vertical */}
              {weekly.length > 0 && monthly.length > 0 && (
                <div className="hidden lg:flex flex-col items-center justify-center py-8 px-2">
                  <div className="w-px flex-1 bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
                  <div className="my-4 w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center">
                    <span className="text-xs">🌸</span>
                  </div>
                  <div className="w-px flex-1 bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
                </div>
              )}

              {/* Divisor horizontal en móvil */}
              {weekly.length > 0 && monthly.length > 0 && (
                <div className="lg:hidden flex items-center gap-4 px-8 py-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                  <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                    <span className="text-xs">🌸</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                </div>
              )}

              {/* Columna mensuales */}
              {monthly.length > 0 && (
                <div className="flex-1 p-8">
                  {/* Header columna */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-xl shrink-0">🗓️</div>
                    <div>
                      <p className="font-bold text-gray-900 text-base">Planes Mensuales</p>
                      <p className="text-xs text-gray-400">Flores cada mes</p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    {monthly.map((plan, i) => (
                      <PlanCard key={plan.id} plan={plan} featured={i === 0 && monthly.length === 1 ? false : i === 1} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Beneficios ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-rose-600 text-xs font-bold tracking-[0.2em] uppercase mb-3">Todo incluido</p>
            <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Lo que obtienes con <span className="italic text-rose-600">cualquier plan</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {PERKS.map((perk) => (
              <div key={perk.label}
                className="flex flex-col items-center text-center p-5 bg-[#fdfaf7] rounded-2xl border border-gray-100 hover:border-rose-200 hover:shadow-sm transition-all group">
                <div className="w-11 h-11 bg-rose-50 group-hover:bg-rose-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
                  <perk.icon className="w-5 h-5 text-rose-500" />
                </div>
                <p className="font-semibold text-gray-800 text-xs mb-0.5">{perk.label}</p>
                <p className="text-[10px] text-gray-400">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section className="py-20 bg-[#fdfaf7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-rose-600 text-xs font-bold tracking-[0.2em] uppercase mb-3">Simple y rápido</p>
            <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              ¿Cómo <span className="italic text-rose-600">funciona?</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* Línea conectora */}
            <div className="hidden sm:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-rose-100 z-0" />
            {[
              { step: '01', emoji: '🌸', title: 'Elige tu plan', desc: 'Selecciona la frecuencia y el plan que mejor se adapte a ti.' },
              { step: '02', emoji: '💳', title: 'Paga de forma segura', desc: 'Procesamos tu pago con Wompi, la plataforma más segura de Colombia.' },
              { step: '03', emoji: '🚚', title: 'Recibe tus flores', desc: 'Nosotros seleccionamos y entregamos flores frescas en tu puerta.' },
            ].map((item, i) => (
              <div key={item.step} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-rose-100 flex items-center justify-center text-3xl mb-4">
                  {item.emoji}
                </div>
                <span className="text-xs font-bold text-rose-400 tracking-widest mb-1">{item.step}</span>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonios ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-rose-600 text-xs font-bold tracking-[0.2em] uppercase mb-3">Lo que dicen</p>
            <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Nuestras <span className="italic text-rose-600">suscriptoras</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { name: 'María G.', city: 'Bogotá', text: 'Llevo 6 meses con la suscripción semanal y cada entrega me sorprende. Las flores siempre llegan frescas y el empaque es precioso.', stars: 5 },
              { name: 'Carolina R.', city: 'Medellín', text: 'El plan mensual es perfecto para mi oficina. Mis compañeros siempre preguntan de dónde son las flores. ¡Totalmente recomendado!', stars: 5 },
              { name: 'Valentina M.', city: 'Cali', text: 'Pausé mi suscripción cuando viajé y la reactivé sin ningún problema. El servicio al cliente es excelente y muy atento.', stars: 5 },
            ].map((t) => (
              <div key={t.name} className="bg-[#fdfaf7] rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-xs">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{t.name}</p>
                    <p className="text-[10px] text-gray-400">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-[#fdfaf7]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-rose-600 text-xs font-bold tracking-[0.2em] uppercase mb-3">Resolvemos tus dudas</p>
            <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Preguntas <span className="italic text-rose-600">frecuentes</span>
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(([q, a], i) => (
              <FaqItem key={q} q={q} a={a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-rose-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl mb-5 animate-float inline-block">🌸</div>
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            ¿Lista para empezar?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            Únete a más de 500 personas que ya reciben flores frescas en su puerta cada semana.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#planes"
              className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg hover:-translate-y-1 text-sm">
              Ver planes <ArrowRight className="w-4 h-4" />
            </a>
            <Link href="/contacto"
              className="inline-flex items-center gap-2 border border-white/20 text-gray-300 hover:bg-white/5 font-semibold px-8 py-4 rounded-2xl transition-all text-sm">
              Tengo preguntas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
