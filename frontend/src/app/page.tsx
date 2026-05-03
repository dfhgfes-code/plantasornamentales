'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Star, Check, ShoppingCart } from 'lucide-react';
import { productsApi, plansApi } from '@/lib/api';
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
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    productsApi.getAll({ limit: 4, sortBy: 'createdAt', sortOrder: 'DESC' })
      .then((r) => setProducts(r.data.data.data || []));
    plansApi.getAll(true).then((r) => setPlans(r.data.data || []));
  }, []);

  const handleAdd = (product: any) => {
    addItem({ id: product.id, name: product.name, price: Number(product.price), imageUrl: product.imageUrl });
    toast.success(`${product.name} agregado al carrito 🌸`);
  };

  return (
    <>
      {/* Popup de bienvenida */}
      <WelcomePopup />

      {/* ── HERO CARRUSEL ── */}
      <HeroCarousel />

      {/* ── BANDA DE CONFIANZA ── */}
      <div className="bg-pink-500 py-3 overflow-hidden">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: 'marquee2 22s linear infinite' }}
        >
          {/* 2 copias exactas para loop perfecto con marquee -50% */}
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-10 shrink-0 px-5">
              {[
                '🌸 Flores frescas garantizadas',
                '🚚 Envío a domicilio',
                '🔄 Suscripciones flexibles',
                '⭐ +500 clientes felices',
                '❌ Cancela cuando quieras',
                '💝 Arreglos hechos a mano',
                '🌷 Entrega el mismo día',
              ].map((t) => (
                <span key={t} className="text-white text-sm font-medium">{t}</span>
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
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                {/* Label siempre visible abajo */}
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
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end p-4 opacity-0 group-hover:opacity-100">
                        <button onClick={() => handleAdd(product)}
                          className="w-full bg-white text-pink-600 font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-pink-50 transition-colors shadow-lg">
                          <ShoppingCart className="w-4 h-4" /> Agregar al carrito
                        </button>
                      </div>
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-pink-600 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                        {product.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <Link href={`/tienda/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-pink-600 transition-colors mb-1 line-clamp-1">{product.name}</h3>
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
              className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3.5 rounded-2xl transition-all shadow-pink hover:shadow-lg hover:-translate-y-0.5 text-sm">
              Ver toda la tienda <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN SUSCRIPCIONES ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Imagen */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-[0_20px_60px_rgba(240,67,110,0.15)]">
                <img
                  src="/flowers/f-rosas-rosadas.jpg"
                  alt="suscripción"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Card flotante */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-soft p-5 max-w-[200px] border border-pink-100">
                <div className="text-3xl mb-2">🌸</div>
                <p className="font-semibold text-gray-900 text-sm">+500 suscriptoras</p>
                <p className="text-xs text-gray-400 mt-0.5">reciben flores cada semana</p>
                <div className="flex -space-x-2 mt-3">
                  {['#fda4af', '#f9a8d4', '#fbcfe8', '#fce7f3'].map((c) => (
                    <div key={c} className="w-7 h-7 rounded-full border-2 border-white" style={{ background: c }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Texto */}
            <div>
              <p className="text-pink-500 text-xs font-semibold tracking-[0.2em] uppercase mb-3">Suscripciones</p>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-5">
                Flores frescas,<br />
                <span className="italic text-pink-500">sin preocuparte</span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                Elige tu plan y nosotros nos encargamos de todo. Seleccionamos las flores más frescas y las entregamos directamente en la puerta de quien tú quieras.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Flores frescas seleccionadas el mismo día',
                  'Entrega a domicilio incluida',
                  'Pausa o cancela cuando quieras',
                  'Personaliza el destinatario',
                  'Nota de regalo incluida',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-pink-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/planes"
                className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-7 py-3.5 rounded-2xl transition-all shadow-pink hover:shadow-lg hover:-translate-y-0.5 text-sm">
                Ver planes disponibles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLANES RÁPIDOS ── */}
      <section className="py-16 bg-pink-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-pink-500 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Precios</p>
            <h2 className="font-display text-4xl font-bold text-gray-900">
              Elige tu <span className="italic text-pink-500">plan</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan, i) => (
              <div key={plan.id}
                className={`rounded-2xl p-6 transition-all hover:-translate-y-1 ${
                  i === 1
                    ? 'bg-pink-500 text-white shadow-pink'
                    : 'bg-white shadow-card hover:shadow-soft border border-pink-50'
                }`}>
                <div className={`text-xs font-semibold tracking-widest uppercase mb-3 ${i === 1 ? 'text-pink-100' : 'text-pink-400'}`}>
                  {plan.frequency === 'weekly' ? 'Semanal' : 'Mensual'}
                </div>
                <h3 className={`font-display font-bold text-xl mb-1 ${i === 1 ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <div className="my-4">
                  <span className={`font-display text-3xl font-bold ${i === 1 ? 'text-white' : 'text-pink-600'}`}>
                    {formatCurrency(Number(plan.price))}
                  </span>
                  <span className={`text-xs ml-1 ${i === 1 ? 'text-pink-100' : 'text-gray-400'}`}>
                    /{plan.frequency === 'weekly' ? 'sem' : 'mes'}
                  </span>
                </div>
                {plan.features?.slice(0, 3).map((f: string) => (
                  <div key={f} className={`flex items-center gap-2 text-xs mb-2 ${i === 1 ? 'text-pink-100' : 'text-gray-500'}`}>
                    <Check className="w-3.5 h-3.5 shrink-0" /> {f}
                  </div>
                ))}
                <Link href={`/planes/${plan.id}`}
                  className={`block text-center mt-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    i === 1
                      ? 'bg-white text-pink-600 hover:bg-pink-50'
                      : 'bg-pink-500 text-white hover:bg-pink-600 shadow-pink'
                  }`}>
                  Suscribirme
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-pink-500 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Testimonios</p>
            <h2 className="font-display text-4xl font-bold text-gray-900">
              Lo que dicen <span className="italic text-pink-500">ellas</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Carolina M.', city: 'Bogotá', text: 'Las flores llegaron perfectas y frescas. El arreglo era exactamente como lo pedí. ¡Definitivamente seguiré suscrita!', avatar: '🌸' },
              { name: 'Valentina R.', city: 'Medellín', text: 'Llevo 3 meses con la suscripción semanal y cada entrega es una sorpresa hermosa. El servicio al cliente es excelente.', avatar: '🌷' },
              { name: 'Sofía L.', city: 'Cali', text: 'Regalé una suscripción mensual a mi mamá y quedó encantada. La calidad de las flores es increíble.', avatar: '🌺' },
            ].map(({ name, city, text, avatar }) => (
              <div key={name} className="bg-pink-50/60 rounded-2xl p-6 border border-pink-100 hover:shadow-soft transition-all">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-lg">{avatar}</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{name}</p>
                    <p className="text-xs text-gray-400">{city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALERÍA LIFESTYLE ── */}
      <section className="py-16 bg-pink-50/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
          <p className="text-pink-500 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Inspiración</p>
          <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">
            Momentos <span className="italic text-pink-500">Janneth</span>
          </h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">Compartimos la alegría de cada entrega. Síguenos y forma parte de nuestra comunidad floral.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          {[
            { img: '/hero/gift.png', tag: '@marian_flores' },
            { img: '/hero/field.png', tag: '@campo_vibrante' },
            { img: '/hero/hands.png', tag: '@detalles_lujo' },
            { img: '/hero/artisan.png', tag: '@hecho_con_amor' },
          ].map((item, i) => (
            <div key={i} className="group relative aspect-square rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <img src={item.img} alt="gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <span className="text-white text-xs font-medium tracking-wide">{item.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ── CTA FINAL ── */}
      <section className="relative py-20 overflow-hidden bg-pink-500">
        {/* Decoración */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl mb-5 animate-float inline-block">🌸</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Únete a nuestra familia floral
          </h2>
          <p className="text-pink-100 text-lg mb-8 max-w-lg mx-auto">
            Regístrate hoy y recibe 10% de descuento en tu primer pedido. Sin compromisos.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/registro"
              className="inline-flex items-center gap-2 bg-white text-pink-600 hover:bg-pink-50 font-bold px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm">
              Crear cuenta gratis <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/tienda"
              className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 border border-pink-400 text-white font-semibold px-8 py-4 rounded-2xl transition-all text-sm">
              Ver tienda
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
