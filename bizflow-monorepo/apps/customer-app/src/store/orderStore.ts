import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderStatus } from "@/types/order";

interface OrderHistoryItem {
  orderId: number;
  orderNumber: string;
  tableId: number;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
}

interface OrderStoreState {
  currentOrder: Order | null;
  history: OrderHistoryItem[];

  setOrder: (order: Order) => void;
  updateStatus: (status: OrderStatus) => void;
  clearOrder: () => void;
  updateHistoryStatus: (orderId: number, status: OrderStatus) => void;
  removeFromHistory: (orderId: number) => void;
  clearHistory: () => void;
  clearHistoryByTable: (tableId: number) => void;
}

export const useOrderStore = create<OrderStoreState>()(
  persist(
    (set, get) => ({
      currentOrder: null,
      history: [],

      setOrder: (order) => {
        const exists = get().history.some((h) => h.orderId === order.id);
        const newEntry: OrderHistoryItem = {
          orderId: order.id,
          orderNumber: order.orderNumber,
          tableId: order.tableId,
          status: order.status,
          totalPrice: order.totalPrice,
          createdAt: order.createdAt,
        };
        set({
          currentOrder: order,
          history: exists
            ? get().history.map((h) =>
                h.orderId === order.id ? newEntry : h
              )
            : [newEntry, ...get().history].slice(0, 20),
        });
      },

      updateStatus: (status) => {
        const current = get().currentOrder;
        if (!current) return;
        set({
          currentOrder: { ...current, status },
          history: get().history.map((h) =>
            h.orderId === current.id ? { ...h, status } : h
          ),
        });
      },

      updateHistoryStatus: (orderId, status) =>
        set({
          history: get().history.map((h) =>
            h.orderId === orderId ? { ...h, status } : h
          ),
        }),

      clearOrder: () => set({ currentOrder: null }),

      removeFromHistory: (orderId) =>
        set({
          history: get().history.filter((h) => h.orderId !== orderId),
        }),

      clearHistory: () => set({ history: [] }),

      /** ลบประวัติของโต๊ะหนึ่ง (สำหรับตอนเปลี่ยนโต๊ะ) */
      clearHistoryByTable: (tableId) =>
        set({
          history: get().history.filter((h) => h.tableId !== tableId),
        }),
    }),
    { name: "bizflow-orders" }
  )
);
