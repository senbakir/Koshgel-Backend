import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

router.get("/ping", requireAuth, requireRole("admin"), (req, res) => {
  res.json({ ok: true, message: "admin works", user: req.user });
});

export default router;
