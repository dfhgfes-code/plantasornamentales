'use client';
import { useCartStore } from '@/store/cart.store';
import { formatCurrency } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Gift } from 'lucide-react';
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
        <Link href="/tienda"><Button>Ir a la tienda</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Mi carrito</h1>
      <div className="grid lg:grid-cols-3 gap-8">

        {/* ── Lista de productos ── */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const additionalsTotal = (item.additionals || []).reduce((s, a) => s + a.price, 0);
            const unitPrice = item.price + additionalsTotal;

            return (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Producto principal */}
                <div className="p-4 flex gap-4 items-center">
                  <img
                    src={item.imageUrl || '/flowers/f-rosas-rojas.jpg'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl shrink-0"
                    onError={e => { (e.target as HTMLImageElement).src = '/flowers/f-rosas-rojas.jpg'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                    <p className="text-rose-600 font-semibold text-sm mt-0.5">
                      {formatCurrency(item.price)}
                      {additionalsTotal > 0 && (
                        <span className="text-gray-400 font-normal ml-1">base</span>
                      )}
                    </p>
                    {/* Adicionales como sub-lista */}
                    {(item.additionals || []).length > 0 && (
                      <div className="mt-2 space-y-1">
                        {item.additionals!.map((a, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Gift className="w-3 h-3 text-rose-400 shrink-0" />
                            <span>{a.name}</span>
                            <span className="text-rose-500 font-semibold ml-auto">+{formatCurrency(a.price)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Controles cantidad */}
                  <div className="flex items-center gap-2 shrink-0">
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

                  {/* Precio total del ítem */}
                  <div className="text-right min-w-[90px] shrink-0">
                    <p className="font-bold text-gray-900">{formatCurrency(unitPrice * item.quantity)}</p>
                    {item.quantity > 1 && (
                      <p className="text-[10px] text-gray-400">{formatCurrency(unitPrice)} c/u</p>
                    )}
                    <button onClick={() => removeItem(item.id)}
                      className="text-red-300 hover:text-red-500 mt-1 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Barra de adicionales si los hay */}
                {(item.additionals || []).length > 0 && (
                  <div className="bg-rose-50/60 border-t border-rose-100 px-4 py-2 flex items-center justify-between">
                    <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      {item.additionals!.length} complemento{item.additionals!.length > 1 ? 's' : ''} incluido{item.additionals!.length > 1 ? 's' : ''}
                    </span>
                    <span className="text-xs font-bold text-rose-600">
                      +{formatCurrency(additionalsTotal)} por unidad
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          <button onClick={clearCart}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors">
            Vaciar carrito
          </button>
        </div>

        {/* ── Resumen ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-24 shadow-sm">
          <h2 className="font-bold text-gray-900 text-lg mb-5">Resumen del pedido</h2>

          {/* Desglose por producto */}
          <div className="space-y-3 mb-4">
            {items.map((item) => {
              const addTotal = (item.additionals || []).reduce((s, a) => s + a.price, 0);
              const unitPrice = item.price + addTotal;
              return (
                <div key={item.id} className="text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span className="truncate max-w-[160px] font-medium">{item.name}</span>
                    <span className="font-semibold shrink-0 ml-2">{formatCurrency(unitPrice * item.quantity)}</span>
                  </div>
                  {item.quantity > 1 && (
                    <p className="text-[10px] text-gray-400 mt-0.5">{item.quantity} × {formatCurrency(unitPrice)}</p>
                  )}
                  {(item.additionals || []).map((a, i) => (
                    <div key={i} className="flex justify-between text-[11px] text-gray-400 mt-0.5 pl-2">
                      <span className="flex items-center gap-1"><Gift className="w-2.5 h-2.5 text-rose-300" />{a.name}</span>
                      <span>+{formatCurrency(a.price)}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Envío</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span>
              <span className="text-rose-600">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          <Link href="/checkout">
            <Button className="w-full mt-5" size="lg">
              Proceder al pago <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/tienda"
            className="block text-center text-sm text-gray-400 hover:text-rose-500 mt-3 transition-colors">
            Seguir comprando
          </Link>

          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-3 gap-2">
            {[{ icon: '🛡️', text: 'Pago Seguro' }, { icon: '🚚', text: 'Envío Rápido' }, { icon: '⭐', text: 'Calidad' }].map((b) => (
              <div key={b.text} className="text-center">
                <div className="text-xl mb-1">{b.icon}</div>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
