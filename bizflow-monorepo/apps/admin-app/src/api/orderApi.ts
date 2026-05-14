import axiosClient from "./axiosClient";
import type { Order, OrderStatus } from "@/types";

export const orderApi = {
  getActive: (): Promise<Order[]> => axiosClient.get("/orders/kitchen/active"),
  getAll: (status?: string): Promise<Order[]> =>
    axiosClient.get(`/orders${status ? `?status=${status}` : ""}`),
  getById: (id: number): Promise<Order> => axiosClient.get(`/orders/${id}`),
  updateStatus: (id: number, status: OrderStatus): Promise<Order> =>
    axiosClient.patch(`/orders/${id}/status`, { status }),
};
