import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

// sadece CEO erişsin
router.get("/admin/ping", requireAuth, requireRole("ceo"), (req, res) => {
  res.json({ ok: true, admin: true, role: req.user.role });
});

export default router;
