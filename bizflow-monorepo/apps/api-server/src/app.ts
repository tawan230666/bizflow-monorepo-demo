import express from "express";
import cors from "cors";
import { env } from "@/config/env";
import router from "@/routes";
import { errorHandler, notFoundHandler } from "@/middlewares/errorHandler";

export const createApp = () => {
  const app = express();

  // Allowed origins come from CORS_ORIGIN (comma-separated) so each
  // environment can be configured without code changes.
  app.use(cors({ origin: env.CORS_ORIGIN }));

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (_req, res) => {
    res.json({
      name: "BizFlow API",
      version: "1.0.0",
      docs: "/api/health",
    });
  });

  app.use("/api", router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
