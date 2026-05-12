'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft, Star, Package, Tag, Pencil, X, Check, Upload, ChevronLeft, ChevronRight, ZoomIn, Plus, Minus } from 'lucide-react';
import { productsApi } from '@/lib/api';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';
import { ProductReviews } from '@/components/ui/ProductReviews';
import { GiftCardModal } from '@/components/GiftCardModal';

/* ─── Componente de imagen con zoom ─────────────────────────── */
function ZoomImage({ src, alt }: { src: string; alt: string }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [zoomed, setZoomed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full h-full overflow-hidden cursor-zoom-in select-none"
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
      onMouseMove={handleMove}
    >
      <img
        src={src} alt={alt}
        className="w-full h-full object-cover transition-transform duration-75"
        style={zoomed ? { transform: 'scale(2.5)', transformOrigin: `${pos.x}% ${pos.y}%` } : {}}
        draggable={false}
      />
      {!zoomed && (
        <div className="absolute bottom-4 right-4 bg-black/40 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none">
          <ZoomIn className="w-3.5 h-3.5" /> Pasa el mouse para hacer zoom
        </div>
      )}
    </div>
  );
}

/* ─── Página de detalle ──────────────────────────────────────── */
export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedAdditionals, setSelectedAdditionals] = useState<Set<number>>(new Set());
  const [additionalNotes, setAdditionalNotes] = useState<Record<number, string>>({});
  const [activeGiftCard, setActiveGiftCard] = useState<number | null>(null);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    productsApi.getOne(id)
      .then(r => {
        const p = r.data.data;
        setProduct(p);
        setForm({
          name: p.name, description: p.description || '',
          price: p.price, category: p.category || '',
          sku: p.sku || '', stock: p.stock,
          isAvailable: p.isAvailable, imageUrl: p.imageUrl || '',
          images: p.images || '[]',
        });
      })
      .catch(() => router.push('/tienda'))
      .finally(() => setLoading(false));
  }, [id]);

  // Construir galería completa
  const gallery: string[] = (() => {
    if (!product) return [];
    try {
      const extra = JSON.parse(product.images || '[]');
      return [product.imageUrl, ...extra].filter(Boolean);
    } catch { return [product.imageUrl].filter(Boolean); }
  })();

  const images = gallery.length > 0 ? gallery : ['/flowers/f-rosas-rojas.jpg'];

  // Adicionales
  const additionals: { name: string; price: number; imageUrl?: string; description?: string }[] = (() => {
    try { return JSON.parse(product?.additionals || '[]'); }
    catch { return []; }
  })();

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

  const additionalsTotal = Array.from(selectedAdditionals).reduce((sum, i) => sum + (additionals[i]?.price || 0), 0);
  const totalPrice = Number(product?.price || 0) * qty + additionalsTotal;

  const prevImg = () => setActiveImg(i => (i - 1 + images.length) % images.length);
  const nextImg = () => setActiveImg(i => (i + 1) % images.length);

  const handleAdd = () => {
    if (!product) return;
    const selectedAddList = Array.from(selectedAdditionals).map(i => ({ ...additionals[i], note: additionalNotes[i] })).filter(Boolean);
    const { addItemWithAdditionals } = useCartStore.getState();
    for (let i = 0; i < qty; i++) {
      addItemWithAdditionals(
        { id: product.id, name: product.name, price: Number(product.price), imageUrl: product.imageUrl },
        selectedAddList.map(a => ({ name: a.name, price: a.price, imageUrl: a.imageUrl, note: a.note }))
      );
    }
    const addNames = selectedAddList.map(a => a.name);
    toast.success(`${product.name}${addNames.length ? ' + ' + addNames.join(', ') : ''} agregado 🌸`);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/admin/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm((f: any) => ({ ...f, imageUrl: res.data.data.url }));
      toast.success('Imagen subida');
    } catch { toast.error('Error al subir imagen'); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.patch(`/admin/products/${id}`, {
        ...form, price: Number(form.price), stock: Number(form.stock),
      });
      setProduct(res.data.data);
      setEditing(false);
      toast.success('Producto actualizado ✅');
    } catch { toast.error('Error al guardar'); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
    </div>
  );
  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-rose-600 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/tienda" className="hover:text-rose-600 transition-colors">Tienda</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium line-clamp-1">{product.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* ── Galería ── */}
          <div className="space-y-3">
            {/* Imagen principal con zoom */}
            <div className="relative rounded-3xl overflow-hidden bg-white shadow-md aspect-square">
              <ZoomImage src={images[activeImg]} alt={product.name} />

              {/* Badge */}
              <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md text-rose-600 text-xs font-bold px-4 py-2 rounded-full shadow-sm border border-rose-100">
                {product.category}
              </span>

              {/* Botón editar admin */}
              {isAdmin && !editing && (
                <button onClick={() => setEditing(true)}
                  className="absolute top-4 right-4 z-10 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all">
                  <Pencil className="w-3 h-3" /> Editar
                </button>
              )}

              {/* Flechas navegación (solo si hay más de 1 imagen) */}
              {images.length > 1 && (
                <>
                  <button onClick={prevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all">
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button onClick={nextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all">
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                  {/* Contador */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/40 text-white text-xs px-3 py-1 rounded-full">
                    {activeImg + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Miniaturas */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImg === i
                        ? 'border-rose-500 shadow-md scale-105'
                        : 'border-transparent opacity-60 hover:opacity-90 hover:border-rose-200'
                    }`}
                  >
                    <img src={img} alt={`Vista ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info / Formulario ── */}
          <div>
            {!editing ? (
              <div>
                <p className="text-rose-500 text-xs font-bold uppercase tracking-widest mb-2">{product.category}</p>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight"
                  style={{ fontFamily: "Georgia, serif" }}>
                  {product.name}
                </h1>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <span className="text-sm text-gray-400">5.0 · Producto premium</span>
                </div>

                <div className="mb-5">
                  <span className="text-4xl font-bold text-rose-600" style={{ fontFamily: "Georgia, serif" }}>
                    {formatCurrency(Number(product.price))}
                  </span>
                  <span className="text-gray-400 text-sm ml-2">COP</span>
                </div>

                <div className="h-px bg-gray-100 mb-5" />

                <div className="mb-5">
                  <h3 className="font-semibold text-gray-800 mb-2 text-xs uppercase tracking-wider">Descripción</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-rose-50 rounded-2xl p-3 flex items-center gap-2">
                    <Package className="w-4 h-4 text-rose-500 shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Stock</p>
                      <p className="text-sm font-bold text-gray-800">{product.stock} disponibles</p>
                    </div>
                  </div>
                  <div className="bg-rose-50 rounded-2xl p-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-rose-500 shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">SKU</p>
                      <p className="text-sm font-bold text-gray-800">{product.sku || '—'}</p>
                    </div>
                  </div>
                </div>

                {/* ── Complementa tu pedido ── */}
                {additionals.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">🎁</span>
                      <h3 className="font-bold text-gray-800 text-sm">Complementa tu pedido floral</h3>
                    </div>
                    <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                      Agrega un detalle especial para hacer el regalo aún más memorable. El precio se actualizará automáticamente.
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {additionals.map((a, i) => (
                        <button
                          key={i}
                          onClick={() => toggleAdditional(i)}
                          className={`relative rounded-2xl border-2 p-3 text-left transition-all hover:-translate-y-0.5 ${
                            selectedAdditionals.has(i)
                              ? 'border-rose-500 bg-rose-50 shadow-md'
                              : 'border-gray-100 hover:border-rose-200 bg-white shadow-sm'
                          }`}
                        >
                          {a.imageUrl && (
                            <img src={a.imageUrl} alt={a.name}
                              className="w-full h-20 object-cover rounded-xl mb-2"
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          )}
                          <p className="text-xs font-bold text-gray-800 line-clamp-1">{a.name}</p>
                          {a.description && (
                            <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{a.description}</p>
                          )}
                          <p className="text-xs font-bold text-rose-600 mt-1">+{formatCurrency(a.price)}</p>
                          {/* Check de selección */}
                          <div className={`absolute top-2.5 right-2.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedAdditionals.has(i)
                              ? 'bg-rose-500 border-rose-500'
                              : 'border-gray-200 bg-white'
                          }`}>
                            {selectedAdditionals.has(i) && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                    {selectedAdditionals.size > 0 && (
                      <div className="mt-3 p-3 bg-rose-50 rounded-xl border border-rose-100 flex items-center justify-between">
                        <span className="text-xs text-gray-600 font-medium">
                          {selectedAdditionals.size} adicional{selectedAdditionals.size > 1 ? 'es' : ''} seleccionado{selectedAdditionals.size > 1 ? 's' : ''}
                        </span>
                        <span className="text-sm font-bold text-rose-600">
                          Total: {formatCurrency(totalPrice)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Cantidad */}
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-sm font-semibold text-gray-700">Cantidad:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="px-4 py-2 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors font-bold text-lg">−</button>
                    <span className="px-5 py-2 font-bold text-gray-900 border-x border-gray-200 min-w-[48px] text-center">{qty}</span>
                    <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                      className="px-4 py-2 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors font-bold text-lg">+</button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={handleAdd} disabled={product.stock === 0}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:-translate-y-0.5 active:scale-[0.98]">
                    <ShoppingCart className="w-5 h-5" />
                    {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                  </button>
                  <Link href="/tienda"
                    className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-200 hover:border-rose-300 text-gray-600 hover:text-rose-600 rounded-2xl font-semibold text-sm transition-all">
                    <ArrowLeft className="w-4 h-4" /> Volver
                  </Link>
                </div>

                <div className="mt-5 p-4 bg-green-50 rounded-2xl border border-green-100">
                  <p className="text-xs text-green-700 font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Frescura garantizada · Entrega a domicilio · Cancela cuando quieras
                  </p>
                </div>
              </div>
            ) : (
              /* ── Formulario edición admin ── */
              <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <Pencil className="w-5 h-5 text-rose-500" /> Editar producto
                  </h2>
                  <button onClick={() => setEditing(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Imagen principal */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Imagen principal</label>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-rose-50 border-2 border-dashed border-rose-200 shrink-0 flex items-center justify-center">
                        {form.imageUrl ? <img src={form.imageUrl} alt="" className="w-full h-full object-cover" /> : <Upload className="w-6 h-6 text-rose-300" />}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                        <button onClick={() => fileRef.current?.click()} disabled={uploading}
                          className="w-full border-2 border-dashed border-rose-200 hover:border-rose-400 text-rose-500 py-2 rounded-xl text-xs font-medium transition-all disabled:opacity-50">
                          {uploading ? 'Subiendo...' : '📁 Subir imagen'}
                        </button>
                        <input value={form.imageUrl} onChange={e => setForm((f: any) => ({ ...f, imageUrl: e.target.value }))}
                          className="w-full text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-300"
                          placeholder="O pega una URL" />
                      </div>
                    </div>
                  </div>

                  {/* Galería adicional */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      📸 Galería (una URL por línea)
                    </label>
                    <textarea
                      value={(() => { try { return JSON.parse(form.images || '[]').join('\n'); } catch { return ''; } })()}
                      onChange={e => {
                        const urls = e.target.value.split('\n').map((u: string) => u.trim()).filter(Boolean);
                        setForm((f: any) => ({ ...f, images: JSON.stringify(urls) }));
                      }}
                      placeholder="https://url-foto-2.jpg&#10;https://url-foto-3.jpg&#10;https://url-foto-4.jpg"
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Estas fotos aparecen como miniaturas debajo de la imagen principal.</p>
                  </div>

                  {[
                    { key: 'name', label: 'Nombre *' },
                    { key: 'description', label: 'Descripción', textarea: true },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                      {f.textarea
                        ? <textarea value={form[f.key]} onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))}
                            rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none" />
                        : <input value={form[f.key]} onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                      }
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-3">
                    {[{key:'price',label:'Precio (COP)'},{key:'stock',label:'Stock'}].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                        <input type="number" value={form[f.key]} onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                      </div>
                    ))}
                  </div>

                  <button onClick={() => setForm((f: any) => ({ ...f, isAvailable: !f.isAvailable }))}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${form.isAvailable ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                    {form.isAvailable ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    {form.isAvailable ? 'Disponible en tienda' : 'No disponible'}
                  </button>
                </div>

                <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
                  <button onClick={() => setEditing(false)}
                    className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium text-sm hover:bg-gray-50 transition-all">
                    Cancelar
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50">
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sección de reseñas */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ProductReviews productId={id} />
      </div>

      {/* Modal de Tarjeta Animada para el Adicional */}
      {activeGiftCard !== null && (
        <GiftCardModal
          value={additionalNotes[activeGiftCard] || ''}
          onChange={(val) => setAdditionalNotes(prev => ({ ...prev, [activeGiftCard]: val }))}
          onClose={() => setActiveGiftCard(null)}
        />
      )}
    </div>
  );
}
