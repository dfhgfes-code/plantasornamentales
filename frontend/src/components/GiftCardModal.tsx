import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, PenTool, Sparkles } from 'lucide-react';

export function GiftCardModal({
  value,
  onChange,
  onClose,
}: {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState(value);

  // Importar fuente cursiva elegante solo para este modal
  useEffect(() => {
    if (!document.getElementById('cursive-font')) {
      const link = document.createElement('link');
      link.id = 'cursive-font';
      link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-0 bg-black/40 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onChange(text);
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.8, rotateX: 20, opacity: 0, y: 20 }}
          animate={{ scale: 1, rotateX: 0, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, rotateX: -20, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          style={{ perspective: 1200 }}
          className="w-full max-w-md relative"
        >
          {/* Sombra proyectada tipo 3D */}
          <div className="absolute inset-0 bg-black/20 blur-xl translate-y-8 rounded-[2rem] -z-10" />

          {/* Tarjeta Física */}
          <div className="relative bg-[#FCFBF8] rounded-2xl shadow-2xl overflow-hidden border border-[#EADDD5]">
            
            {/* Header de la tarjeta */}
            <div className="relative px-6 pt-8 pb-6 bg-[#FAF6F0] border-b border-[#EADDD5] flex flex-col items-center justify-center text-center">
              {/* Sello de cera ilustrado (CSS) */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-700 to-rose-900 border-2 border-rose-950/20 shadow-inner flex items-center justify-center mb-3 shadow-[0_4px_10px_rgba(159,18,57,0.3)]">
                <Sparkles className="w-6 h-6 text-rose-100/90" strokeWidth={1.5} />
              </div>
              
              <h3 className="text-[#4A3C31] font-bold text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                Mensaje Especial
              </h3>
              <p className="text-[#8C7A6B] text-[10px] mt-1.5 uppercase tracking-[0.2em] font-semibold">
                Para acompañar tus flores
              </p>

              <button
                onClick={() => { onChange(text); onClose(); }}
                className="absolute top-4 right-4 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all text-[#8C7A6B] hover:text-rose-700 shadow-sm border border-[#EADDD5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cuerpo de la tarjeta (Papel rayado) */}
            <div 
              className="px-8 pt-8 pb-6 relative"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`
              }}
            >
              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={250}
                rows={5}
                placeholder="Con todo mi amor..."
                className="relative w-full bg-transparent resize-none text-2xl text-[#2C241B] focus:outline-none z-10 placeholder:text-[#BCAAA4]"
                style={{ 
                  fontFamily: "'Dancing Script', cursive", 
                  // Patrón de líneas de renglón
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, #EADDD5 39px, #EADDD5 40px)',
                  lineHeight: '40px',
                  backgroundAttachment: 'local'
                }}
              />

              <div className="flex items-center justify-between mt-6">
                <span className="text-[10px] text-[#8C7A6B] font-semibold uppercase tracking-wider">
                  {text.length}/250
                </span>
                <span className="text-[10px] text-rose-700 flex items-center gap-1.5 font-bold bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">
                  <PenTool className="w-3 h-3" /> Transcrito a mano
                </span>
              </div>
            </div>

            {/* Footer de acción */}
            <div className="px-6 py-4 bg-white border-t border-[#EADDD5] flex justify-end gap-3">
              <button
                onClick={() => { onChange(text); onClose(); }}
                className="bg-[#4A3C31] hover:bg-[#2C241B] text-[#FCFBF8] font-bold px-6 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5"
              >
                <Check className="w-4 h-4" /> Guardar tarjeta
              </button>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
