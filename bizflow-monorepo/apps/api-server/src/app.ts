import express from "express";
import cors from "cors";
import { env } from "@/config/env";
import router from "@/routes";
import { errorHandler, notFoundHandler } from "@/middlewares/errorHandler";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: [
        "http://localhost:3003", // Customer App (แอปฝั่งลูกค้า)
        "http://localhost:3000", // สมมติว่าคุณมีแอป Admin/Staff อยู่ที่นี่ด้วย
      ],
      credentials: true, // จำเป็นต้องเปิดไว้ถ้าคุณมีการส่ง cookies หรือ authorization headers
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    }),
  );

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
