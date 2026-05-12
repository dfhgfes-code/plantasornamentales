import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, PenTool, Sparkles, Mail } from 'lucide-react';

export function GiftCardModal({
  value,
  onChange,
  onClose,
}: {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
}) {
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [message, setMessage] = useState('');
  
  // Nuevo estado para la animación
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    let parsedTo = '';
    let parsedFrom = '';
    let parsedMessage = value || '';

    if (value && value.startsWith('Para: ')) {
      const parts = value.split('\n\n');
      const header = parts[0] || '';
      const headerLines = header.split('\n');
      
      if (headerLines[0]?.startsWith('Para: ')) {
        parsedTo = headerLines[0].substring(6);
      }
      if (headerLines[1]?.startsWith('De: ')) {
        parsedFrom = headerLines[1].substring(4);
      }
      parsedMessage = parts.slice(1).join('\n\n');
    } else {
      parsedMessage = value || '';
    }
    
    setTo(parsedTo);
    setFrom(parsedFrom);
    setMessage(parsedMessage);
  }, [value]);

  const handleSave = () => {
    let finalNote = message;
    if (to.trim() || from.trim()) {
      finalNote = `Para: ${to.trim()}\nDe: ${from.trim()}\n\n${message}`;
    }
    onChange(finalNote);
    onClose();
  };

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
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-0 bg-black/50 backdrop-blur-sm"
      >
        <div className="relative w-full max-w-md h-[600px] flex items-center justify-center">

          {/* LAYER 1: Envelope Back */}
          <motion.div
            className="absolute w-80 h-56 bg-[#D7CCC8] rounded-xl shadow-xl border border-[#BCAAA4]"
            initial={{ y: '100vh', opacity: 0 }}
            animate={
              opened 
                ? { y: 300, opacity: 0, scale: 0.8 } 
                : { y: 20, opacity: 1, scale: 1 }
            }
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          />

          {/* LAYER 2: The Card */}
          <motion.div
            className="absolute w-full max-w-md"
            initial={{ y: '100vh', scale: 0.6 }}
            animate={
              opened 
                ? { y: 0, scale: 1, zIndex: 50, rotateX: 0 } 
                : { y: 0, scale: 0.65, zIndex: 20, rotateX: 10 }
            }
            transition={{ type: 'spring', damping: 20, stiffness: 100, delay: opened ? 0.2 : 0 }}
            style={{ transformOrigin: 'bottom center', perspective: 1000 }}
          >
            {/* Sombra de la tarjeta */}
            <div className={`absolute inset-0 bg-black/20 blur-xl translate-y-8 rounded-[2rem] -z-10 transition-opacity duration-500 ${opened ? 'opacity-100' : 'opacity-0'}`} />

            <div className="relative bg-[#FCFBF8] rounded-2xl shadow-2xl overflow-hidden border border-[#EADDD5]">
              
              <div className="relative px-6 pt-6 pb-4 bg-[#FAF6F0] border-b border-[#EADDD5] flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-700 to-rose-900 border-2 border-rose-950/20 shadow-inner flex items-center justify-center mb-2 shadow-[0_4px_10px_rgba(159,18,57,0.3)]">
                  <Sparkles className="w-5 h-5 text-rose-100/90" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-[#4A3C31] font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Mensaje Especial
                </h3>
                
                {opened && (
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all text-[#8C7A6B] hover:text-rose-700 shadow-sm border border-[#EADDD5]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div 
                className="px-8 pt-6 pb-6 relative"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`
                }}
              >
                <div className="flex flex-col gap-2 mb-4 relative z-10">
                  <div className="flex items-end gap-2 border-b border-[#EADDD5] pb-1">
                    <span className="text-[10px] font-bold text-[#8C7A6B] uppercase tracking-widest mb-1.5">Para:</span>
                    <input
                      type="text"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder="Escriba aquí..."
                      disabled={!opened}
                      className="bg-transparent border-none focus:outline-none text-2xl text-[#2C241B] w-full placeholder:text-[#D7CCC8]"
                      style={{ fontFamily: "'Dancing Script', cursive" }}
                    />
                  </div>
                  <div className="flex items-end gap-2 border-b border-[#EADDD5] pb-1">
                    <span className="text-[10px] font-bold text-[#8C7A6B] uppercase tracking-widest mb-1.5">De:</span>
                    <input
                      type="text"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      placeholder="Escriba aquí..."
                      disabled={!opened}
                      className="bg-transparent border-none focus:outline-none text-2xl text-[#2C241B] w-full placeholder:text-[#D7CCC8]"
                      style={{ fontFamily: "'Dancing Script', cursive" }}
                    />
                  </div>
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={!opened}
                  maxLength={250}
                  rows={4}
                  placeholder="Con todo mi amor..."
                  className="relative w-full bg-transparent resize-none text-2xl text-[#2C241B] focus:outline-none z-10 placeholder:text-[#BCAAA4]"
                  style={{ 
                    fontFamily: "'Dancing Script', cursive", 
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, #EADDD5 39px, #EADDD5 40px)',
                    lineHeight: '40px',
                    backgroundAttachment: 'local'
                  }}
                />

                <div className="flex items-center justify-between mt-4 relative z-10">
                  <span className="text-[10px] text-[#8C7A6B] font-semibold uppercase tracking-wider">
                    {message.length}/250
                  </span>
                  <span className="text-[10px] text-rose-700 flex items-center gap-1.5 font-bold bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">
                    <PenTool className="w-3 h-3" /> Transcrito a mano
                  </span>
                </div>
              </div>

              {opened && (
                <div className="px-6 py-4 bg-white border-t border-[#EADDD5] flex justify-end gap-3">
                  <button
                    onClick={handleSave}
                    className="bg-[#4A3C31] hover:bg-[#2C241B] text-[#FCFBF8] font-bold px-6 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5"
                  >
                    <Check className="w-4 h-4" /> Guardar tarjeta
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* LAYER 3: Envelope Front & Flap */}
          <motion.div
            className="absolute w-80 h-56 z-30"
            initial={{ y: '100vh', opacity: 0 }}
            animate={
              opened 
                ? { y: 300, opacity: 0, scale: 0.8 } 
                : { y: 20, opacity: 1, scale: 1 }
            }
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            onClick={() => !opened && setOpened(true)}
            style={{ cursor: opened ? 'default' : 'pointer', pointerEvents: opened ? 'none' : 'auto' }}
          >
            {/* Tapa del sobre frontal (SVG para hacer la forma de triángulo invertido) */}
            <svg viewBox="0 0 320 224" className="absolute inset-0 w-full h-full drop-shadow-2xl">
              <path d="M0,0 L160,120 L320,0 L320,224 L0,224 Z" fill="#FCFBF8" />
              <path d="M0,0 L160,120 L320,0" fill="none" stroke="#EADDD5" strokeWidth="2" />
            </svg>

            {/* Sello animado */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-700 to-rose-900 shadow-xl flex items-center justify-center border-4 border-[#FCFBF8] mb-2"
              >
                <Mail className="w-7 h-7 text-rose-100" />
              </motion.div>
              <div className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-bold text-[#8C7A6B] tracking-widest shadow-sm">
                TOCAR PARA ABRIR
              </div>
            </div>
          </motion.div>

          {/* Botón Cerrar (X) externo si no han abierto el sobre aún */}
          {!opened && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all text-white backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
