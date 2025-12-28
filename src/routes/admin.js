import express from "express";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * Admin test endpoint
 * GET /api/admin/test
 */
router.get("/test", auth, requireRole("admin"), (req, res) => {
  res.json({
    ok: true,
    message: "Admin access granted",
    user: req.user,
  });
});

/**
 * Get all users (admin only)
 * GET /api/admin/users
 */
router.get("/users", auth, requireRole("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ ok: true, users });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * Delete user by id (admin only)
 * DELETE /api/admin/users/:id
 */
router.delete("/users/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;

