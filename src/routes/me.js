import express from "express";
import { requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ ok: false, message: "User not found" });
  return res.json({ ok: true, user });
});

export default router;
