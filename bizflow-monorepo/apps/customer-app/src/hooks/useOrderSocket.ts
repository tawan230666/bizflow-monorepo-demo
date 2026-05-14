import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useOrderStore } from "@/store/orderStore";
import type { OrderStatus } from "@/types/order";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

let socket: Socket | null = null;

export const useOrderSocket = (orderId: number | null) => {
  const updateStatus = useOrderStore((s) => s.updateStatus);

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
        updateStatus(data.status);
        console.log(`[Socket] Order ${orderId} status: ${data.status}`);
      }
    };

    const handlePaymentReceived = (data: { orderId: number }) => {
      if (data.orderId === orderId) {
        updateStatus("paid");
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
