import type { Request, Response, NextFunction } from "express";
import { dashboardService } from "@/services/dashboard.service";

export const dashboardController = {
  getStats: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await dashboardService.getStats();
      res.json(stats);
    } catch (err) {
      next(err);
    }
  },
};
