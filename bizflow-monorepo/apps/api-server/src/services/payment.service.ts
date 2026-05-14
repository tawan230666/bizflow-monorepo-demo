import { prisma } from "@/config/database";
import { generatePromptPayQR } from "@/utils/promptpay";
import { emitPaymentReceived, emitOrderStatusChanged } from "@/sockets";
import { env } from "@/config/env";

export const paymentService = {
  /**
   * Create or reuse pending PromptPay payment.
   * ถ้ามี payment สถานะ "pending" อยู่แล้ว → คืนตัวเดิม ไม่สร้างซ้ำ
   */
  createPromptPay: async (orderId: number, amount: number) => {
    // 🔍 เช็คก่อนว่ามี payment pending อยู่หรือไม่
    const existing = await prisma.payment.findFirst({
      where: {
        orderId,
        paymentStatus: "pending",
        method: "promptpay",
      },
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      console.log(`[Payment] Reusing existing pending payment #${existing.id} for order ${orderId}`);
      return formatPayment(existing);
    }

    // สร้างใหม่ถ้ายังไม่มี
    const { payload, qrImageUrl } = await generatePromptPayQR(
      env.PROMPTPAY_ID,
      amount
    );

    const payment = await prisma.payment.create({
      data: {
        orderId,
        method: "promptpay",
        amount,
        paymentStatus: "pending",
        qrPayload: payload,
        qrImageUrl,
      },
    });

    console.log(`[Payment] Created new payment #${payment.id} for order ${orderId}`);
    return formatPayment(payment);
  },

  getByOrderId: async (orderId: number) => {
    const payment = await prisma.payment.findFirst({
      where: { orderId },
      orderBy: { createdAt: "desc" },
    });
    return payment ? formatPayment(payment) : null;
  },

  markAsPaid: async (paymentId: number) => {
    const payment = await prisma.$transaction(async (tx) => {
      const updated = await tx.payment.update({
        where: { id: paymentId },
        data: { paymentStatus: "paid", paidAt: new Date() },
      });

      const order = await tx.order.update({
        where: { id: updated.orderId },
        data: { status: "paid" },
      });

      await tx.table.update({
        where: { id: order.tableId },
        data: { status: "available" },
      });

      return updated;
    });

    emitPaymentReceived(payment.orderId, payment.id);
    emitOrderStatusChanged(payment.orderId, "paid");

    return formatPayment(payment);
  },

  getAll: async (status?: string) => {
    const payments = await prisma.payment.findMany({
      where: status ? { paymentStatus: status as any } : undefined,
      include: { order: { include: { table: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return payments.map((p) => ({
      ...formatPayment(p),
      orderNumber: p.order.orderNumber,
      tableNumber: p.order.table.tableNumber,
    }));
  },
};

const formatPayment = (p: any) => ({
  id: p.id,
  orderId: p.orderId,
  method: p.method,
  amount: Number(p.amount),
  paymentStatus: p.paymentStatus,
  qrPayload: p.qrPayload ?? undefined,
  qrImageUrl: p.qrImageUrl ?? undefined,
  paidAt: p.paidAt?.toISOString() ?? undefined,
  createdAt: p.createdAt.toISOString(),
});
