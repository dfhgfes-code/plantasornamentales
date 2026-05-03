'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: '/hero/gift.png',
    bg: '#1a0f12',
    tag: 'Momentos inolvidables',
    title: 'Flores que cuentan historias',
    subtitle: 'Sorprende a quienes más quieres con detalles que nacen del corazón y perduran en la memoria.',
    cta: 'Ver catálogo',
    href: '/tienda',
  },
  {
    image: '/hero/field.png',
    bg: '#1a1a0a',
    tag: 'Naturaleza pura',
    title: 'Frescura desde el origen',
    subtitle: 'Nuestras flores crecen bajo el sol y llegan a tu puerta con toda la vitalidad del campo.',
    cta: 'Suscripciones',
    href: '/planes',
  },
  {
    image: '/hero/hands.png',
    bg: '#180a10',
    tag: 'El detalle perfecto',
    title: 'El arte de regalar',
    subtitle: 'Cada entrega es una experiencia de lujo diseñada para transmitir tus sentimientos más puros.',
    cta: 'Comprar ahora',
    href: '/tienda',
  },
  {
    image: '/hero/artisan.png',
    bg: '#0a0a1a',
    tag: 'Pasión artesanal',
    title: 'Hecho con el alma',
    subtitle: 'Arreglos florales creados a mano por expertos apasionados por la belleza y la delicadeza.',
    cta: 'Explorar tienda',
    href: '/tienda',
  },
];


export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  // Precargamos todas las imágenes al montar
  const [imgLoaded, setImgLoaded] = useState<Record<number, boolean>>({});

  const goTo = useCallback((index: number) => setCurrent(index), []);
  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), []);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  // Precargar todas las imágenes al inicio
  useEffect(() => {
    slides.forEach((s, i) => {
      const img = new window.Image();
      img.onload = () => setImgLoaded(prev => ({ ...prev, [i]: true }));
      img.src = s.image;
    });
  }, []);

  const slide = slides[current];

  return (
    <section className="relative h-[88vh] min-h-[520px] overflow-hidden">
      {/* Fondo de color siempre visible */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ background: slide.bg }}
      />

      {/* Todas las imágenes apiladas, solo la actual visible */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current && imgLoaded[i] ? 1 : 0 }}
        >
          <img
            src={s.image}
            alt=""
            className="w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      ))}

      {/* Contenido */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <div key={current} className="max-w-xl animate-slide-up">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-6 h-px bg-white/50" />
              <span className="text-white/70 text-xs font-medium tracking-[0.2em] uppercase">
                {slide.tag}
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] mb-5">
              {slide.title}
            </h1>
            <p className="text-white/65 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
              {slide.subtitle}
            </p>
            <Link
              href={slide.href}
              className="group inline-flex items-center gap-3 bg-white text-gray-900 hover:bg-pink-50 font-semibold px-7 py-3.5 rounded-2xl transition-all shadow-lg hover:-translate-y-0.5 text-sm"
            >
              {slide.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Flechas */}
      <button
        onClick={prev}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? 'w-7 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Contador */}
      <div className="absolute bottom-7 right-6 z-10 text-white/40 text-xs tracking-widest">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  );
}
