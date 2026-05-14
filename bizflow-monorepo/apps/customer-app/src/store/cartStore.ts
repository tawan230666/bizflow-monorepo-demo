import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartState } from "@/types/cart";
import { generateId } from "@/utils/formatPrice";
import { STORAGE_KEYS } from "@/utils/constants";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, { ...item, cartItemId: generateId() }],
        })),

      removeItem: (cartItemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        })),

      updateQuantity: (cartItemId, qty) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.cartItemId === cartItemId ? { ...i, quantity: qty } : i
            )
            .filter((i) => i.quantity > 0),
        })),

      updateNote: (cartItemId, note) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, note } : i
          ),
        })),

      clear: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((sum, item) => {
          const optionsPrice = item.selectedOptions.reduce(
            (s, o) => s + o.extraPrice,
            0
          );
          return sum + (item.basePrice + optionsPrice) * item.quantity;
        }, 0);
      },

      getCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: STORAGE_KEYS.CART }
  )
);