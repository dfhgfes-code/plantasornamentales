'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', price: '', frequency: 'monthly', deliveryCount: '1', isActive: true, features: '' };

export default function AdminPlanesPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') { router.push('/login'); return; }
    load();
  }, [isAuthenticated]);

  const load = () => {
    setLoading(true);
    api.get('/admin/plans').then(r => setPlans(r.data.data || [])).finally(() => setLoading(false));
  };

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p: any) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || '', price: p.price, frequency: p.frequency, deliveryCount: p.deliveryCount, isActive: p.isActive, features: (p.features || []).join('\n') });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Nombre y precio son requeridos'); return; }
    setSaving(true);
    try {
      const features = form.features.split('\n').map((f: string) => f.trim()).filter(Boolean);
      const payload = { ...form, price: Number(form.price), deliveryCount: Number(form.deliveryCount), features };
      if (editing) {
        await api.patch(`/admin/plans/${editing.id}`, payload);
        toast.success('Plan actualizado');
      } else {
        await api.post('/admin/plans', payload);
        toast.success('Plan creado');
      }
      setModal(false); load();
    } catch (e: any) { toast.error(e.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar plan "${name}"?`)) return;
    try { await api.delete(`/admin/plans/${id}`); toast.success('Plan eliminado'); load(); }
    catch { toast.error('Error al eliminar'); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planes de Suscripción</h1>
          <p className="text-gray-500 text-sm mt-0.5">{plans.length} planes configurados</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Nuevo plan
        </button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 skeleton rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <div key={plan.id} className={`bg-white rounded-2xl border p-5 shadow-sm ${plan.isActive ? 'border-pink-100' : 'border-gray-100 opacity-60'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${plan.frequency === 'weekly' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                      {plan.frequency === 'weekly' ? 'Semanal' : 'Mensual'}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${plan.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {plan.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{plan.description}</p>
                </div>
                <div className="flex gap-1 shrink-0 ml-3">
                  <button onClick={() => openEdit(plan)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(plan.id, plan.name)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-pink-600">{formatCurrency(Number(plan.price))}</span>
                <span className="text-xs text-gray-400">{plan.deliveryCount} entrega(s) / {plan.frequency === 'weekly' ? 'semana' : 'mes'}</span>
              </div>
              {plan.features?.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {plan.features.slice(0, 3).map((f: string) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Check className="w-3 h-3 text-green-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) setModal(false); }}>
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">{editing ? 'Editar plan' : 'Nuevo plan'}</h2>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: 'name', label: 'Nombre *', placeholder: 'Plan Semanal Premium' },
                { key: 'description', label: 'Descripción', placeholder: 'Descripción del plan...' },
                { key: 'price', label: 'Precio (COP) *', placeholder: '95000', type: 'number' },
                { key: 'deliveryCount', label: 'Entregas por período', placeholder: '1', type: 'number' },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  {key === 'description'
                    ? <textarea value={form[key]} onChange={e => setForm((f: any) => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} rows={2}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none" />
                    : <input type={type || 'text'} value={form[key]} onChange={e => setForm((f: any) => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
                  }
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Frecuencia</label>
                <div className="grid grid-cols-2 gap-2">
                  {[['weekly', '📅 Semanal'], ['monthly', '🗓️ Mensual']].map(([val, label]) => (
                    <button key={val} onClick={() => setForm((f: any) => ({ ...f, frequency: val }))}
                      className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${form.frequency === val ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Características (una por línea)</label>
                <textarea value={form.features} onChange={e => setForm((f: any) => ({ ...f, features: e.target.value }))}
                  placeholder={'Flores frescas\nEntrega a domicilio\nCancela cuando quieras'} rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none" />
              </div>

              <button onClick={() => setForm((f: any) => ({ ...f, isActive: !f.isActive }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.isActive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
                {form.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                {form.isActive ? 'Plan activo' : 'Plan inactivo'}
              </button>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium text-sm hover:bg-gray-50">Cancelar</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-50">
                {saving ? 'Guardando...' : editing ? 'Guardar' : 'Crear plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
