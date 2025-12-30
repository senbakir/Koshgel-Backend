import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

// /api/admin/ping
router.get("/ping", requireAuth, requireRole("admin", "ceo", "manager"), (req, res) => {
  res.json({ ok: true, route: "admin", user: req.user });
});

export default router;
