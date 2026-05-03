'use client';
import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, ArrowRight, ShieldCheck, Award, Sprout } from 'lucide-react';
import Link from 'next/link';
import { settingsApi } from '@/lib/api';

export function Footer() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    settingsApi.getAll().then(res => setSettings(res.data.data || {})).catch(() => {});
  }, []);

  const trustBadges = [
    { Icon: ShieldCheck, title: 'Pago 100% Seguro', desc: 'Protección de datos' },
    { Icon: Sprout, title: 'Frescura Garantizada', desc: 'Directo del campo' },
    { Icon: Award, title: 'Calidad Premium', desc: 'Flores seleccionadas' },
  ];

  return (
    <footer className="bg-gray-950 text-white/60">
      {/* Newsletter & Trust Badges */}
      <div className="border-b border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="font-display text-2xl font-bold text-white mb-1">Recibe inspiración floral</h3>
                <p className="text-white/40 text-sm">Novedades, ofertas y tips de cuidado</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <input type="email" placeholder="tu@email.com"
                  className="flex-1 md:w-64 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500 transition-colors" />
                <button className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-pink">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-12">
              {trustBadges.map((b) => (
                <div key={b.title} className="text-center group">
                  <div className="inline-flex p-2.5 bg-white/5 rounded-xl mb-2 group-hover:bg-pink-500/10 transition-colors">
                    <b.Icon className="w-5 h-5 text-pink-400" />
                  </div>
                  <h4 className="text-[10px] uppercase tracking-wider font-bold text-white mb-0.5">{b.title}</h4>
                  <p className="text-[9px] text-white/20">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">🌸</span>
              <div>
                <span className="font-display font-bold text-white text-xl leading-none block">Janneth Acevedo</span>
                <span className="text-[10px] text-pink-400 tracking-[0.2em] uppercase font-semibold">Plantas Ornamentales</span>
              </div>
            </div>
            <p className="text-sm text-white/35 leading-relaxed max-w-sm mb-6">
              Llevamos la belleza y el alma de las flores directamente a tu puerta. Suscripciones personalizadas y arreglos premium para transformar cada momento en un recuerdo inolvidable.
            </p>
            <div className="flex gap-2">
              {[
                { name: 'Instagram', url: settings.shop_instagram || '#' },
                { name: 'Facebook', url: settings.shop_facebook || '#' },
                { name: 'WhatsApp', url: `https://wa.me/${settings.shop_whatsapp}` }
              ].map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/30 rounded-xl text-xs text-white/40 hover:text-white transition-all font-medium">{s.name}</a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Navegación</h4>
            <ul className="space-y-2.5">
              {[['/', 'Inicio'], ['/tienda', 'Tienda'], ['/planes', 'Suscripciones'], ['/carrito', 'Carrito'], ['/perfil', 'Mi cuenta']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/35 hover:text-pink-300 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-white/35">
                <Phone className="w-4 h-4 text-pink-400 shrink-0" /> {settings.shop_phone || '+57 300 123 4567'}
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/35">
                <Mail className="w-4 h-4 text-pink-400 shrink-0" /> {settings.shop_email || 'hola@jannethplants.co'}
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/35">
                <MapPin className="w-4 h-4 text-pink-400 shrink-0" /> {settings.shop_address || 'Bogotá, Colombia'}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/20">© {new Date().getFullYear()} Janneth Acevedo Plantas Ornamentales</p>
          <div className="flex gap-4 text-xs text-white/20">
            <a href="#" className="hover:text-white/40 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white/40 transition-colors">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
