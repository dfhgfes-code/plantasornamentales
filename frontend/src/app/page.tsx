'use client';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { ArrowRight, Star, Check, ShoppingCart, Bell, ZoomIn, X, Package, Tag, Plus, Minus, Gift } from 'lucide-react';
import { productsApi, plansApi, settingsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroCarousel } from '@/components/HeroCarousel';
import { WelcomePopup } from '@/components/WelcomePopup';
import toast from 'react-hot-toast';

// Imágenes locales de flores — servidas desde /public/flowers/
const flowerImages = [
  { src: '/flowers/f-rosas-rojas.jpg',   label: 'Rosas Rojas',    color: '#fee2e2',  category: 'Rosas' },
  { src: '/flowers/f-girasoles.jpg',     label: 'Girasoles',      color: '#fef9c3',  category: 'Girasoles' },
  { src: '/flowers/f-tulipanes.jpg',     label: 'Tulipanes',      color: '#fce7f3',  category: 'Tulipanes' },
  { src: '/flowers/f-orquideas.jpg',     label: 'Orquídeas',      color: '#f3e8ff',  category: 'Orquídeas' },
  { src: '/flowers/f-lilies.jpg',        label: 'Lilies',         color: '#fdf2f8',  category: 'Lilies' },
  { src: '/flowers/f-rosas-rosadas.jpg', label: 'Rosas Rosadas',  color: '#fff1f2',  category: 'Rosas' },
  { src: '/flowers/f-claveles.jpg',      label: 'Claveles',       color: '#fce7f3',  category: 'Claveles' },
  { src: '/flowers/f-arreglo.jpg',       label: 'Arreglos',       color: '#f0fdf4',  category: 'Arreglos' },
];

/* ─── Mini modal de producto (igual al de tienda) ─────────── */
function ProductModal({ product, onClose }: { product: any; onClose: () => void }) {
  const [qty, setQty] = useState(1);
  const [selectedAdditionals, setSelectedAdditionals] = useState<Set<number>>(new Set());
  const { addItemWithAdditionals } = useCartStore();

  const additionals: { name: string; price: number; imageUrl?: string }[] = (() => {
    try { return JSON.parse(product.additionals || '[]'); } catch { return []; }
  })();

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
  }, [onClose]);

  const toggleAdditional = (i: number) => {
    setSelectedAdditionals(prev => {
      const next = new Set(prev); next.has(i) ? next.delete(i) : next.add(i); return next;
    });
  };

  const additionalsTotal = Array.from(selectedAdditionals).reduce((s, i) => s + (additionals[i]?.price || 0), 0);
  const totalPrice = Number(product.price) * qty + additionalsTotal;

  const handleAdd = () => {
    const selectedAddList = Array.from(selectedAdditionals).map(i => additionals[i]).filter(Boolean);
    for (let i = 0; i < qty; i++) {
      addItemWithAdditionals(
        { id: product.id, name: product.name, price: Number(product.price), imageUrl: product.imageUrl },
        selectedAddList.map(a => ({ name: a.name, price: a.price, imageUrl: a.imageUrl }))
      );
    }
    toast.success(`${product.name} agregado al carrito 🌸`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          className="bg-white w-full sm:rounded-3xl max-w-3xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col md:flex-row"
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Imagen */}
          <div className="relative md:w-[45%] h-64 md:h-auto shrink-0 bg-rose-50">
            <img src={product.imageUrl || '/flowers/f-rosas-rojas.jpg'} alt={product.name}
              className="w-full h-full object-cover" />
            <span className="absolute top-4 left-4 bg-white/90 text-rose-600 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm">
              {product.category}
            </span>
            <button onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all">
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 flex flex-col">
            <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mb-1">{product.category}</p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Georgia, serif" }}>
              {product.name}
            </h2>
            <div className="flex items-center gap-1 mb-3">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              <span className="text-xs text-gray-400 ml-1">5.0 · Premium</span>
            </div>
            <div className="mb-3">
              <span className="text-2xl font-bold text-rose-600" style={{ fontFamily: "Georgia, serif" }}>
                {formatCurrency(Number(product.price))}
              </span>
              <span className="text-gray-400 text-sm ml-1">COP</span>
            </div>
            <div className="h-px bg-gray-100 mb-3" />
            <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">{product.description}</p>

            {/* Adicionales */}
            {additionals.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-1.5">
                  🎁 Complementa tu pedido
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {additionals.map((a, i) => (
                    <button key={i} onClick={() => toggleAdditional(i)}
                      className={`relative rounded-xl border-2 p-2 text-left transition-all ${selectedAdditionals.has(i) ? 'border-rose-500 bg-rose-50' : 'border-gray-100 hover:border-rose-200'}`}>
                      {a.imageUrl && <img src={a.imageUrl} alt={a.name} className="w-full h-14 object-cover rounded-lg mb-1.5"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                      <p className="text-xs font-bold text-gray-800 line-clamp-1">{a.name}</p>
                      <p className="text-xs text-rose-600 font-bold">+{formatCurrency(a.price)}</p>
                      {selectedAdditionals.has(i) && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cantidad */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-semibold text-gray-700">Cantidad:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-rose-50 transition-colors">
                  <Minus className="w-3.5 h-3.5 text-gray-500" />
                </button>
                <span className="px-4 py-2 font-bold text-gray-900 border-x border-gray-200 min-w-[44px] text-center text-sm">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))} className="px-3 py-2 hover:bg-rose-50 transition-colors">
                  <Plus className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
              {selectedAdditionals.size > 0 && (
                <span className="text-xs text-gray-400">Total: <span className="font-bold text-rose-600">{formatCurrency(totalPrice)}</span></span>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-2">
              <button onClick={handleAdd} disabled={product.stock === 0}
                className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:-translate-y-0.5">
                <ShoppingCart className="w-4 h-4" />
                {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
              </button>
              <Link href={`/tienda/${product.id}`}
                className="px-4 py-3 border-2 border-gray-200 hover:border-rose-300 text-gray-500 hover:text-rose-600 rounded-2xl font-semibold text-sm transition-all flex items-center gap-1.5 whitespace-nowrap">
                Ver más <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-100">
              <p className="text-xs text-green-700 font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Frescura garantizada · Entrega a domicilio
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [marqueeItems, setMarqueeItems] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
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

  useEffect(() => { loadData(); }, [loadData]);

  // Al hacer clic en una imagen del carrusel, busca el primer producto de esa categoría
  const handleCarouselClick = async (category: string) => {
    try {
      const res = await productsApi.getAll({ category, limit: 1, isAvailable: true });
      const product = res.data.data.data?.[0];
      if (product) {
        setSelectedProduct(product);
      } else {
        // Si no hay producto de esa categoría, ir a la tienda filtrada
        window.location.href = `/tienda?category=${encodeURIComponent(category)}`;
      }
    } catch {
      window.location.href = '/tienda';
    }
  };

  const handleAdd = (product: any) => {
    addItem({ id: product.id, name: product.name, price: Number(product.price), imageUrl: product.imageUrl });
    toast.success(`${product.name} agregado al carrito 🌸`);
  };

  return (
    <>
      {/* Modal de producto */}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}

      {/* Popup de bienvenida */}
      <WelcomePopup />

      {/* ── BANNER HOLIDAY (DINÁMICO) ── */}
      {settings?.home_holiday_banner_enabled === 'true' && (
        <div className="bg-rose-600 py-2.5 px-4 text-center relative z-50">
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
      <div className="bg-rose-600 py-3 overflow-hidden">
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
              <p className="text-rose-600 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Galería</p>
              <h2 className="font-display text-4xl font-bold text-gray-900">
                Nuestra <span className="italic text-rose-600">colección</span>
              </h2>
            </div>
            <Link href="/tienda" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors group">
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
                onClick={() => handleCarouselClick(img.category)}
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
                {/* Overlay con lupa al hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-lg">
                    <ZoomIn className="w-5 h-5 text-rose-600" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <span className="text-white text-sm font-semibold drop-shadow">{img.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTOS DESTACADOS ── */}
      <section className="py-20 bg-cream-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-rose-600 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Más vendidos</p>
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-3">
              Flores <span className="italic text-rose-600">favoritas</span>
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
                    className="group bg-white rounded-[2rem] overflow-hidden shadow-card hover:shadow-glass transition-all duration-500 hover:-translate-y-2 border border-transparent hover:border-pink-100">
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={product.imageUrl || '/flowers/f-rosas-rojas.jpg'}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 flex items-end p-5 opacity-0 group-hover:opacity-100">
                        <button onClick={() => handleAdd(product)}
                          className="w-full bg-white/90 backdrop-blur-md text-rose-600 font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-glass transform translate-y-4 group-hover:translate-y-0 duration-500">
                          <ShoppingCart className="w-4 h-4" /> Agregar al carrito
                        </button>
                      </div>
                      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md text-rose-600 text-[10px] font-bold px-4 py-1.5 rounded-full shadow-sm">
                        {product.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <Link href={`/tienda/${product.id}`}>
                        <h3 className="font-bold text-gray-900 hover:text-rose-600 transition-colors mb-1 line-clamp-1">{product.name}</h3>
                      </Link>
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-rose-600 text-lg">{formatCurrency(Number(product.price))}</span>
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
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-pink hover:shadow-glass hover:-translate-y-1 text-sm tracking-wide">
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
              <div className="rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-glass">
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
              <p className="text-rose-600 text-xs font-bold tracking-[0.2em] uppercase mb-3">Suscripciones</p>
              <h2 className="font-display text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Flores frescas,<br />
                <span className="italic text-rose-600">sin preocuparte</span>
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
                    <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-rose-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/planes"
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-pink hover:shadow-lg hover:-translate-y-1 text-sm tracking-wide">
                Ver planes disponibles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative py-32 overflow-hidden bg-rose-700">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl mb-6 animate-float inline-block">🌸</div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Únete a nuestra familia floral
          </h2>
          <p className="text-rose-100 text-xl mb-10 max-w-lg mx-auto leading-relaxed">
            Regístrate hoy y recibe 10% de descuento en tu primer pedido. Sin compromisos.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/registro"
              className="inline-flex items-center gap-2 bg-white text-rose-700 hover:bg-rose-50 font-bold px-10 py-5 rounded-2xl transition-all shadow-xl hover:shadow-glass hover:-translate-y-1 text-sm tracking-wide">
              Crear cuenta gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

