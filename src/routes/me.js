import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/me
router.get("/me", requireAuth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

export default router;
