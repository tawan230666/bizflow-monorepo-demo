import { Router } from "express";
import { authController } from "@/controllers/auth.controller";
import { authJwt } from "@/middlewares/authJwt";

const router = Router();

router.post("/login", authController.login);
router.get("/me", authJwt, authController.me);

export default router;
