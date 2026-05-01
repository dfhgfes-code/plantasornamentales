'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { productsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Upload, X, Check, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', price: '', category: '', sku: '', stock: '0', isAvailable: true, imageUrl: '' };

export default function AdminProductosPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') { router.push('/login'); return; }
    load();
    // Cargar categorías existentes para sugerencias
    productsApi.getCategories().then(r => setCategories(r.data.data || []));
  }, [isAuthenticated]);

  const load = () => {
    setLoading(true);
    api.get('/admin/products?limit=50').then(r => setProducts(r.data.data.data || [])).finally(() => setLoading(false));
  };

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p: any) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || '', price: p.price, category: p.category || '', sku: p.sku || '', stock: p.stock, isAvailable: p.isAvailable, imageUrl: p.imageUrl || '' });
    setModal(true);
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
      toast.success('Imagen subida correctamente');
    } catch { toast.error('Error al subir imagen'); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Nombre y precio son requeridos'); return; }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editing) {
        await api.patch(`/admin/products/${editing.id}`, payload);
        toast.success('Producto actualizado');
      } else {
        await api.post('/admin/products', payload);
        toast.success('Producto creado');
      }
      setModal(false);
      load();
    } catch (e: any) { toast.error(e.response?.data?.message || 'Error al guardar'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    try { await api.delete(`/admin/products/${id}`); toast.success('Eliminado'); load(); }
    catch { toast.error('Error al eliminar'); }
  };

  const handleToggle = async (id: string) => {
    try { await api.patch(`/admin/products/${id}/toggle`); load(); }
    catch { toast.error('Error'); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-500 text-sm mt-0.5">{products.length} productos en total</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Nuevo producto
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl" />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Producto</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold hidden md:table-cell">Categoría</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Precio</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold hidden sm:table-cell">Stock</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Estado</th>
                <th className="text-right px-4 py-3 text-gray-600 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-pink-50 shrink-0">
                        {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{p.category || '—'}</td>
                  <td className="px-4 py-3 font-semibold text-pink-600">{formatCurrency(Number(p.price))}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.stock < 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                      {p.stock} uds
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(p.id)} className="flex items-center gap-1.5 text-xs font-medium">
                      {p.isAvailable
                        ? <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-green-600 hidden sm:block">Activo</span></>
                        : <><ToggleLeft className="w-5 h-5 text-gray-400" /><span className="text-gray-400 hidden sm:block">Inactivo</span></>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal crear/editar */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) setModal(false); }}>
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">{editing ? 'Editar producto' : 'Nuevo producto'}</h2>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Imagen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del producto</label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-pink-50 border-2 border-dashed border-pink-200 flex items-center justify-center shrink-0">
                    {form.imageUrl
                      ? <img src={form.imageUrl} alt="" className="w-full h-full object-cover" />
                      : <Upload className="w-6 h-6 text-pink-300" />}
                  </div>
                  <div className="flex-1">
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                    <button onClick={() => fileRef.current?.click()} disabled={uploading}
                      className="w-full border-2 border-dashed border-pink-200 hover:border-pink-400 text-pink-500 hover:text-pink-600 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
                      {uploading ? 'Subiendo...' : '📁 Seleccionar imagen'}
                    </button>
                    {form.imageUrl && (
                      <input value={form.imageUrl} onChange={e => setForm((f: any) => ({ ...f, imageUrl: e.target.value }))}
                        className="mt-2 w-full text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-500" placeholder="O pega una URL" />
                    )}
                  </div>
                </div>
              </div>

              {/* Campos */}
              {[
                { key: 'name', label: 'Nombre *', placeholder: 'Ej: Claveles Rojos Premium' },
                { key: 'description', label: 'Descripción', placeholder: 'Descripción del producto...' },
                { key: 'price', label: 'Precio (COP) *', placeholder: '85000', type: 'number' },
                { key: 'sku', label: 'SKU (código único)', placeholder: 'Ej: CLA-002' },
                { key: 'stock', label: 'Stock disponible', placeholder: '0', type: 'number' },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  {key === 'description'
                    ? <textarea value={form[key]} onChange={e => setForm((f: any) => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder} rows={3}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none" />
                    : <input type={type || 'text'} value={form[key]} onChange={e => setForm((f: any) => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
                  }
                </div>
              ))}

              {/* Campo categoría con chips clicables */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Categoría <span className="text-gray-400 font-normal text-xs">(agrupa productos en la tienda)</span>
                </label>
                <input
                  list="categories-list"
                  value={form.category}
                  onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))}
                  placeholder="Ej: Claveles, Rosas, Girasoles..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <datalist id="categories-list">
                  {categories.map(c => <option key={c} value={c} />)}
                </datalist>
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-xs text-gray-400 mr-1">Categorías:</span>
                    {categories.map(c => (
                      <button key={c} type="button"
                        onClick={() => setForm((f: any) => ({ ...f, category: c }))}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                          form.category === c
                            ? 'bg-pink-500 text-white border-pink-500'
                            : 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100'
                        }`}>
                        {c}
                      </button>
                    ))}
                    <button type="button"
                      onClick={() => setForm((f: any) => ({ ...f, category: '' }))}
                      className="text-xs px-2.5 py-1 rounded-full border border-dashed border-gray-300 text-gray-400 hover:border-pink-300 hover:text-pink-500 transition-all">
                      + Nueva
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => setForm((f: any) => ({ ...f, isAvailable: !f.isAvailable }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.isAvailable ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
                  {form.isAvailable ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  {form.isAvailable ? 'Disponible' : 'No disponible'}
                </button>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium text-sm hover:bg-gray-50 transition-all">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50">
                {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear producto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
