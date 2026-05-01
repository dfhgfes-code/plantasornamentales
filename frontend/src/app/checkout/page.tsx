'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { ordersApi, paymentsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CreditCard, Building2, Smartphone, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [step, setStep] = useState<'delivery' | 'payment' | 'success'>('delivery');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [delivery, setDelivery] = useState({ address: '', city: '', notes: '' });

  const subtotal = total();
  const deliveryFee = 8000;
  const grandTotal = subtotal + deliveryFee;

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Inicia sesión para continuar</h2>
        <p className="text-gray-500 mb-6">Necesitas una cuenta para realizar tu pedido</p>
        <Link href="/login"><Button className="w-full">Iniciar sesión</Button></Link>
      </div>
    );
  }

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Tu carrito está vacío</h2>
        <Link href="/tienda"><Button>Ir a la tienda</Button></Link>
      </div>
    );
  }

  const handleCreateOrder = async () => {
    if (!delivery.address || !delivery.city) {
      toast.error('Completa la dirección de entrega');
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        deliveryAddress: delivery.address,
        deliveryCity: delivery.city,
        notes: delivery.notes,
      };
      const res = await ordersApi.create(orderData);
      setOrderId(res.data.data.id);
      setStep('payment');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al crear el pedido');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      await paymentsApi.initiate({ orderId, paymentMethod });
      clearCart();
      setStep('success');
      toast.success('¡Pago procesado exitosamente! 🌸');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Pedido confirmado!</h2>
        <p className="text-gray-500 mb-8">Tu pedido ha sido recibido. Te notificaremos cuando esté en camino.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/perfil"><Button variant="outline">Ver mis pedidos</Button></Link>
          <Link href="/tienda"><Button>Seguir comprando</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Pasos */}
      <div className="flex items-center gap-4 mb-8">
        {[['delivery', '1', 'Entrega'], ['payment', '2', 'Pago']].map(([s, num, label]) => (
          <div key={s} className={`flex items-center gap-2 text-sm font-medium ${step === s ? 'text-rose-600' : 'text-gray-400'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === s ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{num}</span>
            {label}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 'delivery' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h2 className="font-bold text-gray-900 text-lg mb-4">Dirección de entrega</h2>
              <Input label="Dirección completa" placeholder="Calle 45 # 12-34 Apto 201"
                value={delivery.address} onChange={(e) => setDelivery({ ...delivery, address: e.target.value })} />
              <Input label="Ciudad" placeholder="Bogotá"
                value={delivery.city} onChange={(e) => setDelivery({ ...delivery, city: e.target.value })} />
              <Input label="Notas de entrega (opcional)" placeholder="Tocar el timbre dos veces..."
                value={delivery.notes} onChange={(e) => setDelivery({ ...delivery, notes: e.target.value })} />
              <Button onClick={handleCreateOrder} loading={loading} className="w-full mt-2" size="lg">
                Continuar al pago
              </Button>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-5">Método de pago</h2>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { id: 'CARD', icon: CreditCard, label: 'Tarjeta' },
                  { id: 'PSE', icon: Building2, label: 'PSE' },
                  { id: 'NEQUI', icon: Smartphone, label: 'Nequi' },
                ].map(({ id, icon: Icon, label }) => (
                  <button key={id} onClick={() => setPaymentMethod(id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${paymentMethod === id ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Icon className={`w-6 h-6 ${paymentMethod === id ? 'text-rose-500' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${paymentMethod === id ? 'text-rose-600' : 'text-gray-600'}`}>{label}</span>
                  </button>
                ))}
              </div>
              <div className="bg-blue-50 rounded-xl p-4 mb-6 text-sm text-blue-700">
                🔒 Pago seguro procesado por <strong>Wompi</strong>. Tus datos están protegidos.
              </div>
              <Button onClick={handlePayment} loading={loading} className="w-full" size="lg">
                Pagar {formatCurrency(grandTotal)}
              </Button>
            </div>
          )}
        </div>

        {/* Resumen */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-24">
          <h2 className="font-bold text-gray-900 mb-4">Resumen</h2>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600 truncate mr-2">{item.name} x{item.quantity}</span>
                <span className="font-medium shrink-0">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Envío</span><span>{formatCurrency(deliveryFee)}</span></div>
            <div className="flex justify-between font-bold text-base text-gray-900 pt-1">
              <span>Total</span><span className="text-rose-600">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
