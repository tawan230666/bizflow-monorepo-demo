import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartState } from "@/types/cart";
import { generateId } from "@/utils/formatPrice";
import { STORAGE_KEYS } from "@/utils/constants";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartsByTable: {},

      addItem: (tableId, item) =>
        set((state) => {
          const current = state.cartsByTable[tableId] ?? [];
          return {
            cartsByTable: {
              ...state.cartsByTable,
              [tableId]: [...current, { ...item, cartItemId: generateId() }],
            },
          };
        }),

      removeItem: (tableId, cartItemId) =>
        set((state) => {
          const current = state.cartsByTable[tableId] ?? [];
          return {
            cartsByTable: {
              ...state.cartsByTable,
              [tableId]: current.filter((i) => i.cartItemId !== cartItemId),
            },
          };
        }),

      updateQuantity: (tableId, cartItemId, qty) =>
        set((state) => {
          const current = state.cartsByTable[tableId] ?? [];
          return {
            cartsByTable: {
              ...state.cartsByTable,
              [tableId]: current
                .map((i) =>
                  i.cartItemId === cartItemId ? { ...i, quantity: qty } : i
                )
                .filter((i) => i.quantity > 0),
            },
          };
        }),

      updateNote: (tableId, cartItemId, note) =>
        set((state) => {
          const current = state.cartsByTable[tableId] ?? [];
          return {
            cartsByTable: {
              ...state.cartsByTable,
              [tableId]: current.map((i) =>
                i.cartItemId === cartItemId ? { ...i, note } : i
              ),
            },
          };
        }),

      clear: (tableId) =>
        set((state) => ({
          cartsByTable: { ...state.cartsByTable, [tableId]: [] },
        })),

      getItems: (tableId) => get().cartsByTable[tableId] ?? [],

      getTotal: (tableId) => {
        const items = get().cartsByTable[tableId] ?? [];
        return items.reduce((sum, item) => {
          const optionsPrice = item.selectedOptions.reduce(
            (s, o) => s + o.extraPrice,
            0
          );
          return sum + (item.basePrice + optionsPrice) * item.quantity;
        }, 0);
      },

      getCount: (tableId) => {
        const items = get().cartsByTable[tableId] ?? [];
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    { name: STORAGE_KEYS.CART }
  )
);