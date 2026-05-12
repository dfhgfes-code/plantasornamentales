import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartAdditional {
  name: string;
  price: number;
  imageUrl?: string;
  note?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  additionals?: CartAdditional[]; // adicionales vinculados a este producto
}

interface CartState {
  items: CartItem[];
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  addItemWithAdditionals: (
    product: Omit<CartItem, 'quantity'>,
    additionals: CartAdditional[]
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const existing = get().items.find((i) => i.id === product.id);
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          }));
        } else {
          set((state) => ({ items: [...state.items, { ...product, quantity: 1 }] }));
        }
      },

      // Agrega producto con sus adicionales como un solo ítem agrupado
      addItemWithAdditionals: (product, additionals) => {
        const existing = get().items.find((i) => i.id === product.id);
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          }));
        } else {
          set((state) => ({
            items: [
              ...state.items,
              {
                ...product,
                quantity: 1,
                additionals: additionals.length > 0 ? additionals : undefined,
              },
            ],
          }));
        }
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) { get().removeItem(id); return; }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }));
      },

      clearCart: () => set({ items: [] }),

      // Total incluye precio base + adicionales por cada unidad
      total: () =>
        get().items.reduce((sum, i) => {
          const addPrice = (i.additionals || []).reduce((s, a) => s + a.price, 0);
          return sum + (i.price + addPrice) * i.quantity;
        }, 0),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);
