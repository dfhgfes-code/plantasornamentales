'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft, Star, Package, Tag, Pencil, X, Check, Upload } from 'lucide-react';
import { productsApi, adminApi } from '@/lib/api';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';
import { useRef } from 'react';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  // Admin edit state
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
        setProduct(r.data.data);
        setForm({
          name: r.data.data.name,
          description: r.data.data.description || '',
          price: r.data.data.price,
          category: r.data.data.category || '',
          sku: r.data.data.sku || '',
          stock: r.data.data.stock,
          isAvailable: r.data.data.isAvailable,
          imageUrl: r.data.data.imageUrl || '',
        });
      })
      .catch(() => router.push('/tienda'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, name: product.name, price: Number(product.price), imageUrl: product.imageUrl });
    }
    toast.success(`${qty > 1 ? qty + 'x ' : ''}${product.name} agregado al carrito 🌸`);
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
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
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
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* ── Imagen ── */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden bg-white shadow-md aspect-square">
              <img
                src={product.imageUrl || '/flowers/f-rosas-rojas.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Badge categoría */}
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur-md text-rose-600 text-xs font-bold px-4 py-2 rounded-full shadow-sm border border-rose-100">
                {product.category}
              </span>
            </div>
            {/* Botón editar admin */}
            {isAdmin && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="absolute top-4 right-4 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Pencil className="w-3.5 h-3.5" /> Editar producto
              </button>
            )}
          </div>

          {/* ── Info / Formulario ── */}
          <div>
            {!editing ? (
              /* ── Vista normal ── */
              <div>
                <p className="text-rose-500 text-xs font-bold uppercase tracking-widest mb-2">{product.category}</p>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight"
                  style={{ fontFamily: "Georgia, serif" }}>
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">5.0 · Producto premium</span>
                </div>

                {/* Precio */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-rose-600" style={{ fontFamily: "Georgia, serif" }}>
                    {formatCurrency(Number(product.price))}
                  </span>
                  <span className="text-gray-400 text-sm ml-2">COP</span>
                </div>

                {/* Línea divisora */}
                <div className="h-px bg-gray-100 mb-6" />

                {/* Descripción */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm uppercase tracking-wider">Descripción</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
                </div>

                {/* Info adicional */}
                <div className="grid grid-cols-2 gap-3 mb-6">
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

                {/* Botones acción */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={handleAdd} disabled={product.stock === 0}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-rose-200 hover:-translate-y-0.5 active:scale-[0.98]">
                    <ShoppingCart className="w-5 h-5" />
                    {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                  </button>
                  <Link href="/tienda"
                    className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-200 hover:border-rose-300 text-gray-600 hover:text-rose-600 rounded-2xl font-semibold text-sm transition-all">
                    <ArrowLeft className="w-4 h-4" /> Volver
                  </Link>
                </div>

                {/* Garantía */}
                <div className="mt-6 p-4 bg-green-50 rounded-2xl border border-green-100">
                  <p className="text-xs text-green-700 font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Frescura garantizada · Entrega a domicilio · Cancela cuando quieras
                  </p>
                </div>
              </div>
            ) : (
              /* ── Formulario edición admin ── */
              <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <Pencil className="w-5 h-5 text-rose-500" /> Editar producto
                  </h2>
                  <button onClick={() => setEditing(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Imagen */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Imagen</label>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-rose-50 border-2 border-dashed border-rose-200 shrink-0 flex items-center justify-center">
                        {form.imageUrl
                          ? <img src={form.imageUrl} alt="" className="w-full h-full object-cover" />
                          : <Upload className="w-6 h-6 text-rose-300" />}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                        <button onClick={() => fileRef.current?.click()} disabled={uploading}
                          className="w-full border-2 border-dashed border-rose-200 hover:border-rose-400 text-rose-500 py-2 rounded-xl text-xs font-medium transition-all disabled:opacity-50">
                          {uploading ? 'Subiendo...' : '📁 Subir imagen'}
                        </button>
                        <input value={form.imageUrl} onChange={e => setForm((f: any) => ({ ...f, imageUrl: e.target.value }))}
                          className="w-full text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-300"
                          placeholder="O pega una URL de imagen" />
                      </div>
                    </div>
                  </div>

                  {/* Nombre */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nombre *</label>
                    <input value={form.name} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Descripción</label>
                    <textarea value={form.description} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))}
                      rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none" />
                  </div>

                  {/* Precio y Stock */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Precio (COP) *</label>
                      <input type="number" value={form.price} onChange={e => setForm((f: any) => ({ ...f, price: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Stock</label>
                      <input type="number" value={form.stock} onChange={e => setForm((f: any) => ({ ...f, stock: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                    </div>
                  </div>

                  {/* Categoría y SKU */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Categoría</label>
                      <input value={form.category} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">SKU</label>
                      <input value={form.sku} onChange={e => setForm((f: any) => ({ ...f, sku: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                    </div>
                  </div>

                  {/* Disponible */}
                  <button onClick={() => setForm((f: any) => ({ ...f, isAvailable: !f.isAvailable }))}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${form.isAvailable ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                    {form.isAvailable ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    {form.isAvailable ? 'Disponible en tienda' : 'No disponible'}
                  </button>
                </div>

                {/* Botones */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
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
    </div>
  );
}
