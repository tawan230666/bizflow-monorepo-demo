import type { Request, Response, NextFunction } from "express";
import { tableService } from "@/services/table.service";

export const tableController = {
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const tables = await tableService.getAll();
      res.json(tables);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid id" });
      }
      const table = await tableService.getById(id);
      if (!table) {
        return res.status(404).json({ message: "Table not found" });
      }
      res.json(table);
    } catch (err) {
      next(err);
    }
  },
};
