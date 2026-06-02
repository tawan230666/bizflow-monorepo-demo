import { Router } from "express";
import { orderController } from "@/controllers/order.controller";
import { authJwt, requireRole } from "@/middlewares/authJwt";

const router = Router();

// Public — สำหรับลูกค้า
router.post("/", orderController.create);
router.get("/:id", orderController.getById);

// Protected — สำหรับ staff
router.get(
  "/",
  authJwt,
  requireRole("admin", "kitchen", "cashier"),
  orderController.getAll
);

router.get(
  "/kitchen/active",
  authJwt,
  requireRole("admin", "kitchen"),
  orderController.getActive
);

router.patch(
  "/:id/status",
  authJwt,
  requireRole("admin", "kitchen", "cashier"),
  orderController.updateStatus
);

export default router;
