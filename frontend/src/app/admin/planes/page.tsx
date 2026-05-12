'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { formatCurrency, cn } from '@/lib/utils';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', price: '', intervalDays: '30', deliveryCount: '1', isActive: true, features: '' };

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
    if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'super_admin')) {
      router.push('/login'); return;
    }
    load();
  }, [isAuthenticated]);

  const load = () => {
    setLoading(true);
    api.get('/admin/plans').then(r => setPlans(r.data.data || [])).finally(() => setLoading(false));
  };

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p: any) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || '', price: p.price, intervalDays: p.intervalDays?.toString() || '30', deliveryCount: p.deliveryCount, isActive: p.isActive, features: (p.features || []).join('\n') });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Nombre y precio son requeridos'); return; }
    setSaving(true);
    try {
      const features = form.features.split('\n').map((f: string) => f.trim()).filter(Boolean);
      const payload = { ...form, price: Number(form.price), intervalDays: Number(form.intervalDays), deliveryCount: Number(form.deliveryCount), features };
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
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Planes de Suscripción
          </h1>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
            {plans.length} planes configurados en la plataforma
          </p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-sm shadow-pink-100 uppercase tracking-wider">
          <Plus className="w-3.5 h-3.5" /> Nuevo plan
        </button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 bg-white border border-gray-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className={cn(
              "bg-white rounded-2xl border transition-all duration-300 hover:shadow-md group overflow-hidden",
              plan.isActive ? "border-gray-100" : "border-gray-100 opacity-60 grayscale"
            )}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-md",
                        plan.intervalDays === 7 ? 'bg-blue-50 text-blue-600' : 
                        plan.intervalDays === 30 ? 'bg-purple-50 text-purple-600' :
                        plan.intervalDays === 1 ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-600'
                      )}>
                        {plan.intervalDays === 1 ? 'Diario' : 
                         [7, 8].includes(plan.intervalDays) ? 'Semanal' : 
                         plan.intervalDays === 15 ? 'Quincenal' : 
                         plan.intervalDays === 30 ? 'Mensual' : 
                         `Cada ${plan.intervalDays} días`}
                      </span>
                      {!plan.isActive && (
                        <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">
                          Inactivo
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-pink-600 transition-colors">{plan.name}</h3>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(plan)} className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(plan.id, plan.name)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-6 min-h-[2.5rem] leading-relaxed">
                  {plan.description || 'Sin descripción detallada.'}
                </p>

                <div className="flex items-end justify-between pt-4 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Inversión</span>
                    <span className="text-xl font-bold text-gray-900">{formatCurrency(Number(plan.price))}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-medium">Logística</span>
                    <span className="text-xs font-semibold text-pink-600">{plan.deliveryCount} entregas</span>
                  </div>
                </div>

                {plan.features?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-50 space-y-2">
                    {plan.features.slice(0, 2).map((f: string) => (
                      <div key={f} className="flex items-center gap-2 text-xs text-gray-500">
                        <Check className="w-3 h-3 text-pink-500" /> {f}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Intervalo de envíos</label>
                <select 
                  value={form.intervalDays} 
                  onChange={e => setForm((f: any) => ({ ...f, intervalDays: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                >
                  <option value="1">Diario (Cada 1 día)</option>
                  <option value="2">Cada 2 días</option>
                  <option value="7">Semanal (Cada 7 días)</option>
                  <option value="8">Semanal (Cada 8 días)</option>
                  <option value="15">Quincenal (Cada 15 días)</option>
                  <option value="30">Mensual (Cada 30 días)</option>
                </select>
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
