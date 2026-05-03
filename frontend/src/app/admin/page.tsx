'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { adminApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Users, Package, RefreshCw, DollarSign, AlertTriangle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') { router.push('/login'); return; }
    adminApi.getDashboard().then((r) => setDashboard(r.data.data)).finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated || user?.role !== 'admin') return null;

  const stats = dashboard?.summary;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Panel Administrativo</h1>
        <p className="text-gray-500 mt-1">Resumen del negocio</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: 'Usuarios', value: stats?.totalUsers, icon: Users, color: 'text-blue-600 bg-blue-50' },
              { label: 'Productos', value: stats?.totalProducts, icon: ShoppingBag, color: 'text-purple-600 bg-purple-50' },
              { label: 'Pedidos', value: stats?.totalOrders, icon: Package, color: 'text-orange-600 bg-orange-50' },
              { label: 'Suscripciones', value: stats?.activeSubscriptions, icon: RefreshCw, color: 'text-green-600 bg-green-50' },
              { label: 'Pendientes', value: stats?.pendingOrders, icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-50' },
              { label: 'Ingresos', value: formatCurrency(stats?.totalRevenue || 0), icon: DollarSign, color: 'text-rose-600 bg-rose-50', small: true },
            ].map(({ label, value, icon: Icon, color, small }) => (
              <Card key={label} className="p-5">
                <div className={`inline-flex p-2 rounded-xl ${color} mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className={`font-bold text-gray-900 ${small ? 'text-base' : 'text-2xl'}`}>{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pedidos recientes */}
            <Card>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-900">Pedidos recientes</h2>
                <Link href="/admin/pedidos" className="text-xs text-rose-500 hover:underline">Ver todos</Link>
              </div>
              <div className="space-y-3">
                {dashboard?.recentOrders?.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-xs text-gray-400">{order.user?.email} · {formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge status={order.status} />
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(Number(order.total))}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Stock bajo */}
            <Card>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" /> Stock bajo
                </h2>
                <Link href="/admin/productos" className="text-xs text-rose-500 hover:underline">Gestionar</Link>
              </div>
              {dashboard?.lowStockProducts?.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">✅ Todos los productos tienen stock suficiente</p>
              ) : (
                <div className="space-y-3">
                  {dashboard?.lowStockProducts?.map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <p className="text-sm font-medium text-gray-900">{p.name}</p>
                      <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg">{p.stock} unidades</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Links rápidos admin */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { href: '/admin/productos', label: 'Productos', icon: ShoppingBag, color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
              { href: '/admin/planes', label: 'Planes', icon: RefreshCw, color: 'bg-pink-50 text-pink-700 hover:bg-pink-100' },
              { href: '/admin/pedidos', label: 'Pedidos', icon: Package, color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
              { href: '/admin/usuarios', label: 'Usuarios', icon: Users, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
              { href: '/admin/configuracion', label: 'Configuración Tienda', icon: RefreshCw, color: 'bg-rose-500 text-white hover:bg-rose-600 shadow-pink' },
            ].map(({ href, label, icon: Icon, color }) => (
              <Link key={href} href={href} className={`flex items-center justify-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all hover:-translate-y-1 ${color}`}>
                <Icon className="w-5 h-5" /> {label}
              </Link>
            ))}

          </div>
        </>
      )}
    </div>
  );
}
