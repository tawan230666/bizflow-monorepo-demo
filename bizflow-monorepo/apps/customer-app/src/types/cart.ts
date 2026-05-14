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
  items: CartItem[];
  addItem: (item: Omit<CartItem, "cartItemId">) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, qty: number) => void;
  updateNote: (cartItemId: string, note: string) => void;
  clear: () => void;
  getTotal: () => number;
  getCount: () => number;
}