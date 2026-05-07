import { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Leaf, Star, Truck, Award, Users, ArrowRight, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quiénes Somos | Janneth Acevedo - Plantas Ornamentales',
  description: 'Conoce la historia de Janneth Acevedo, nuestra pasión por las flores y el compromiso de llevar belleza natural a cada hogar colombiano.',
};

export default function NosotrosPage() {
  const values = [
    {
      icon: Heart,
      title: 'Pasión floral',
      desc: 'Cada ramo es creado con amor y dedicación. Seleccionamos personalmente cada flor para garantizar la más alta calidad.',
      color: 'bg-rose-50 text-rose-500',
    },
    {
      icon: Leaf,
      title: 'Frescura garantizada',
      desc: 'Trabajamos directamente con cultivadores locales para asegurar que cada flor llegue a tu puerta en su punto óptimo.',
      color: 'bg-green-50 text-green-500',
    },
    {
      icon: Truck,
      title: 'Entrega puntual',
      desc: 'Sabemos que los momentos especiales no esperan. Por eso nos comprometemos con entregas a tiempo, siempre.',
      color: 'bg-blue-50 text-blue-500',
    },
    {
      icon: Award,
      title: 'Calidad premium',
      desc: 'Solo trabajamos con las mejores variedades florales, cuidadosamente seleccionadas para durar más y lucir mejor.',
      color: 'bg-amber-50 text-amber-500',
    },
  ];

  const stats = [
    { number: '+500', label: 'Clientes felices' },
    { number: '+3', label: 'Años de experiencia' },
    { number: '+50', label: 'Variedades de flores' },
    { number: '100%', label: 'Flores frescas' },
  ];

  const team = [
    {
      name: 'Janneth Acevedo',
      role: 'Fundadora & Florista',
      bio: 'Con más de 10 años de experiencia en el mundo floral, Janneth transformó su pasión en un negocio que lleva alegría a cientos de hogares colombianos.',
      img: '/flowers/f-rosas-rosadas.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fdfaf7]">

      {/* ── Hero ── */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img
          src="/flowers/slide1.jpg"
          alt="Janneth Acevedo - Quiénes somos"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a0f]/85 via-[#1a0a0f]/50 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-rose-300 text-xs font-semibold tracking-widest uppercase mb-3">Nuestra historia</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              Quiénes<br />
              <span className="italic text-rose-300">somos</span>
            </h1>
            <p className="text-white/70 text-base max-w-md leading-relaxed">
              Una historia de amor por las flores, nacida en Colombia para el mundo.
            </p>
          </div>
        </div>
      </div>

      {/* ── Historia ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-rose-600 text-xs font-bold tracking-[0.2em] uppercase mb-3">Nuestra historia</p>
              <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Cada flor cuenta<br />
                <span className="italic text-rose-600">una historia</span>
              </h2>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>
                  Janneth Acevedo nació de una pasión genuina por la naturaleza y la belleza de las flores. Lo que comenzó como un pequeño proyecto personal se convirtió en una empresa dedicada a llevar alegría, color y frescura a los hogares colombianos.
                </p>
                <p>
                  Creemos que las flores tienen el poder de transformar espacios, celebrar momentos y expresar lo que las palabras a veces no pueden. Por eso, cada ramo que creamos lleva consigo dedicación, cuidado y un toque personal que lo hace único.
                </p>
                <p>
                  Trabajamos directamente con cultivadores locales, apoyando la agricultura colombiana y garantizando que cada flor llegue a tu puerta en su estado más fresco y hermoso.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/tienda"
                  className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-sm text-sm"
                >
                  Ver nuestras flores <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 border-2 border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold px-6 py-3 rounded-xl transition-all text-sm"
                >
                  Contáctanos
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-3xl overflow-hidden h-48 shadow-md">
                    <img src="/flowers/f-rosas-rosadas.jpg" alt="Rosas rosadas" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="rounded-3xl overflow-hidden h-36 shadow-md">
                    <img src="/flowers/f-girasoles.jpg" alt="Girasoles" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="rounded-3xl overflow-hidden h-36 shadow-md">
                    <img src="/flowers/f-tulipanes.jpg" alt="Tulipanes" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="rounded-3xl overflow-hidden h-48 shadow-md">
                    <img src="/flowers/f-arreglo.jpg" alt="Arreglo floral" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
              </div>
              {/* Badge flotante */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 border border-rose-100">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-rose-500 fill-rose-500" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">+500 clientes</p>
                    <p className="text-xs text-gray-400">nos recomiendan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Estadísticas ── */}
      <section className="py-16 bg-rose-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl sm:text-5xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {stat.number}
                </p>
                <p className="text-rose-200 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Valores ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-rose-600 text-xs font-bold tracking-[0.2em] uppercase mb-3">Lo que nos mueve</p>
            <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Nuestros <span className="italic text-rose-600">valores</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-[#fdfaf7] rounded-3xl p-6 border border-gray-100 hover:shadow-md transition-shadow group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${v.color} group-hover:scale-110 transition-transform`}>
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-base">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Equipo ── */}
      <section className="py-20 bg-[#fdfaf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-rose-600 text-xs font-bold tracking-[0.2em] uppercase mb-3">Las personas detrás</p>
            <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Nuestro <span className="italic text-rose-600">equipo</span>
            </h2>
          </div>
          <div className="flex justify-center">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 max-w-sm w-full hover:shadow-md transition-shadow">
                <div className="h-64 overflow-hidden">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {member.name}
                  </h3>
                  <p className="text-rose-500 text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Por qué elegirnos ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-3xl overflow-hidden h-96 shadow-lg">
              <img src="/flowers/bouquet.jpg" alt="Ramo de flores" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {['#fda4af', '#f9a8d4', '#fbcfe8', '#fce7f3'].map((c) => (
                        <div key={c} className="w-8 h-8 rounded-full border-2 border-white" style={{ background: c }} />
                      ))}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">+500 suscriptoras activas</p>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                        <span className="text-xs text-gray-400 ml-1">5.0 promedio</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-rose-600 text-xs font-bold tracking-[0.2em] uppercase mb-3">¿Por qué elegirnos?</p>
              <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Más que flores,<br />
                <span className="italic text-rose-600">experiencias</span>
              </h2>
              <div className="space-y-4">
                {[
                  'Flores frescas seleccionadas el mismo día de la entrega',
                  'Cultivadores locales colombianos — apoyamos lo nuestro',
                  'Suscripciones flexibles sin compromisos ni penalizaciones',
                  'Atención personalizada por WhatsApp y correo',
                  'Empaque premium ideal para regalo',
                  'Nota de dedicatoria incluida sin costo adicional',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5 text-rose-600" />
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/planes"
                  className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-sm text-sm"
                >
                  Ver planes de suscripción <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-20 bg-rose-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-pink-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl mb-5">🌸</div>
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            ¿Lista para recibir flores?
          </h2>
          <p className="text-rose-100 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            Únete a nuestra comunidad floral y recibe flores frescas directamente en tu puerta.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 bg-white text-rose-700 hover:bg-rose-50 font-bold px-8 py-4 rounded-2xl transition-all shadow-xl hover:-translate-y-1 text-sm"
            >
              Explorar tienda <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 border-2 border-white/40 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-2xl transition-all text-sm"
            >
              Hablar con nosotros
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
