import { Router } from "express";
import { paymentController } from "@/controllers/payment.controller";
import { authJwt, requireRole } from "@/middlewares/authJwt";

const router = Router();

// Public — customer สร้าง QR
router.post("/promptpay", paymentController.createPromptPay);
router.get("/order/:orderId", paymentController.getByOrderId);

// Protected — cashier confirm payment
router.patch(
  "/:id/paid",
  authJwt,
  requireRole("admin", "cashier"),
  paymentController.markAsPaid
);

router.get(
  "/",
  authJwt,
  requireRole("admin", "cashier"),
  paymentController.getAll
);

export default router;
