import type { Request, Response, NextFunction } from "express";
import { orderService } from "@/services/order.service";

export const orderController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tableId, items } = req.body;
      if (!tableId || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Invalid payload" });
      }
      const order = await orderService.create({ tableId, items });
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });
      const order = await orderService.getById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.json(order);
    } catch (err) {
      next(err);
    }
  },

  /** Kitchen: ดูออเดอร์ active (pending + cooking) */
  getActive: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await orderService.getActiveOrders();
      res.json(orders);
    } catch (err) {
      next(err);
    }
  },

  /** Admin: ดูทั้งหมด ทุกสถานะ */
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = req.query.status as string | undefined;
      const orders = await orderService.getAll(status);
      res.json(orders);
    } catch (err) {
      next(err);
    }
  },

  updateStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;
      const valid = ["pending", "cooking", "served", "paid"];
      if (!valid.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const updated = await orderService.updateStatus(id, status);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },
};
