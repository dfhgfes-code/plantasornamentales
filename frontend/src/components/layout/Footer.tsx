import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-950 text-white/60">
      {/* Newsletter */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-white mb-1">Recibe inspiración floral</h3>
              <p className="text-white/40 text-sm">Novedades, ofertas y tips de cuidado</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input type="email" placeholder="tu@email.com"
                className="flex-1 md:w-64 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500 transition-colors" />
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-pink">
                Suscribirse <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌸</span>
              <div>
                <span className="font-display font-bold text-white text-lg leading-none block">Janneth Acevedo</span>
                <span className="text-[9px] text-pink-400 tracking-[0.18em] uppercase">Plantas Ornamentales</span>
              </div>
            </div>
            <p className="text-sm text-white/35 leading-relaxed max-w-xs mb-5">
              Llevamos la belleza de las flores directamente a tu puerta. Suscripciones y arreglos florales para cada ocasión especial.
            </p>
            <div className="flex gap-2">
              {['Instagram', 'Facebook', 'WhatsApp'].map((s) => (
                <a key={s} href="#" className="px-3 py-1.5 bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/30 rounded-lg text-xs text-white/40 hover:text-white transition-all">{s}</a>
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
              {[[Phone, '+57 300 123 4567'], [Mail, 'hola@jannethplants.co'], [MapPin, 'Bogotá, Colombia']].map(([Icon, text]: any) => (
                <li key={text} className="flex items-center gap-2.5 text-sm text-white/35">
                  <Icon className="w-4 h-4 text-pink-400 shrink-0" /> {text}
                </li>
              ))}
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
