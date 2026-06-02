import axiosClient from "./axiosClient";
import type { Payment } from "@/types";

export const paymentApi = {
  getAll: (status?: string): Promise<Payment[]> =>
    axiosClient.get(`/payments${status ? `?status=${status}` : ""}`),
  markAsPaid: (id: number): Promise<Payment> =>
    axiosClient.patch(`/payments/${id}/paid`),
};
