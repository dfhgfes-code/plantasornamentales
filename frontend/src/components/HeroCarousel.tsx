'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { settingsApi } from '@/lib/api';

export function HeroCarousel() {
  const [slides, setSlides] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [imgLoaded, setImgLoaded] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await settingsApi.getAll();
      const carouselData = JSON.parse(res.data.home_hero_carousel || '[]');
      if (carouselData.length > 0) {
        setSlides(carouselData);
      } else {
        // Fallback default slides if empty
        setSlides([
          {
            image: '/hero/field.png',
            title: 'Flores frescas para momentos inolvidables',
            subtitle: 'Enviamos amor en cada ramo a todo el país',
            buttonText: 'Ver Colección',
            buttonLink: '/tienda',
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching carousel settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const goTo = useCallback((index: number) => setCurrent(index), []);
  const next = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent(c => (c + 1) % slides.length);
  }, [slides.length]);
  const prev = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent(c => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-play
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  // Precargar imágenes
  useEffect(() => {
    slides.forEach((s, i) => {
      if (!s.image) return;
      const img = new window.Image();
      img.onload = () => setImgLoaded(prev => ({ ...prev, [i]: true }));
      img.src = s.image;
    });
  }, [slides]);

  if (loading || slides.length === 0) {
    return <div className="h-[88vh] bg-gray-900 animate-pulse flex items-center justify-center text-white/20">Cargando...</div>;
  }

  const slide = slides[current];

  return (
    <section className="relative h-[88vh] min-h-[520px] overflow-hidden bg-gray-900">
      {/* Todas las imágenes apiladas, solo la actual visible */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          {s.image && (
            <img
              src={s.image}
              alt=""
              className="w-full h-full object-cover object-center"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* Contenido */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <div key={current} className="max-w-xl animate-slide-up">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-6 h-px bg-white/50" />
              <span className="text-white/70 text-xs font-medium tracking-[0.2em] uppercase">
                {slide.tag || 'Momentos Inolvidables'}
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] mb-5 drop-shadow-lg">
              {slide.title}
            </h1>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-md drop-shadow-md">
              {slide.subtitle}
            </p>
            <Link
              href={slide.buttonLink || '/tienda'}
              className="group inline-flex items-center gap-3 bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl hover:-translate-y-0.5 text-sm tracking-wide"
            >
              {slide.buttonText || 'Ver catálogo'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Flechas */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white transition-all shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white transition-all shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}

      {/* Contador */}
      <div className="absolute bottom-8 right-8 z-10 text-white/50 text-xs font-bold tracking-[0.3em]">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  );
}
