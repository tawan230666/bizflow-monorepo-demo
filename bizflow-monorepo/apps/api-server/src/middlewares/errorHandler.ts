import type { Request, Response, NextFunction } from "express";
import { logger } from "@/utils/logger";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  logger.error(`${err.name}: ${err.message}`, err.stack);

  res.status(500).json({
    message: err.message || "Internal server error",
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
};
