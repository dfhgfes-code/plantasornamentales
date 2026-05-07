'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, ArrowRight, Gift, Check } from 'lucide-react';
import { settingsApi } from '@/lib/api';

export function WelcomePopup() {
  const [visible, setVisible] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    const seen = sessionStorage.getItem('popup_seen');
    if (seen) return;

    settingsApi.getAll().then(res => {
      const s = res.data.data || {};
      setSettings(s);
      // Only show if popup is enabled in settings
      if (s.popup_enabled !== 'false') {
        const timer = setTimeout(() => setVisible(true), 1800);
        return () => clearTimeout(timer);
      }
    }).catch(() => {
      // Fallback: show popup anyway
      const timer = setTimeout(() => setVisible(true), 1800);
      return () => clearTimeout(timer);
    });
  }, []);

  const close = () => {
    setVisible(false);
    sessionStorage.setItem('popup_seen', '1');
  };

  if (!visible) return null;

  const title = settings.popup_title || '¡Bienvenida a nuestra familia floral!';
  const subtitle = settings.popup_subtitle || 'Únete y obtén 10% de descuento en tu primer pedido';
  const discountLabel = settings.popup_discount_label || '10% en tu primera compra';
  const ctaText = settings.popup_cta_text || 'Quiero unirme ahora';
  const ctaLink = settings.popup_cta_link || '/registro';

  return (
    <div
      className="modal-overlay fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="modal-content relative bg-white rounded-3xl overflow-hidden shadow-modal max-w-md w-full">

        {/* Botón cerrar */}
        <button
          onClick={close}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 transition-all shadow-sm border border-gray-100"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header con gradiente */}
        <div
          className="relative h-48 flex items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fdf2f8 40%, #fff1f5 100%)' }}
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-20 select-none pointer-events-none">
            <span style={{ fontSize: 180, lineHeight: 1 }}>🌸</span>
          </div>

          <span className="absolute top-4 left-6 text-4xl opacity-60 animate-float">🌷</span>
          <span className="absolute top-8 right-10 text-3xl opacity-50 animate-float" style={{ animationDelay: '1s' }}>🌺</span>
          <span className="absolute bottom-4 left-12 text-3xl opacity-50 animate-float" style={{ animationDelay: '0.5s' }}>🌼</span>
          <span className="absolute bottom-6 right-6 text-4xl opacity-60 animate-float" style={{ animationDelay: '1.5s' }}>🌹</span>

          <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg z-10">
            <Gift className="w-3.5 h-3.5" />
            {discountLabel}
          </div>

          <div className="relative z-10 w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-rose-100">
            <span className="text-4xl">🌸</span>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-7 pb-7 pt-5 text-center">
          <h2 className="font-display text-2xl font-bold text-gray-900 leading-tight mb-2">
            {title}
          </h2>

          <p className="text-gray-500 text-sm leading-relaxed mb-5 max-w-xs mx-auto">
            {subtitle}
          </p>

          {/* Beneficios */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { emoji: '🌷', text: 'Flores frescas' },
              { emoji: '🚚', text: 'Envío gratis' },
              { emoji: '💝', text: 'Sin contratos' },
            ].map(({ emoji, text }) => (
              <div key={text} className="bg-rose-50 rounded-2xl py-3 px-2 border border-rose-100">
                <div className="text-2xl mb-1">{emoji}</div>
                <p className="text-xs text-gray-600 font-medium">{text}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2.5">
            <Link
              href={ctaLink}
              onClick={close}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm"
            >
              {ctaText}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/planes"
              onClick={close}
              className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold py-3 rounded-2xl transition-all text-sm border border-rose-100"
            >
              Ver planes de suscripción
            </Link>
            <button
              onClick={close}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
            >
              Seguir explorando sin registrarme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
