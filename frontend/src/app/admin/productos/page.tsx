'use client';
import { useEffect, useState, useRef } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import api from '@/lib/api';
import { productsApi } from '@/lib/api';
import { formatCurrency, cn } from '@/lib/utils';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Upload, X, Check, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', price: '', category: '', sku: '', stock: '0', isAvailable: true, imageUrl: '', images: '[]', additionals: '[]' };

export default function AdminProductosPage() {
  const { authorized } = useAuthGuard(['admin', 'super_admin']);
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
    if (!authorized) return;
    load();
    productsApi.getCategories().then(r => setCategories(r.data.data || []));
  }, [authorized]);

  const load = () => {
    setLoading(true);
    api.get('/admin/products?limit=50').then(r => setProducts(r.data.data.data || [])).finally(() => setLoading(false));
  };

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p: any) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description || '', price: p.price,
      category: p.category || '', sku: p.sku || '', stock: p.stock,
      isAvailable: p.isAvailable, imageUrl: p.imageUrl || '',
      images: p.images || '[]', additionals: p.additionals || '[]',
    });
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
      const cleanPrice = String(form.price).replace(/[^0-9]/g, '');
      const payload = { ...form, price: Number(cleanPrice), stock: Number(form.stock) };
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
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Gestión de Inventario
          </h1>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
            {products.length} productos registrados
          </p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-sm shadow-pink-100 uppercase tracking-wider">
          <Plus className="w-3.5 h-3.5" /> Nuevo producto
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-8 space-y-4 animate-pulse">
          <div className="h-10 bg-gray-50 rounded-xl w-full" />
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-gray-50 rounded-xl w-full" />)}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm shadow-gray-100/50">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#fcfcfd] border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Detalle de Producto</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-bold uppercase tracking-widest text-[10px] hidden md:table-cell">Categoría</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Precio</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-bold uppercase tracking-widest text-[10px] hidden sm:table-cell">Disponibilidad</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Estado</th>
                  <th className="text-right px-6 py-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Gestión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 group-hover:scale-105 transition-transform">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                              <Tag className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors leading-tight">{p.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">{p.sku || 'SIN SKU'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-[11px] font-semibold border border-gray-100">
                        {p.category || 'Sin Cat.'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{formatCurrency(Number(p.price))}</td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="flex flex-col gap-1">
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-md inline-block w-fit uppercase tracking-tighter",
                          p.stock < 5 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                        )}>
                          {p.stock} unidades
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleToggle(p.id)} className="transition-all hover:scale-110 active:scale-95">
                        {p.isAvailable
                          ? <ToggleRight className="w-6 h-6 text-emerald-500" />
                          : <ToggleLeft className="w-6 h-6 text-gray-300" />}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id, p.name)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

              {/* ── Galería de imágenes ── */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  📸 Galería de imágenes <span className="text-gray-400 font-normal text-xs">(URLs separadas por coma)</span>
                </label>
                <textarea
                  value={(() => { try { return JSON.parse(form.images || '[]').join('\n'); } catch { return ''; } })()}
                  onChange={e => {
                    const urls = e.target.value.split('\n').map((u: string) => u.trim()).filter(Boolean);
                    setForm((f: any) => ({ ...f, images: JSON.stringify(urls) }));
                  }}
                  placeholder="https://url-imagen-1.jpg&#10;https://url-imagen-2.jpg&#10;https://url-imagen-3.jpg"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none font-mono text-xs"
                />
                <p className="text-[10px] text-gray-400 mt-1">Una URL por línea. La imagen principal va arriba.</p>
              </div>

              {/* ── Complementos/Adicionales ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    🎁 Complementos adicionales
                  </label>
                  <button type="button"
                    onClick={() => {
                      const arr = (() => { try { return JSON.parse(form.additionals || '[]'); } catch { return []; } })();
                      arr.push({ name: '', price: 0, imageUrl: '' });
                      setForm((f: any) => ({ ...f, additionals: JSON.stringify(arr) }));
                    }}
                    className="text-xs text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Agregar
                  </button>
                </div>
                {(() => {
                  let arr: any[] = [];
                  try { arr = JSON.parse(form.additionals || '[]'); } catch {}
                  return arr.map((a: any, i: number) => (
                    <div key={i} className="flex gap-2 mb-2 items-start">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <input value={a.name} placeholder="Nombre (ej: Chocolates)"
                          onChange={e => {
                            const next = [...arr]; next[i] = { ...next[i], name: e.target.value };
                            setForm((f: any) => ({ ...f, additionals: JSON.stringify(next) }));
                          }}
                          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-pink-300" />
                        <input type="number" value={a.price} placeholder="Precio"
                          onChange={e => {
                            const next = [...arr]; next[i] = { ...next[i], price: Number(e.target.value) };
                            setForm((f: any) => ({ ...f, additionals: JSON.stringify(next) }));
                          }}
                          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-pink-300" />
                        <input value={a.imageUrl} placeholder="URL imagen (opcional)"
                          onChange={e => {
                            const next = [...arr]; next[i] = { ...next[i], imageUrl: e.target.value };
                            setForm((f: any) => ({ ...f, additionals: JSON.stringify(next) }));
                          }}
                          className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-pink-300" />
                      </div>
                      <button type="button"
                        onClick={() => {
                          const next = arr.filter((_: any, j: number) => j !== i);
                          setForm((f: any) => ({ ...f, additionals: JSON.stringify(next) }));
                        }}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors mt-0.5">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ));
                })()}
                {(() => { try { return JSON.parse(form.additionals || '[]').length === 0; } catch { return true; } })() && (
                  <p className="text-xs text-gray-400 italic">Sin complementos. Haz clic en "Agregar" para añadir chocolates, velas, etc.</p>
                )}
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
