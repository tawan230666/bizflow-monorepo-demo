import type { MenuOption } from "./menu";

export interface CartItem {
  cartItemId: string;        // UUID local สำหรับ key/edit
  menuItemId: number;
  name: string;
  imageUrl: string;
  basePrice: number;
  quantity: number;
  selectedOptions: MenuOption[];
  note?: string;
}

export interface CartState {
  // ✅ แยกตะกร้าตามโต๊ะ: { [tableId]: CartItem[] }
  cartsByTable: Record<number, CartItem[]>;
  addItem: (tableId: number, item: Omit<CartItem, "cartItemId">) => void;
  removeItem: (tableId: number, cartItemId: string) => void;
  updateQuantity: (tableId: number, cartItemId: string, qty: number) => void;
  updateNote: (tableId: number, cartItemId: string, note: string) => void;
  clear: (tableId: number) => void;
  getItems: (tableId: number) => CartItem[];
  getTotal: (tableId: number) => number;
  getCount: (tableId: number) => number;
}