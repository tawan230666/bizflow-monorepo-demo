export type AdminRole = "admin" | "kitchen" | "cashier";

export interface User {
  id: number;
  username: string;
  name: string;
  role: AdminRole;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export type OrderStatus = "pending" | "cooking" | "served" | "paid";

export interface OrderItem {
  id: number;
  menuItemId: number;
  name: string;
  quantity: number;
  price: number;
  note?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  tableId: number;
  tableNumber?: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
}

export interface Payment {
  id: number;
  orderId: number;
  orderNumber?: string;
  tableNumber?: number;
  method: "promptpay" | "cash";
  amount: number;
  paymentStatus: "pending" | "paid" | "failed";
  qrPayload?: string;
  qrImageUrl?: string;
  paidAt?: string;
  createdAt: string;
}

export interface MenuOption {
  id: number;
  optionName: string;
  optionType: "radio" | "checkbox";
  extraPrice: number;
  groupName?: string;
}

export interface MenuItem {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  available: boolean;
  options: MenuOption[];
}

export interface Category {
  id: number;
  name: string;
}

export interface DashboardStats {
  totalOrders: number;
  paidOrders: number;
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  activeTables: number;
  topMenus: {
    menuItemId: number;
    name: string;
    imageUrl: string;
    totalSold: number;
  }[];
}
