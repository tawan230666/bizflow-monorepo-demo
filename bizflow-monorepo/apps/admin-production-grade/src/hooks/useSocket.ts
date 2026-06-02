import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

let sharedSocket: Socket | null = null;

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!sharedSocket) {
      sharedSocket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
      });
      sharedSocket.on("connect", () =>
        console.log("[Socket] Connected:", sharedSocket?.id)
      );
      sharedSocket.on("disconnect", () =>
        console.log("[Socket] Disconnected")
      );
    }
    socketRef.current = sharedSocket;
    return () => {
      // Keep socket alive for shared use
    };
  }, []);

  return socketRef.current;
};
