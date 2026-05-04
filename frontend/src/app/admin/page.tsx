'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { adminApi } from '@/lib/api';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Users, Package, RefreshCw, DollarSign, AlertTriangle, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

import Link from 'next/link';

export default function AdminPage() {
  const { authorized, user } = useAuthGuard(['admin', 'super_admin']);
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  useEffect(() => {
    if (!authorized) return;
    adminApi.getDashboard().then((r) => setDashboard(r.data.data)).finally(() => setLoading(false));
  }, [authorized]);

  if (!authorized) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
    </div>
  );

  const stats = dashboard?.summary;

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Panel de Control
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sistema operativo y actualizado
          </p>
        </div>
        
        {user?.role === 'super_admin' && (
          <Link href="/admin/super" className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Modo SuperAdmin
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 animate-pulse h-32" />
          ))}
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
            {[
              { label: 'Comunidad', value: stats?.totalUsers, icon: Users, color: 'text-blue-600 bg-blue-50/50 border-blue-100' },
              { label: 'Catálogo', value: stats?.totalProducts, icon: ShoppingBag, color: 'text-purple-600 bg-purple-50/50 border-purple-100' },
              { label: 'Ventas', value: stats?.totalOrders, icon: Package, color: 'text-orange-600 bg-orange-50/50 border-orange-100' },
              { label: 'Suscritos', value: stats?.activeSubscriptions, icon: RefreshCw, color: 'text-pink-600 bg-pink-50/50 border-pink-100' },
              { label: 'Pendientes', value: stats?.pendingOrders, icon: AlertTriangle, color: 'text-amber-600 bg-amber-50/50 border-amber-100' },
              { label: 'Ganancias', value: formatCurrency(stats?.totalRevenue || 0), icon: DollarSign, color: 'text-emerald-600 bg-emerald-50/50 border-emerald-100', small: true },
            ].map(({ label, value, icon: Icon, color, small }) => (
              <div key={label} className={cn("bg-white p-6 rounded-3xl border border-gray-100 shadow-sm shadow-gray-50/50 transition-all hover:shadow-md hover:-translate-y-1 group")}>
                <div className={cn("inline-flex p-2.5 rounded-xl border mb-4 transition-transform group-hover:scale-110", color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className={cn("font-bold text-gray-900 leading-none", small ? "text-base" : "text-2xl")}>{value}</p>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-2">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-10">
            <Link href="/admin/configuracion" className="lg:col-span-2 group">
              <div className="h-full bg-white border border-gray-100 rounded-[2.5rem] p-10 flex items-center justify-between hover:border-pink-200 transition-all shadow-sm">
                <div className="flex items-center gap-8">
                  <div className="p-6 bg-pink-50 text-pink-500 rounded-3xl group-hover:bg-pink-500 group-hover:text-white transition-all duration-500">
                    <Settings className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="font-bold text-2xl text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Configuración del Sitio</h2>
                    <p className="text-gray-500 text-sm mt-1">Gestione contactos, redes sociales y parámetros globales.</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl group-hover:bg-pink-50 group-hover:text-pink-500 transition-all">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </Link>

            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
               <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <AlertTriangle className="w-4 h-4 text-amber-500" /> Alertas de Stock
               </h2>
               {dashboard?.lowStockProducts?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3">
                    <Check className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Inventario optimizado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboard?.lowStockProducts?.slice(0, 4).map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-800 truncate pr-4">{p.name}</p>
                      <span className="text-[10px] font-bold text-rose-600 whitespace-nowrap">{p.stock} uds</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm overflow-hidden relative">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Pedidos Recientes</h2>
              <Link href="/admin/pedidos" className="text-xs font-bold text-pink-600 hover:text-pink-700 uppercase tracking-widest border-b border-pink-100 pb-1 transition-all">Explorar historial</Link>
            </div>
            
            <div className="overflow-x-auto -mx-10 px-10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-gray-50">
                    <th className="text-left py-4">Orden</th>
                    <th className="text-left py-4">Cliente</th>
                    <th className="text-left py-4">Fecha</th>
                    <th className="text-left py-4 text-center">Estado</th>
                    <th className="text-right py-4">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {dashboard?.recentOrders?.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 font-bold text-gray-900">{order.orderNumber}</td>
                      <td className="py-5 text-gray-500">{order.user?.email || 'Visitante'}</td>
                      <td className="py-5 text-gray-400 text-xs">{formatDate(order.createdAt)}</td>
                      <td className="py-5 text-center">
                        <Badge status={order.status} />
                      </td>
                      <td className="py-5 text-right font-bold text-gray-900">{formatCurrency(Number(order.total))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>

      )}
    </div>
  );
}
