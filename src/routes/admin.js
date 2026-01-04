import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Admin health / test
router.get("/health", requireAuth, requireRole("ceo", "manager"), (req, res) => {
  res.json({
    ok: true,
    role: req.user.role,
    message: "Admin route working"
  });
});

export default router;

