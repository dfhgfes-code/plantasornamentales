'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { ordersApi, subscriptionsApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { User, Package, RefreshCw, MapPin, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PerfilPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [tab, setTab] = useState<'orders' | 'subscriptions'>('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    Promise.all([
      ordersApi.getMine({ limit: 5 })
        .then((r) => setOrders(r.data.data.data || []))
        .catch(() => setOrders([])),
      subscriptionsApi.getMine()
        .then((r) => setSubscriptions(r.data.data || []))
        .catch(() => setSubscriptions([])),
    ]).finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleCancelSub = async (id: string) => {
    if (!confirm('¿Cancelar esta suscripción?')) return;
    try {
      await subscriptionsApi.cancel(id, { reason: 'Cancelado por el usuario' });
      setSubscriptions((prev) => prev.map((s) => s.id === id ? { ...s, status: 'cancelled' } : s));
      toast.success('Suscripción cancelada');
    } catch { toast.error('Error al cancelar'); }
  };

  const handlePauseSub = async (id: string, status: string) => {
    try {
      if (status === 'active') {
        await subscriptionsApi.pause(id);
        setSubscriptions((prev) => prev.map((s) => s.id === id ? { ...s, status: 'paused' } : s));
        toast.success('Suscripción pausada');
      } else {
        await subscriptionsApi.resume(id);
        setSubscriptions((prev) => prev.map((s) => s.id === id ? { ...s, status: 'active' } : s));
        toast.success('Suscripción reactivada');
      }
    } catch { toast.error('Error al actualizar'); }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header perfil */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h1>
              <p className="text-rose-100">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => { logout(); router.push('/'); }} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm transition-colors">
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-2xl border border-gray-100 p-1.5 w-fit">
        {[['orders', Package, 'Mis pedidos'], ['subscriptions', RefreshCw, 'Suscripciones']].map(([key, Icon, label]: any) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === key ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : tab === 'orders' ? (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <Card className="text-center py-12 text-gray-400">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No tienes pedidos aún</p>
            </Card>
          ) : orders.map((order) => (
            <Card key={order.id} hover>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-gray-900">{order.orderNumber}</span>
                    <Badge status={order.status} />
                  </div>
                  <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  {order.deliveryCity && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {order.deliveryCity}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-rose-600">{formatCurrency(Number(order.total))}</p>
                  <p className="text-xs text-gray-400">{order.isAutomatic ? 'Suscripción' : 'Compra directa'}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {subscriptions.length === 0 ? (
            <Card className="text-center py-12 text-gray-400">
              <RefreshCw className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No tienes suscripciones activas</p>
              <a href="/planes" className="text-rose-500 text-sm mt-2 inline-block hover:underline">Ver planes disponibles</a>
            </Card>
          ) : subscriptions.map((sub) => (
            <Card key={sub.id} hover>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-gray-900">{sub.plan?.name}</span>
                    <Badge status={sub.status} />
                  </div>
                  <p className="text-sm text-gray-500">Para: {sub.recipient?.fullName}</p>
                  {sub.nextDeliveryDate && sub.status === 'active' && (
                    <p className="text-xs text-green-600 mt-1">Próxima entrega: {formatDate(sub.nextDeliveryDate)}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-rose-600">{formatCurrency(Number(sub.plan?.price))}</span>
                  {sub.status !== 'cancelled' && sub.status !== 'expired' && (
                    <>
                      <button onClick={() => handlePauseSub(sub.id, sub.status)}
                        className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        {sub.status === 'active' ? 'Pausar' : 'Reactivar'}
                      </button>
                      <button onClick={() => handleCancelSub(sub.id)}
                        className="text-xs px-3 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
