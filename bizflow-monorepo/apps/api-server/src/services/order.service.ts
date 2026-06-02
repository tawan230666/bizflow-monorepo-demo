import { prisma } from "@/config/database";
import { generateOrderNumber } from "@/utils/orderNumber";
import { emitOrderCreated, emitOrderStatusChanged } from "@/sockets";
import type { CreateOrderInput } from "@/types";

export const orderService = {
  create: async (input: CreateOrderInput) => {
    const totalPrice = input.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          tableId: input.tableId,
          orderNumber: generateOrderNumber(),
          totalPrice,
          status: "pending",
          items: {
            create: input.items.map((i) => ({
              menuItemId: i.menuItemId,
              quantity: i.quantity,
              note: i.note,
              price: i.price,
            })),
          },
        },
        include: {
          items: { include: { menuItem: true } },
          table: true,
        },
      });

      await tx.table.update({
        where: { id: input.tableId },
        data: { status: "occupied" },
      });

      return created;
    });

    const formatted = formatOrder(order);

    // 🔔 Emit to kitchen
    emitOrderCreated(formatted);

    return formatted;
  },

  getById: async (id: number) => {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { menuItem: true } },
        table: true,
      },
    });
    if (!order) return null;
    return formatOrder(order);
  },

  /** ดูออเดอร์ทั้งหมดสำหรับครัว (pending, cooking) */
  getActiveOrders: async () => {
    const orders = await prisma.order.findMany({
      where: {
        status: { in: ["pending", "cooking"] },
      },
      include: {
        items: { include: { menuItem: true } },
        table: true,
      },
      orderBy: { createdAt: "asc" },
    });
    return orders.map(formatOrder);
  },

  /** ดูทั้งหมด (สำหรับ history/dashboard) */
  getAll: async (status?: string) => {
    const orders = await prisma.order.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        items: { include: { menuItem: true } },
        table: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return orders.map(formatOrder);
  },

  updateStatus: async (
    id: number,
    status: "pending" | "cooking" | "served" | "paid"
  ) => {
    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: { include: { menuItem: true } },
        table: true,
      },
    });

    const formatted = formatOrder(updated);

    // 🔔 Emit to customer + kitchen
    emitOrderStatusChanged(id, status, formatted);

    // ถ้าจ่ายเงินเสร็จ → free โต๊ะ
    if (status === "paid") {
      await prisma.table.update({
        where: { id: updated.tableId },
        data: { status: "available" },
      });
    }

    return formatted;
  },
};

const formatOrder = (order: any) => ({
  id: order.id,
  orderNumber: order.orderNumber,
  tableId: order.tableId,
  tableNumber: order.table?.tableNumber,
  totalPrice: Number(order.totalPrice),
  status: order.status,
  createdAt: order.createdAt.toISOString(),
  updatedAt: order.updatedAt.toISOString(),
  items: order.items.map((it: any) => ({
    id: it.id,
    menuItemId: it.menuItemId,
    name: it.menuItem.name,
    quantity: it.quantity,
    price: Number(it.price),
    note: it.note ?? undefined,
  })),
});
