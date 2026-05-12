'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Search, ShoppingCart, Star, X, ZoomIn, ArrowRight, Package, Tag, Check, Plus, Minus } from 'lucide-react';
import { productsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { GiftCardModal } from '@/components/GiftCardModal';

/* ─── Tipos ─────────────────────────────────────────────────── */
interface Additional { name: string; price: number; imageUrl?: string; note?: string; }

/* ─── Zoom de imagen ─────────────────────────────────────────── */
function ZoomImage({ src, alt }: { src: string; alt: string }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [zoomed, setZoomed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full h-full overflow-hidden cursor-zoom-in"
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
      onMouseMove={handleMove}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-100"
        style={zoomed ? {
          transform: 'scale(2.2)',
          transformOrigin: `${pos.x}% ${pos.y}%`,
        } : {}}
      />
      {!zoomed && (
        <div className="absolute bottom-3 right-3 bg-black/40 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 pointer-events-none">
          <ZoomIn className="w-3 h-3" /> Zoom
        </div>
      )}
    </div>
  );
}

/* ─── Modal de detalle ───────────────────────────────────────── */
function ProductModal({ product, onClose }: { product: any; onClose: () => void }) {
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedAdditionals, setSelectedAdditionals] = useState<Set<number>>(new Set());
  const [additionalNotes, setAdditionalNotes] = useState<Record<number, string>>({});
  const [activeGiftCard, setActiveGiftCard] = useState<number | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  // Parsear galería y adicionales
  const gallery: string[] = (() => {
    try {
      const imgs = JSON.parse(product.images || '[]');
      return [product.imageUrl, ...imgs].filter(Boolean);
    } catch { return [product.imageUrl].filter(Boolean); }
  })();

  const additionals: Additional[] = (() => {
    try { return JSON.parse(product.additionals || '[]'); }
    catch { return []; }
  })();

  // Si no hay galería, usar solo la imagen principal
  const images = gallery.length > 0 ? gallery : [product.imageUrl || '/flowers/f-rosas-rojas.jpg'];

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
  }, [onClose]);

  const toggleAdditional = (i: number) => {
    setSelectedAdditionals(prev => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
        if (additionals[i].name.toLowerCase().includes('tarjeta')) {
          setActiveGiftCard(i);
        }
      }
      return next;
    });
  };

  const totalPrice = Number(product.price) * qty +
    Array.from(selectedAdditionals).reduce((sum, i) => sum + (additionals[i]?.price || 0), 0);

  const handleAdd = () => {
    const selectedAddList = Array.from(selectedAdditionals).map(i => ({ ...additionals[i], note: additionalNotes[i] })).filter(Boolean);
    const { addItemWithAdditionals } = useCartStore.getState();
    addItemWithAdditionals(
      { id: product.id, name: product.name, price: Number(product.price), imageUrl: product.imageUrl },
      selectedAddList.map(a => ({ name: a.name, price: a.price, imageUrl: a.imageUrl, note: a.note }))
    );
    toast.success(`${product.name}${selectedAddList.length ? ' + complementos' : ''} agregado al carrito 🌸`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          className="bg-white w-full sm:rounded-3xl max-w-4xl max-h-[95vh] sm:max-h-[88vh] overflow-hidden shadow-2xl flex flex-col lg:flex-row"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ── Columna izquierda: galería ── */}
          <div className="lg:w-[48%] shrink-0 flex flex-col bg-gray-50">
            {/* Imagen principal con zoom */}
            <div className="relative h-64 sm:h-80 lg:h-[420px]">
              <ZoomImage src={images[activeImg]} alt={product.name} />
              {/* Badge */}
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-rose-600 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm z-10">
                {product.category}
              </span>
              {/* Cerrar */}
              <button onClick={onClose}
                className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Miniaturas */}
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i ? 'border-rose-500 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Columna derecha: info ── */}
          <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="p-5 sm:p-7 flex flex-col flex-1">
              {/* Encabezado */}
              <div className="mb-3">
                <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mb-1">{product.category}</p>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight"
                  style={{ fontFamily: "Georgia, serif" }}>
                  {product.name}
                </h2>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  <span className="text-xs text-gray-400 ml-1">5.0 · Producto premium</span>
                </div>
              </div>

              {/* Precio */}
              <div className="mb-3">
                <span className="text-2xl sm:text-3xl font-bold text-rose-600" style={{ fontFamily: "Georgia, serif" }}>
                  {formatCurrency(Number(product.price))}
                </span>
                <span className="text-gray-400 text-sm ml-1.5">COP</span>
              </div>

              <div className="h-px bg-gray-100 mb-3" />

              {/* Descripción */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{product.description}</p>

              {/* ── Complementa tu pedido ── */}
              {additionals.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
                    🎁 Complementa tu pedido floral
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">
                    Agrega un detalle especial para hacer el regalo aún más memorable.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {additionals.map((a, i) => (
                      <button
                        key={i}
                        onClick={() => toggleAdditional(i)}
                        className={`relative rounded-2xl border-2 p-2 text-left transition-all ${
                          selectedAdditionals.has(i)
                            ? 'border-rose-500 bg-rose-50'
                            : 'border-gray-100 hover:border-rose-200 bg-white'
                        }`}
                      >
                        {a.imageUrl && (
                          <img src={a.imageUrl} alt={a.name}
                            className="w-full h-16 object-cover rounded-xl mb-1.5" />
                        )}
                        <p className="text-xs font-semibold text-gray-800 line-clamp-1">{a.name}</p>
                        <p className="text-xs text-rose-600 font-bold">{formatCurrency(a.price)}</p>
                        {selectedAdditionals.has(i) && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock y SKU */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-rose-50 rounded-xl p-2.5 flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wider">Stock</p>
                    <p className="text-xs font-bold text-gray-800">{product.stock} disponibles</p>
                  </div>
                </div>
                <div className="bg-rose-50 rounded-xl p-2.5 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wider">SKU</p>
                    <p className="text-xs font-bold text-gray-800">{product.sku || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Cantidad */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-semibold text-gray-700">Cantidad:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-3 py-2 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 py-2 font-bold text-gray-900 border-x border-gray-200 min-w-[44px] text-center text-sm">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))}
                    className="px-3 py-2 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                {selectedAdditionals.size > 0 && (
                  <span className="text-xs text-gray-400">
                    Total: <span className="font-bold text-rose-600">{formatCurrency(totalPrice)}</span>
                  </span>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-2 mt-auto">
                <button onClick={handleAdd} disabled={product.stock === 0}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:-translate-y-0.5 active:scale-[0.98]">
                  <ShoppingCart className="w-4 h-4" />
                  {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                </button>
                <Link href={`/tienda/${product.id}`}
                  className="px-4 py-3 border-2 border-gray-200 hover:border-rose-300 text-gray-500 hover:text-rose-600 rounded-2xl font-semibold text-sm transition-all flex items-center gap-1.5 whitespace-nowrap">
                  Ver más <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Garantía */}
              <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-100">
                <p className="text-xs text-green-700 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Frescura garantizada · Entrega a domicilio · Cancela cuando quieras
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modal de Tarjeta Animada para el Adicional */}
        {activeGiftCard !== null && (
          <GiftCardModal
            value={additionalNotes[activeGiftCard] || ''}
            onChange={(val) => setAdditionalNotes(prev => ({ ...prev, [activeGiftCard]: val }))}
            onClose={() => setActiveGiftCard(null)}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Página principal ──────────────────────────────────────── */
export default function TiendaPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<any>(null);
  const addItem = useCartStore((s) => s.addItem);
  const LIMIT = 8;

  useEffect(() => {
    productsApi.getCategories().then((r) => setCategories(r.data.data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    productsApi.getAll({ search, category, sortBy, sortOrder, page, limit: LIMIT, isAvailable: true })
      .then((r) => { setProducts(r.data.data.data || []); setTotal(r.data.data.total || 0); })
      .finally(() => setLoading(false));
  }, [search, category, sortBy, sortOrder, page]);

  const handleSortChange = (value: string) => {
    const [field, order] = value.split(':');
    setSortBy(field); setSortOrder(order); setPage(1);
  };

  const handleAdd = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: Number(product.price), imageUrl: product.imageUrl });
    toast.success(`¡${product.name} agregado! 🌸`);
  };

  return (
    <div>
      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}

      {/* Hero */}
      <div className="relative h-52 overflow-hidden">
        <img src="/flowers/slide2.jpg" alt="tienda" loading="eager" decoding="async" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a0f]/80 to-[#1a0a0f]/40 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-rose-300 text-xs font-semibold tracking-widest uppercase mb-2">Catálogo</p>
            <h1 className="font-serif text-4xl font-bold text-white">Nuestra Tienda</h1>
            <p className="text-white/60 mt-1">Flores frescas seleccionadas para ti</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-card border border-rose-50 p-3 mb-6">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input placeholder="Buscar flores..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-cream rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300 border border-transparent focus:border-rose-200 transition-all" />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button onClick={() => { setCategory(''); setPage(1); }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${!category ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-rose-50'}`}>
              Todas
            </button>
            {categories.map((c) => (
              <button key={c} onClick={() => { setCategory(c === category ? '' : c); setPage(1); }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${category === c ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-rose-50'}`}>
                {c}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <select value={`${sortBy}:${sortOrder}`} onChange={(e) => handleSortChange(e.target.value)}
                className="bg-gray-100 border-none rounded-lg px-2 py-1 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-300 transition-all">
                <option value="createdAt:DESC">Más recientes</option>
                <option value="price:ASC">Menor precio</option>
                <option value="price:DESC">Mayor precio</option>
                <option value="name:ASC">A - Z</option>
              </select>
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{total} flores</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden bg-white">
                <div className="h-56 shimmer" />
                <div className="p-4 space-y-2">
                  <div className="h-3 shimmer rounded w-1/3" />
                  <div className="h-4 shimmer rounded w-2/3" />
                  <div className="h-4 shimmer rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🌿</div>
            <h3 className="font-serif text-xl text-gray-700 mb-2">No encontramos flores</h3>
            <p className="text-gray-400 text-sm">Intenta con otro término de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <div key={product.id} onClick={() => setSelected(product)}
                className="group bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-lg border border-rose-50/50 flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-56 overflow-hidden">
                  <img src={product.imageUrl || '/flowers/f-rosas-rojas.jpg'} alt={product.name}
                    loading="lazy" decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-lg">
                      <ZoomIn className="w-5 h-5 text-rose-600" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-md text-rose-700 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-rose-700 transition-colors line-clamp-1 mb-1 text-sm">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-[10px] text-gray-400 font-medium">5.0</span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-1 leading-relaxed">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-600 text-base" style={{ fontFamily: "Georgia, serif" }}>
                      {formatCurrency(Number(product.price))}
                    </span>
                  </div>
                  <button onClick={(e) => handleAdd(product, e)}
                    className="mt-3 w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                    <ShoppingCart className="w-3.5 h-3.5" /> Agregar al Carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {total > LIMIT && (
          <div className="flex justify-center items-center gap-3 mt-12">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-5 py-2.5 rounded-2xl border border-rose-200 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              ← Anterior
            </button>
            <span className="px-5 py-2.5 bg-rose-600 text-white rounded-2xl text-sm font-medium">
              {page} / {Math.ceil(total / LIMIT)}
            </span>
            <button disabled={page >= Math.ceil(total / LIMIT)} onClick={() => setPage(p => p + 1)}
              className="px-5 py-2.5 rounded-2xl border border-rose-200 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
