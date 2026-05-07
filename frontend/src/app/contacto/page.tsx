'use client';
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { settingsApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ContactoPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    settingsApi.getAll().then(r => setSettings(r.data.data || {})).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simula envío — en producción conectar con endpoint de contacto o servicio de email
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
    toast.success('Mensaje enviado. Te responderemos pronto 🌸');
  };

  const phone = settings.shop_phone || '+57 300 123 4567';
  const email = settings.shop_email || 'hola@jannethplants.co';
  const address = settings.shop_address || 'Bogotá, Colombia';
  const whatsapp = settings.shop_whatsapp || '573001234567';

  const contactInfo = [
    {
      icon: Phone,
      title: 'Teléfono',
      value: phone,
      link: `tel:${phone.replace(/\s/g, '')}`,
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: Mail,
      title: 'Correo electrónico',
      value: email,
      link: `mailto:${email}`,
      color: 'bg-rose-50 text-rose-600',
    },
    {
      icon: MapPin,
      title: 'Ubicación',
      value: address,
      link: `https://maps.google.com/?q=${encodeURIComponent(address)}`,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Clock,
      title: 'Horario de atención',
      value: 'Lun – Sáb: 8am – 6pm',
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fdfaf7]">
      {/* Hero */}
      <div className="relative h-48 overflow-hidden">
        <img
          src="/flowers/f-rosas-rosadas.jpg"
          alt="Contacto"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a0f]/80 to-[#1a0a0f]/40 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-rose-300 text-xs font-semibold tracking-widest uppercase mb-2">Estamos aquí</p>
            <h1 className="font-serif text-4xl font-bold text-white">Contáctanos</h1>
            <p className="text-white/60 mt-1 text-sm">Responderemos en menos de 24 horas</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* Info de contacto */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Hablemos
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              ¿Tienes preguntas sobre nuestros productos, suscripciones o pedidos? Estamos felices de ayudarte.
            </p>

            <div className="space-y-4 mb-8">
              {contactInfo.map((item) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{item.title}</p>
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-semibold text-gray-800 hover:text-rose-600 transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${whatsapp}?text=Hola! Tengo una consulta sobre sus flores 🌸`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-2xl font-semibold text-sm transition-all hover:-translate-y-0.5 shadow-lg w-fit"
            >
              <MessageCircle className="w-5 h-5" />
              Chatear por WhatsApp
            </a>
          </div>

          {/* Formulario */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            {!sent ? (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Envíanos un mensaje
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Tu nombre"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="tu@correo.com"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Asunto</label>
                    <select
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all text-gray-700"
                    >
                      <option value="">Selecciona un tema</option>
                      <option value="pedido">Consulta sobre un pedido</option>
                      <option value="suscripcion">Suscripciones</option>
                      <option value="producto">Información de productos</option>
                      <option value="envio">Envíos y entregas</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mensaje *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Cuéntanos en qué podemos ayudarte..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar mensaje
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  ¡Mensaje recibido!
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Gracias por escribirnos, <strong>{form.name}</strong>. Te responderemos a <strong>{form.email}</strong> en menos de 24 horas.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="text-sm text-rose-500 hover:text-rose-600 font-medium transition-colors"
                >
                  Enviar otro mensaje
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
