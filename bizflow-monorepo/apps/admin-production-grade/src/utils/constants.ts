import type { OrderStatus, AdminRole } from "@/types";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "รอดำเนินการ",
  cooking: "กำลังปรุง",
  served: "เสิร์ฟแล้ว",
  paid: "ชำระเงินแล้ว",
};

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  cooking: "bg-blue-100 text-blue-800 border-blue-300",
  served: "bg-green-100 text-green-800 border-green-300",
  paid: "bg-slate-100 text-slate-800 border-slate-300",
};

export const ROLE_LABEL: Record<AdminRole, string> = {
  admin: "ผู้จัดการ",
  kitchen: "ครัว",
  cashier: "แคชเชียร์",
};
