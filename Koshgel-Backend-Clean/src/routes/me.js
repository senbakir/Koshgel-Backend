import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({
    ok: true,
    user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, categories: user.categories }
  });
});

export default router;
