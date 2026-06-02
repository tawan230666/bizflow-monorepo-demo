export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface CreateOrderItemInput {
  menuItemId: number;
  quantity: number;
  note?: string;
  price: number;
  selectedOptionIds: number[];
}

export interface CreateOrderInput {
  tableId: number;
  items: CreateOrderItemInput[];
}

export interface CreatePaymentInput {
  orderId: number;
  amount: number;
}
