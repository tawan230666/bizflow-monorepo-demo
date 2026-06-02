import axiosClient from "./axiosClient";
import { API_PATHS } from "@/utils/constants";
import type { Payment } from "@/types/order";

export interface CreatePromptPayPayload {
  orderId: number;
  amount: number;
}

export const paymentApi = {
  createPromptPay: (payload: CreatePromptPayPayload): Promise<Payment> =>
    axiosClient.post(API_PATHS.PAYMENT_PROMPTPAY, payload),
};