import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ ok: false, message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ ok: false, message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "7d" }
  );

  res.json({
    ok: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      categories: user.categories || []
    }
  });
});

export default router;
