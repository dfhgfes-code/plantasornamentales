'use client';
import { useCartStore } from '@/store/cart.store';
import { formatCurrency } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const subtotal = total();
  const deliveryFee = items.length > 0 ? 8000 : 0;
  const grandTotal = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-200 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-400 mb-6">Agrega algunas flores para continuar</p>
        <Link href="/tienda">
          <Button>Ir a la tienda</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Mi carrito</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center">
              <img src={item.imageUrl || 'https://images.unsplash.com/photo-1487530811015-780780169993?w=100'}
                alt={item.name} className="w-20 h-20 object-cover rounded-xl shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                <p className="text-rose-600 font-bold mt-1">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <div className="text-right min-w-[80px]">
                <p className="font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 mt-1 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
            Vaciar carrito
          </button>
        </div>

        {/* Resumen */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-24">
          <h2 className="font-bold text-gray-900 text-lg mb-5">Resumen del pedido</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({items.length} productos)</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Envío</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span>
              <span className="text-rose-600">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
          <Link href="/checkout">
            <Button className="w-full mt-6" size="lg">
              Proceder al pago <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/tienda" className="block text-center text-sm text-gray-400 hover:text-rose-500 mt-3 transition-colors">
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
