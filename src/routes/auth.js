import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // 1) Body kontrol
    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ ok: false, message: "Invalid credentials" });
    }

    // 2) DB hash kontrol (alan adın password)
    if (!user.password) {
      return res.status(500).json({ ok: false, message: "User password hash missing in DB" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ ok: false, message: "Invalid credentials" });
    }

    const secret = process.env.JWT_SECRET || "dev_secret_change_me";
    const token = jwt.sign({ id: user._id.toString() }, secret, { expiresIn: "7d" });

    return res.json({
      ok: true,
      token,
      user: { id: user._id.toString(), email: user.email, role: user.role, categories: user.categories || [] },
    });
  } catch (err) {
    console.error("LOGIN_ERROR:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;
