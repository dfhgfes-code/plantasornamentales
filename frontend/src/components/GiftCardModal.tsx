import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Pen } from 'lucide-react';

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
  const lines = ['', '', '', '', ''];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onChange(text);
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.7, rotateY: -90, opacity: 0 }}
          animate={{ scale: 1, rotateY: 0, opacity: 1 }}
          exit={{ scale: 0.7, rotateY: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          style={{ perspective: 1000 }}
          className="w-full max-w-sm relative"
        >
          {/* Tarjeta */}
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Tapa decorativa */}
            <div className="bg-gradient-to-br from-rose-400 to-pink-600 px-6 pt-8 pb-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative text-center">
                <div className="text-4xl mb-2">🌸</div>
                <p className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Tarjeta de Regalo
                </p>
                <p className="text-rose-100 text-xs mt-1">Escribe tu mensaje especial</p>
              </div>
              <button
                onClick={() => {
                  onChange(text);
                  onClose();
                }}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Cuerpo de la tarjeta */}
            <div className="px-6 pt-5 pb-6 bg-[#fffdf8] relative">
              {/* Líneas decorativas de papel */}
              <div className="absolute inset-x-6 top-5 bottom-16 flex flex-col justify-around pointer-events-none">
                {lines.map((_, i) => (
                  <div key={i} className="h-px bg-rose-100" />
                ))}
              </div>
              <div className="absolute left-12 top-5 bottom-16 w-px bg-rose-100 pointer-events-none" />

              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={200}
                rows={5}
                placeholder="Con todo mi amor para ti...&#10;Que estas flores alegren tu día 🌸"
                className="relative w-full bg-transparent resize-none text-sm text-gray-700 leading-7 focus:outline-none pl-8 z-10"
                style={{ fontFamily: "'Playfair Display', serif", lineHeight: '1.75rem' }}
              />

              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-gray-400">{text.length}/200 caracteres</span>
                <span className="text-[10px] text-rose-400 flex items-center gap-1">
                  <Pen className="w-3 h-3" /> La floristería escribirá esto
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 bg-[#fffdf8]">
              <button
                onClick={() => {
                  onChange(text);
                  onClose();
                }}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-rose-200"
              >
                <Check className="w-4 h-4" /> Guardar mensaje
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
