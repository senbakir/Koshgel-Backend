import express from "express";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/test", requireAuth, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ ok: false, message: "Admin only" });
  }

  res.json({
    ok: true,
    message: "Admin access granted",
    user: {
      id: req.user._id,
      role: req.user.role
    }
  });
});

export default router;
