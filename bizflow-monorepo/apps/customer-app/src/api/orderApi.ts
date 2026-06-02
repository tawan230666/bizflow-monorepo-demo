import axiosClient from "./axiosClient";
import { API_PATHS } from "@/utils/constants";
import type { Order, CreateOrderPayload } from "@/types/order";

export const orderApi = {
  createOrder: (payload: CreateOrderPayload): Promise<Order> =>
    axiosClient.post(API_PATHS.ORDERS, payload),

  getOrderById: (id: number): Promise<Order> =>
    axiosClient.get(API_PATHS.ORDER_BY_ID(id)),
};