import { Router } from "express";
import { menuController } from "@/controllers/menu.controller";
import { authJwt, requireRole } from "@/middlewares/authJwt";

const router = Router();

// Public
router.get("/", menuController.getAll);
router.get("/:id", menuController.getById);

// Admin only
router.post("/", authJwt, requireRole("admin"), menuController.create);
router.put("/:id", authJwt, requireRole("admin"), menuController.update);
router.delete("/:id", authJwt, requireRole("admin"), menuController.delete);
router.patch(
  "/:id/toggle",
  authJwt,
  requireRole("admin"),
  menuController.toggleAvailability
);

export default router;
