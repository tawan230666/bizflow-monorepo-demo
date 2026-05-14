import { Router } from "express";
import { dashboardController } from "@/controllers/dashboard.controller";
import { authJwt, requireRole } from "@/middlewares/authJwt";

const router = Router();

router.get(
  "/stats",
  authJwt,
  requireRole("admin"),
  dashboardController.getStats
);

export default router;
