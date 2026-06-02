import type { Request, Response, NextFunction } from "express";
import { paymentService } from "@/services/payment.service";

export const paymentController = {
  createPromptPay: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, amount } = req.body;
      if (!orderId || !amount) {
        return res.status(400).json({ message: "orderId and amount required" });
      }
      const payment = await paymentService.createPromptPay(orderId, amount);
      res.status(201).json(payment);
    } catch (err) {
      next(err);
    }
  },

  getByOrderId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = Number(req.params.orderId);
      const payment = await paymentService.getByOrderId(orderId);
      if (!payment) return res.status(404).json({ message: "Payment not found" });
      res.json(payment);
    } catch (err) {
      next(err);
    }
  },

  markAsPaid: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const payment = await paymentService.markAsPaid(id);
      res.json(payment);
    } catch (err) {
      next(err);
    }
  },

  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = req.query.status as string | undefined;
      const payments = await paymentService.getAll(status);
      res.json(payments);
    } catch (err) {
      next(err);
    }
  },
};
