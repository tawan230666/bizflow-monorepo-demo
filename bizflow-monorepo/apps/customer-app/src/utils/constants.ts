export const API_PATHS = {
  MENU: "/menu",
  MENU_BY_ID: (id: number) => `/menu/${id}`,
  CATEGORIES: "/categories",
  ORDERS: "/orders",
  ORDER_BY_ID: (id: number) => `/orders/${id}`,
  PAYMENT_PROMPTPAY: "/payments/promptpay",
} as const;

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "รอดำเนินการ",
  cooking: "กำลังปรุง",
  served: "เสิร์ฟแล้ว",
  paid: "ชำระเงินแล้ว",
};

export const ORDER_STATUS_COLOR: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  cooking: "bg-amber-100 text-amber-800",
  served: "bg-green-100 text-green-800",
  paid: "bg-blue-100 text-blue-800",
};

export const STORAGE_KEYS = {
  CART: "bizflow-cart",
  TABLE: "bizflow-table",
} as const;