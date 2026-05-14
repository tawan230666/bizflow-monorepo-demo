import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/utils/constants";

interface TableState {
  tableId: number | null;
  setTableId: (id: number) => void;
  clearTable: () => void;
}

export const useTableStore = create<TableState>()(
  persist(
    (set) => ({
      tableId: null,
      setTableId: (id) => set({ tableId: id }),
      clearTable: () => set({ tableId: null }),
    }),
    { name: STORAGE_KEYS.TABLE }
  )
);