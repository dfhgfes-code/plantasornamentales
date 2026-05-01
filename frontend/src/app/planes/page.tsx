'use client';
import { useEffect, useState } from 'react';
import { plansApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Check, Flower2 } from 'lucide-react';
import Link from 'next/link';

export default function PlanesPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    plansApi.getAll(true).then((r) => setPlans(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  const weekly = plans.filter((p) => p.frequency === 'weekly');
  const monthly = plans.filter((p) => p.frequency === 'monthly');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <Flower2 className="w-4 h-4" /> Suscripciones florales
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Elige tu plan perfecto</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">
          Recibe flores frescas de forma automática. Pausa o cancela cuando quieras, sin compromisos.
        </p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-3 w-2/3" />
              <div className="h-8 bg-gray-200 rounded mb-4 w-1/2" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, j) => <div key={j} className="h-3 bg-gray-200 rounded" />)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {weekly.length > 0 && (
            <div className="mb-14">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600 text-sm">📅</span>
                Planes Semanales
              </h2>
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
                {weekly.map((plan, i) => <PlanCard key={plan.id} plan={plan} featured={i === 1} />)}
              </div>
            </div>
          )}
          {monthly.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-sm">🗓️</span>
                Planes Mensuales
              </h2>
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
                {monthly.map((plan, i) => <PlanCard key={plan.id} plan={plan} featured={i === 1} />)}
              </div>
            </div>
          )}
        </>
      )}

      {/* FAQ */}
      <div className="mt-20 bg-rose-50 rounded-3xl p-8 md:p-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Preguntas frecuentes</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            ['¿Puedo cancelar en cualquier momento?', 'Sí, puedes cancelar tu suscripción cuando quieras desde tu perfil, sin penalizaciones.'],
            ['¿Qué flores recibiré?', 'Seleccionamos las flores más frescas de temporada. Puedes indicar preferencias en las notas.'],
            ['¿A qué ciudades entregan?', 'Actualmente entregamos en Bogotá y ciudades principales de Colombia.'],
            ['¿Puedo pausar mi suscripción?', 'Sí, puedes pausarla temporalmente y reactivarla cuando quieras.'],
          ].map(([q, a]) => (
            <div key={q} className="bg-white rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
              <p className="text-sm text-gray-500">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanCard({ plan, featured }: { plan: any; featured: boolean }) {
  return (
    <div className={`rounded-2xl p-6 border-2 transition-all ${featured ? 'border-rose-500 bg-rose-50 shadow-lg shadow-rose-100' : 'border-gray-100 bg-white hover:shadow-md'}`}>
      {featured && <div className="text-xs font-bold text-rose-600 bg-rose-100 px-3 py-1 rounded-full inline-block mb-3">⭐ Más popular</div>}
      <h3 className="font-bold text-gray-900 text-xl mb-1">{plan.name}</h3>
      <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
      <div className="mb-5">
        <span className="text-4xl font-bold text-gray-900">{formatCurrency(Number(plan.price))}</span>
        <span className="text-gray-400 text-sm ml-1">/{plan.frequency === 'weekly' ? 'semana' : 'mes'}</span>
      </div>
      {plan.features && (
        <ul className="space-y-2.5 mb-6">
          {plan.features.map((f: string) => (
            <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
              <Check className="w-4 h-4 text-green-500 shrink-0" /> {f}
            </li>
          ))}
        </ul>
      )}
      <Link href={`/planes/${plan.id}`}
        className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${featured ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'border-2 border-rose-500 text-rose-600 hover:bg-rose-50'}`}>
        Suscribirme ahora
      </Link>
    </div>
  );
}
