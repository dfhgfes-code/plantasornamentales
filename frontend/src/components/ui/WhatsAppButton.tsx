'use client';
import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { settingsApi } from '@/lib/api';

export function WhatsAppButton() {
  const [whatsapp, setWhatsapp] = useState('');

  useEffect(() => {
    settingsApi.getAll().then(res => setWhatsapp(res.data.shop_whatsapp || '')).catch(() => {});
  }, []);

  if (!whatsapp) return null;

  const message = encodeURIComponent('¡Hola Janneth! 🌸 Vi tu tienda de flores y me encantaría hacer un pedido especial.');
  const url = `https://wa.me/${whatsapp}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[60] bg-[#25D366] text-white p-4 rounded-2xl shadow-[0_10px_25px_rgba(37,211,102,0.3)] hover:scale-110 hover:-translate-y-1 transition-all active:scale-95 group"
      title="Escríbenos por WhatsApp"
    >

      <div className="absolute -top-12 right-0 bg-white text-gray-800 text-[11px] font-bold py-1.5 px-3 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100">
        ¿En qué podemos ayudarte? 🌸
        <div className="absolute -bottom-1 right-4 w-2 h-2 bg-white border-b border-r border-gray-100 rotate-45" />
      </div>
      <MessageCircle className="w-6 h-6 fill-white" />
    </a>
  );
}
