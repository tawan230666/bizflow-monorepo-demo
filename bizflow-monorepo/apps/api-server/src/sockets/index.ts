import { Server as HTTPServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";

export let io: SocketServer;

export const initSocket = (httpServer: HTTPServer) => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // ลูกค้า join room ของ order ตัวเอง เพื่อรับ status updates
    socket.on("join-order", (orderId: number) => {
      const room = `order:${orderId}`;
      socket.join(room);
      logger.info(`Socket ${socket.id} joined ${room}`);
    });

    // ครัว join room "kitchen" เพื่อรับออเดอร์ใหม่ทั้งหมด
    socket.on("join-kitchen", () => {
      socket.join("kitchen");
      logger.info(`Socket ${socket.id} joined kitchen`);
    });

    // ครัว leave room
    socket.on("leave-kitchen", () => {
      socket.leave("kitchen");
    });

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  logger.success("Socket.io initialized");
  return io;
};

// ============ Emit Helpers ============
export const emitOrderCreated = (order: unknown) => {
  if (!io) return;
  io.to("kitchen").emit("order:new", order);
};

export const emitOrderStatusChanged = (
  orderId: number,
  status: string,
  order?: unknown
) => {
  if (!io) return;
  io.to(`order:${orderId}`).emit("order:status", { orderId, status });
  io.to("kitchen").emit("order:status", { orderId, status, order });
};

export const emitPaymentReceived = (orderId: number, paymentId: number) => {
  if (!io) return;
  io.to(`order:${orderId}`).emit("payment:received", { orderId, paymentId });
  io.to("kitchen").emit("payment:received", { orderId, paymentId });
};
