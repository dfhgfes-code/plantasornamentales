'use client';
import { useEffect, useState } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Search, X, RefreshCw, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'];

export default function AdminPedidosPage() {
  const { authorized } = useAuthGuard(['admin', 'super_admin']);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 15;

  useEffect(() => {
    if (!authorized) return;
    load();
  }, [authorized, page, statusFilter]);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (statusFilter) params.append('status', statusFilter);
    api.get(`/admin/orders?${params}`)
      .then(r => {
        setOrders(r.data.data.data || []);
        setTotal(r.data.data.total || 0);
      })
      .finally(() => setLoading(false));
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      toast.success('Estado actualizado');
      load();
    } catch { toast.error('Error al actualizar'); }
  };

  const filtered = orders.filter(o =>
    !search ||
    o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.firstName?.toLowerCase().includes(search.toLowerCase())
  );

  if (!authorized) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h1>
          <p className="text-gray-500 text-sm mt-1">{total} pedidos en total</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-sm text-gray-500 hover:text-rose-600 transition-colors">
          <RefreshCw className="w-4 h-4" /> Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Búsqueda */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por orden o cliente..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filtro estado */}
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">No hay pedidos</p>
            <p className="text-sm mt-1">Intenta con otro filtro</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Orden', 'Cliente', 'Fecha', 'Total', 'Estado', 'Acción'].map(h => (
                    <th key={h} className="text-left px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-bold text-gray-900">{order.orderNumber}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">{order.user?.firstName} {order.user?.lastName}</p>
                      <p className="text-xs text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-4 font-bold text-rose-600">{formatCurrency(Number(order.total))}</td>
                    <td className="px-5 py-4">
                      <Badge status={order.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order.id, e.target.value)}
                          className="appearance-none bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-7 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-300 cursor-pointer"
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginación */}
      {total > LIMIT && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            ← Anterior
          </button>
          <span className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-medium">
            {page} / {Math.ceil(total / LIMIT)}
          </span>
          <button disabled={page >= Math.ceil(total / LIMIT)} onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
