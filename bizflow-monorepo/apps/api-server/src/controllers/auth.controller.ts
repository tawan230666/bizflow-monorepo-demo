import type { Request, Response, NextFunction } from "express";
import { authService } from "@/services/auth.service";

export const authController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      const result = await authService.login(username, password);
      res.json(result);
    } catch (err) {
      res.status(401).json({ message: (err as Error).message });
    }
  },

  me: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      const user = await authService.me(userId);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
};
