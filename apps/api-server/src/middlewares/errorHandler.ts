import type { Request, Response, NextFunction } from "express";
import { env } from "@/config/env";
import { HttpError } from "@/utils/httpError";
import { logger } from "@/utils/logger";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  // Expected, client-caused errors: return the message as-is.
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  // Unexpected errors: log the details, but never leak internals in production.
  logger.error(`${err.name}: ${err.message}`, err.stack);
  res.status(500).json({
    message:
      env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Internal server error",
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
};
