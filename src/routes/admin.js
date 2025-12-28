import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/test", requireAuth, requireAdmin, (req, res) => {
  res.json({
    ok: true,
    message: "Admin access granted",
    user: req.user
  });
});

export default router;
