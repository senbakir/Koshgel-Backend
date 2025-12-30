import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

// Not: şimdilik rolü admin yapalım (ceo/manager sende yoksa 403 verir)
router.get("/ping", requireAuth, requireRole("admin"), (req, res) => {
  res.json({ ok: true, route: "admin", user: req.user });
});

export default router;

