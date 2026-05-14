import type { Request, Response, NextFunction } from "express";
import { categoryService } from "@/services/category.service";

export const categoryController = {
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await categoryService.getAll();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
};
