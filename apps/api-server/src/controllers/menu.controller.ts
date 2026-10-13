import type { Request, Response, NextFunction } from "express";
import { menuService } from "@/services/menu.service";

export const menuController = {
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await menuService.getAll();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });
      const item = await menuService.getById(id);
      if (!item) return res.status(404).json({ message: "Menu not found" });
      res.json(item);
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await menuService.create(req.body);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const item = await menuService.update(id, req.body);
      res.json(item);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await menuService.delete(id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  toggleAvailability: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const item = await menuService.toggleAvailability(id);
      res.json(item);
    } catch (err) {
      next(err);
    }
  },
};
