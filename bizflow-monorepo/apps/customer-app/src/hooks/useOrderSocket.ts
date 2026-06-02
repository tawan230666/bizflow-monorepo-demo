import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useOrderStore } from "@/store/orderStore";
import type { OrderStatus } from "@/types/order";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

let socket: Socket | null = null;

interface SocketHandlers {
  onStatus?: (status: OrderStatus) => void;
  onPaid?: () => void;
}

export const useOrderSocket = (
  orderId: number | null,
  handlers?: SocketHandlers
) => {
  const updateStatus = useOrderStore((s) => s.updateStatus);

  // ✅ เก็บ handlers ใน ref เพื่อไม่ให้ effect re-run ทุกครั้งที่ parent re-render
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!orderId) return;

    // สร้าง socket connection หากยังไม่มี
    if (!socket) {
      socket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
      });
      socket.on("connect", () => console.log("[Socket] Customer connected"));
    }

    socket.emit("join-order", orderId);
    console.log(`[Socket] Subscribed to order ${orderId}`);

    const handleStatusUpdate = (data: {
      orderId: number;
      status: OrderStatus;
    }) => {
      if (data.orderId === orderId) {
        updateStatus(data.status, orderId);
        handlersRef.current?.onStatus?.(data.status);
        console.log(`[Socket] Order ${orderId} status: ${data.status}`);
      }
    };

    const handlePaymentReceived = (data: { orderId: number }) => {
      if (data.orderId === orderId) {
        updateStatus("paid", orderId);
        handlersRef.current?.onPaid?.();
        console.log(`[Socket] Payment received for order ${orderId}`);
      }
    };

    socket.on("order:status", handleStatusUpdate);
    socket.on("payment:received", handlePaymentReceived);

    return () => {
      socket?.off("order:status", handleStatusUpdate);
      socket?.off("payment:received", handlePaymentReceived);
      console.log(`[Socket] Unsubscribed from order ${orderId}`);
    };
  }, [orderId, updateStatus]);
};