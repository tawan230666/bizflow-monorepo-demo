import { createServer } from "http";
import { createApp } from "@/app";
import { env } from "@/config/env";
import { prisma } from "@/config/database";
import { logger } from "@/utils/logger";
import { initSocket } from "@/sockets";

const start = async () => {
  try {
    await prisma.$connect();
    logger.success("Database connected");

    const app = createApp();
    const httpServer = createServer(app);

    initSocket(httpServer);

    httpServer.listen(env.PORT, () => {
      logger.success(`Server running on http://localhost:${env.PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      logger.info(`API endpoint: http://localhost:${env.PORT}/api`);
      logger.info(`Socket.io: ws://localhost:${env.PORT}`);
    });
  } catch (err) {
    logger.error("Failed to start server", err);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  logger.info("Shutting down...");
  await prisma.$disconnect();
  process.exit(0);
});

start();
