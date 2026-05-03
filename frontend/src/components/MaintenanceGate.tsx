'use client';
import { useEffect, useState } from 'react';
import { settingsApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { Clock } from 'lucide-react';

export function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string> | null>(null);
  const { user, _hasHydrated } = useAuthStore();

  useEffect(() => {
    // Solo pedimos configuraciones una vez
    settingsApi.getAll()
      .then(r => setSettings(r.data.data || {}))
      .catch(() => setSettings({}));
  }, []);

  // 1. Mientras NO se haya hidratado el Auth o cargado los settings, 
  // renderizamos un estado neutro para evitar parpadeos
  if (!_hasHydrated || settings === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
      </div>
    );
  }

  // 2. Si el modo mantenimiento está APAGADO, pasamos directo
  if (settings.maintenance_mode !== 'true') return <>{children}</>;

  // 3. Si eres SuperAdmin, saltas el mantenimiento siempre
  if (user?.role === 'super_admin') return <>{children}</>;

  // 4. De lo contrario, mostramos la pantalla de mantenimiento
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8 border border-pink-100">
          <span className="text-5xl">🌱</span>
        </div>

        <h1 className="text-4xl font-black text-gray-900 mb-4 leading-tight">
          {settings.maintenance_title || 'Estamos renovando nuestro jardín 🌱'}
        </h1>

        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
          {settings.maintenance_subtitle || 'Volvemos muy pronto con novedades hermosas. ¡Gracias por tu paciencia!'}
        </p>

        {settings.maintenance_eta && (
          <div className="inline-flex items-center gap-3 bg-white border border-pink-100 rounded-2xl px-6 py-4 shadow-sm mb-8">
            <Clock className="w-5 h-5 text-pink-400" />
            <span className="text-sm font-bold text-gray-700">
              Regresamos el: <span className="text-pink-600">{settings.maintenance_eta}</span>
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { emoji: '🌸', text: 'Flores frescas' },
            { emoji: '🚚', text: 'Envíos a todo el país' },
            { emoji: '💝', text: 'Suscripciones' },
          ].map(({ emoji, text }) => (
            <div key={text} className="bg-white px-4 py-2 rounded-full text-sm text-gray-600 font-medium border border-pink-100 shadow-sm">
              {emoji} {text}
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-10">
          © FLOR & VIDA - Florería Boutique
        </p>
      </div>
    </div>
  );
}
