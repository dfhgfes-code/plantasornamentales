'use client';
import { useEffect, useState } from 'react';
import { Search, ShoppingCart, Star, X, ZoomIn, ArrowRight, Package, Tag, Check } from 'lucide-react';
import { productsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Link from 'next/link';

/* ─── Modal de detalle de producto ─────────────────────────── */
function ProductModal({ product, onClose }: { product: any; onClose: () => void }) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  // Cerrar con Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  // Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, name: product.name, price: Number(product.price), imageUrl: product.imageUrl });
    }
    toast.success(`${qty > 1 ? qty + 'x ' : ''}${product.name} agregado 🌸`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Imagen */}
          <div className="relative md:w-[45%] h-64 md:h-auto shrink-0 bg-rose-50">
            <img
              src={product.imageUrl || '/flowers/f-rosas-rojas.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {/* Badge categoría */}
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-rose-600 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm">
              {product.category}
            </span>
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Contenido */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col">
            {/* Encabezado */}
            <div className="mb-4">
              <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mb-1">{product.category}</p>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-2"
                style={{ fontFamily: "Georgia, serif" }}>
                {product.name}
              </h2>
              {/* Rating */}
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs text-gray-400 ml-1">5.0 · Producto premium</span>
              </div>
            </div>

            {/* Precio */}
            <div className="mb-4">
              <span className="text-3xl font-bold text-rose-600" style={{ fontFamily: "Georgia, serif" }}>
                {formatCurrency(Number(product.price))}
              </span>
              <span className="text-gray-400 text-sm ml-1.5">COP</span>
            </div>

            {/* Línea */}
            <div className="h-px bg-gray-100 mb-4" />

            {/* Descripción */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
              {product.description}
            </p>

            {/* Info stock/sku */}
            <div className="grid grid-cols-2 gap-2 mb-5">
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
                  className="px-3 py-1.5 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors font-bold">−</button>
                <span className="px-4 py-1.5 font-bold text-gray-900 border-x border-gray-200 min-w-[40px] text-center text-sm">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))}
                  className="px-3 py-1.5 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors font-bold">+</button>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                disabled={product.stock === 0}
                className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <ShoppingCart className="w-4 h-4" />
                {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
              </button>
              <Link
                href={`/tienda/${product.id}`}
                className="px-4 py-3 border-2 border-gray-200 hover:border-rose-300 text-gray-500 hover:text-rose-600 rounded-2xl font-semibold text-sm transition-all flex items-center gap-1.5"
              >
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
        </motion.div>
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
  const [selected, setSelected] = useState<any>(null); // producto seleccionado para modal

  const addItem = useCartStore((s) => s.addItem);
  const LIMIT = 8;

  useEffect(() => {
    productsApi.getCategories().then((r) => setCategories(r.data.data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    productsApi.getAll({ search, category, sortBy, sortOrder, page, limit: LIMIT, isAvailable: true })
      .then((r) => {
        setProducts(r.data.data.data || []);
        setTotal(r.data.data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [search, category, sortBy, sortOrder, page]);

  const handleSortChange = (value: string) => {
    const [field, order] = value.split(':');
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  const handleAdd = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: Number(product.price), imageUrl: product.imageUrl });
    toast.success(`¡${product.name} agregado! 🌸`);
  };

  return (
    <div>
      {/* Modal */}
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
            <input
              placeholder="Buscar flores..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-cream rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300 border border-transparent focus:border-rose-200 transition-all"
            />
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
              <div
                key={product.id}
                onClick={() => setSelected(product)}
                className="group bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-lg border border-rose-50/50 flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1"
              >
                {/* Imagen con overlay al hover */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={product.imageUrl || '/flowers/f-rosas-rojas.jpg'}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay con lupa al hover */}
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

                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-rose-700 transition-colors line-clamp-1 mb-1 text-sm">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-[10px] text-gray-400 font-medium">5.0</span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-1 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-600 text-base" style={{ fontFamily: "Georgia, serif" }}>
                      {formatCurrency(Number(product.price))}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleAdd(product, e)}
                    className="mt-3 w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
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
