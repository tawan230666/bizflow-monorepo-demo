export type OrderStatus = "pending" | "cooking" | "served" | "paid";

export interface OrderItemPayload {
  menuItemId: number;
  quantity: number;
  note?: string;
  price: number;
  selectedOptionIds: number[];
}

export interface CreateOrderPayload {
  tableId: number;
  items: OrderItemPayload[];
}

export interface Order {
  id: number;
  orderNumber: string;
  tableId: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItemDetail[];
}

export interface OrderItemDetail {
  id: number;
  menuItemId: number;
  name: string;
  quantity: number;
  price: number;
  note?: string;
}

export type PaymentMethod = "promptpay" | "cash";
export type PaymentStatus = "pending" | "paid" | "failed";

export interface Payment {
  id: number;
  orderId: number;
  method: PaymentMethod;
  amount: number;
  paymentStatus: PaymentStatus;
  qrPayload?: string;       // PromptPay payload string
  qrImageUrl?: string;
  paidAt?: string;
}