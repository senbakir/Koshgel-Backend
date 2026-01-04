import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function signToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing");

  // sub = userId
  return jwt.sign({ sub: userId }, secret, { expiresIn: "7d" });
}

// (Opsiyonel) register — istersen employer/worker ayrımını sonra genişletiriz
router.post("/auth/register", async (req, res) => {
  try {
    const email = (req.body.email || "").toLowerCase().trim();
    const password = req.body.password || "";

    if (!email || !password) return res.status(400).json({ ok: false, message: "Email & password required" });
    if (password.length < 6) return res.status(400).json({ ok: false, message: "Password too short" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ ok: false, message: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      passwordHash,
      role: "employer",
      status: "active",
    });

    const token = signToken(user._id.toString());
    return res.json({ ok: true, token, user: { email: user.email, role: user.role } });
  } catch (e) {
    return res.status(500).json({ ok: false, message: "Register failed" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const email = (req.body.email || "").toLowerCase().trim();
    const password = req.body.password || "";

    if (!email || !password) return res.status(400).json({ ok: false, message: "Email & password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ ok: false, message: "Invalid credentials" });

    if (user.status !== "active") return res.status(403).json({ ok: false, message: "User blocked" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ ok: false, message: "Invalid credentials" });

    const token = signToken(user._id.toString());
    return res.json({ ok: true, token, user: { email: user.email, role: user.role } });
  } catch (e) {
    return res.status(500).json({ ok: false, message: "Login failed" });
  }
});

router.get("/auth/me", requireAuth, async (req, res) => {
  return res.json({ ok: true, user: req.user });
});

export default router;
