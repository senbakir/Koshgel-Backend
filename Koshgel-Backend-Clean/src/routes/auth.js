import { Router } from "express";
import { register, login } from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/ping", (req, res) => res.json({ ok: true, route: "auth" }));

export default router;
