import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const emailRaw = (req.body?.email || "").toString();
    const passwordRaw = (req.body?.password || "").toString();

    const email = emailRaw.toLowerCase().trim();
    const password = passwordRaw;

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "email and password required" });
    }

    // IMPORTANT: if User schema has password select:false, we must explicitly select it
    const user = await User.findOne({ email }).select("+password");

    // Don't leak whether user exists
    if (!user) {
      return res.status(401).json({ ok: false, message: "Invalid credentials" });
    }

    // If password still missing, treat as invalid credentials (no internal leaks)
    if (!user.password) {
      return res.status(401).json({ ok: false, message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ ok: false, message: "Invalid credentials" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // Fail fast in production: secret must be configured
      return res.status(500).json({ ok: false, message: "Server misconfigured" });
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      secret,
      { expiresIn: "7d" }
    );

    return res.json({
      ok: true,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;
