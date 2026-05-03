'use client';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { ArrowRight, Star, Check, ShoppingCart, Bell } from 'lucide-react';
import { productsApi, plansApi, settingsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { HeroCarousel } from '@/components/HeroCarousel';
import { WelcomePopup } from '@/components/WelcomePopup';
import toast from 'react-hot-toast';

// Imágenes locales de flores — servidas desde /public/flowers/
const flowerImages = [
  { src: '/flowers/f-rosas-rojas.jpg',   label: 'Rosas Rojas',    color: '#fee2e2' },
  { src: '/flowers/f-girasoles.jpg',     label: 'Girasoles',      color: '#fef9c3' },
  { src: '/flowers/f-tulipanes.jpg',     label: 'Tulipanes',      color: '#fce7f3' },
  { src: '/flowers/f-orquideas.jpg',     label: 'Orquídeas',      color: '#f3e8ff' },
  { src: '/flowers/f-lilies.jpg',        label: 'Lilies',         color: '#fdf2f8' },
  { src: '/flowers/f-rosas-rosadas.jpg', label: 'Rosas Rosadas',  color: '#fff1f2' },
  { src: '/flowers/f-claveles.jpg',      label: 'Claveles',       color: '#fce7f3' },
  { src: '/flowers/f-arreglo.jpg',       label: 'Arreglos',       color: '#f0fdf4' },
];

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [marqueeItems, setMarqueeItems] = useState<string[]>([]);
  const addItem = useCartStore((s) => s.addItem);

  const loadData = useCallback(async () => {
    try {
      const [prodRes, planRes, setRes] = await Promise.all([
        productsApi.getAll({ limit: 4, sortBy: 'createdAt', sortOrder: 'DESC' }),
        plansApi.getAll(true),
        settingsApi.getAll()
      ]);
      
      setProducts(prodRes.data.data.data || []);
      setPlans(planRes.data.data || []);
      setSettings(setRes.data.data || {});
      
      if (setRes.data.data?.home_promo_marquee) {
        setMarqueeItems(JSON.parse(setRes.data.data.home_promo_marquee));
      }
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAdd = (product: any) => {
    addItem({ id: product.id, name: product.name, price: Number(product.price), imageUrl: product.imageUrl });
    toast.success(`${product.name} agregado al carrito 🌸`);
  };

  return (
    <>
      {/* Popup de bienvenida */}
      <WelcomePopup />

      {/* ── BANNER HOLIDAY (DINÁMICO) ── */}
      {settings?.home_holiday_banner_enabled === 'true' && (
        <div className="bg-indigo-600 py-2.5 px-4 text-center relative z-50">
          <Link href={settings.home_holiday_banner_link || '/tienda'} className="group flex items-center justify-center gap-3 text-white text-sm font-bold hover:opacity-90 transition-all">
            <Bell className="w-4 h-4 animate-bounce" />
            <span>{settings.home_holiday_banner_text}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}

      {/* ── HERO CARRUSEL ── */}
      <HeroCarousel />

      {/* ── BANDA DE CONFIANZA (DINÁMICA) ── */}
      <div className="bg-pink-500 py-3 overflow-hidden">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: 'marquee2 30s linear infinite' }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-12 shrink-0 px-6">
              {(marqueeItems.length > 0 ? marqueeItems : [
                '🌸 Flores frescas garantizadas',
                '🚚 Envío a domicilio',
                '🔄 Suscripciones flexibles',
                '⭐ +500 clientes felices'
              ]).map((t) => (
                <span key={t} className="text-white text-sm font-bold tracking-wide flex items-center gap-2">
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── CARRUSEL INFINITO DE FLORES ── */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-pink-500 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Galería</p>
              <h2 className="font-display text-4xl font-bold text-gray-900">
                Nuestra <span className="italic text-pink-500">colección</span>
              </h2>
            </div>
            <Link href="/tienda" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-pink-500 hover:text-pink-700 transition-colors group">
              Ver todo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Banda infinita de imágenes */}
        <div className="relative overflow-hidden">
          {/* Gradientes laterales */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="carousel-track">
            {[...flowerImages, ...flowerImages].map((img, i) => (
              <div
                key={i}
                className="shrink-0 w-52 mx-2 rounded-2xl overflow-hidden group cursor-pointer relative"
                style={{ height: '280px', background: img.color }}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <span className="text-white text-sm font-semibold drop-shadow">{img.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTOS DESTACADOS ── */}
      <section className="py-16 bg-pink-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-pink-500 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Más vendidos</p>
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-3">
              Flores <span className="italic text-pink-500">favoritas</span>
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">Las más elegidas por nuestras clientas cada semana</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden">
                    <div className="h-60 skeleton" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 skeleton rounded w-1/3" />
                      <div className="h-4 skeleton rounded w-2/3" />
                      <div className="h-4 skeleton rounded w-1/2" />
                    </div>
                  </div>
                ))
              : products.map((product) => (
                  <div key={product.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
                    <div className="relative h-60 overflow-hidden">
                      <img
                        src={product.imageUrl || '/flowers/f-rosas-rojas.jpg'}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end p-4 opacity-0 group-hover:opacity-100">
                        <button onClick={() => handleAdd(product)}
                          className="w-full bg-white text-pink-600 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-pink-50 transition-colors shadow-lg">
                          <ShoppingCart className="w-4 h-4" /> Agregar al carrito
                        </button>
                      </div>
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-pink-600 text-[10px] font-bold px-3 py-1.5 rounded-full">
                        {product.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <Link href={`/tienda/${product.id}`}>
                        <h3 className="font-bold text-gray-900 hover:text-pink-600 transition-colors mb-1 line-clamp-1">{product.name}</h3>
                      </Link>
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-pink-600 text-lg">{formatCurrency(Number(product.price))}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs text-gray-400">4.9</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/tienda"
              className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-pink hover:shadow-lg hover:-translate-y-0.5 text-sm">
              Ver toda la tienda <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN SUSCRIPCIONES ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-[0_20px_60px_rgba(240,67,110,0.15)]">
                <img src="/flowers/f-rosas-rosadas.jpg" alt="suscripción" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-soft p-6 max-w-[220px] border border-pink-100">
                <div className="text-3xl mb-3">🌸</div>
                <p className="font-bold text-gray-900 text-sm">+500 suscriptoras</p>
                <p className="text-xs text-gray-400 mt-1">reciben flores frescas cada semana</p>
                <div className="flex -space-x-2 mt-4">
                  {['#fda4af', '#f9a8d4', '#fbcfe8', '#fce7f3'].map((c) => (
                    <div key={c} className="w-8 h-8 rounded-full border-2 border-white" style={{ background: c }} />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-pink-500 text-xs font-bold tracking-[0.2em] uppercase mb-3">Suscripciones</p>
              <h2 className="font-display text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Flores frescas,<br />
                <span className="italic text-pink-500">sin preocuparte</span>
              </h2>
              <p className="text-gray-500 leading-relaxed text-lg mb-8">
                Elige tu plan y nosotros nos encargamos de todo. Seleccionamos las flores más frescas y las entregamos directamente en la puerta de quien tú quieras.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'Flores frescas seleccionadas el mismo día',
                  'Entrega a domicilio incluida',
                  'Pausa o cancela cuando quieras',
                  'Personaliza el destinatario',
                  'Nota de regalo incluida',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-pink-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/planes"
                className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-pink hover:shadow-lg hover:-translate-y-0.5 text-sm">
                Ver planes disponibles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative py-24 overflow-hidden bg-pink-500">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl mb-6 animate-float inline-block">🌸</div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Únete a nuestra familia floral
          </h2>
          <p className="text-pink-100 text-xl mb-10 max-w-lg mx-auto leading-relaxed">
            Regístrate hoy y recibe 10% de descuento en tu primer pedido. Sin compromisos.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/registro"
              className="inline-flex items-center gap-2 bg-white text-pink-600 hover:bg-pink-50 font-bold px-10 py-5 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-sm">
              Crear cuenta gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
