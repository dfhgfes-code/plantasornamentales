'use client';
import { useEffect, useState } from 'react';
import { Search, ShoppingCart, Star, SlidersHorizontal, X } from 'lucide-react';
import { productsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function TiendaPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const LIMIT = 8;

  useEffect(() => {
    productsApi.getCategories().then((r) => setCategories(r.data.data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    productsApi.getAll({ search, category, sortBy, page, limit: LIMIT, isAvailable: true })
      .then((r) => { setProducts(r.data.data.data || []); setTotal(r.data.data.total || 0); })
      .finally(() => setLoading(false));
  }, [search, category, sortBy, page]);

  const handleAdd = (product: any) => {
    addItem({ id: product.id, name: product.name, price: Number(product.price), imageUrl: product.imageUrl });
    toast.success(`¡${product.name} agregado! 🌸`);
  };

  return (
    <div>
      {/* Hero tienda */}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filtros */}
        <div className="bg-white rounded-3xl shadow-card border border-rose-50 p-5 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Búsqueda */}
            <div className="flex-1 min-w-[220px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                placeholder="Buscar flores..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-11 pr-4 py-3 bg-cream rounded-2xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300 border border-transparent focus:border-rose-200 transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Categorías */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setCategory(''); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!category ? 'bg-rose-700 text-white shadow-rose' : 'bg-cream text-gray-600 hover:bg-rose-50'}`}>
                Todas
              </button>
              {categories.map((c) => (
                <button key={c}
                  onClick={() => { setCategory(c === category ? '' : c); setPage(1); }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${category === c ? 'bg-rose-700 text-white shadow-rose' : 'bg-cream text-gray-600 hover:bg-rose-50'}`}>
                  {c}
                </button>
              ))}
            </div>

            {/* Ordenar */}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="bg-cream border border-transparent focus:border-rose-200 rounded-2xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300 transition-all">
              <option value="createdAt">Más recientes</option>
              <option value="price">Menor precio</option>
              <option value="name">A - Z</option>
            </select>

            <span className="text-sm text-gray-400 font-medium">{total} flores</span>
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
              <div key={product.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-card card-hover border border-rose-50/50">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={product.imageUrl || '/flowers/f-rosas-rojas.jpg'}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <button onClick={() => handleAdd(product)}
                      className="w-full btn-primary py-2.5 text-sm flex items-center justify-center gap-2">
                      <ShoppingCart className="w-4 h-4" /> Agregar
                    </button>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="category-tag">{product.category}</span>
                  </div>
                </div>
                <div className="p-4">
                  <Link href={`/tienda/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-rose-700 transition-colors line-clamp-1 mb-1">{product.name}</h3>
                  </Link>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-700 font-serif">{formatCurrency(Number(product.price))}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-gold text-gold" />
                      <span className="text-xs text-gray-400">4.9</span>
                    </div>
                  </div>
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
            <span className="px-5 py-2.5 bg-rose-700 text-white rounded-2xl text-sm font-medium">
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
