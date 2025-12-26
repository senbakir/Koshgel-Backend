import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function signToken(user) {
  const secret = process.env.JWT_SECRET || "dev_secret_change_me";
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    secret,
    { expiresIn: "30d" }
  );
}

export async function register(req, res) {
  try {
    const { role, fullName, email, phone, password, categories, companyName } = req.body || {};

    if (!role || !fullName || !password) {
      return res.status(400).json({ ok: false, error: "role, fullName, password required" });
    }
    if (!["worker", "employer", "admin"].includes(role)) {
      return res.status(400).json({ ok: false, error: "invalid role" });
    }
    if (!email && !phone) {
      return res.status(400).json({ ok: false, error: "email or phone required" });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ ok: false, error: "password must be at least 6 chars" });
    }

    const emailNorm = email ? String(email).toLowerCase().trim() : undefined;
    const phoneNorm = phone ? String(phone).trim() : undefined;

    const existing = await User.findOne({
      $or: [
        ...(emailNorm ? [{ email: emailNorm }] : []),
        ...(phoneNorm ? [{ phone: phoneNorm }] : [])
      ]
    });

    if (existing) {
      return res.status(409).json({ ok: false, error: "user already exists" });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const user = await User.create({
      role,
      fullName: String(fullName).trim(),
      email: emailNorm,
      phone: phoneNorm,
      passwordHash,
      workerProfile: role === "worker"
        ? { categories: Array.isArray(categories) ? categories : [] }
        : undefined,
      employerProfile: role === "employer"
        ? { companyName: companyName ? String(companyName).trim() : "" }
        : undefined
    });

    const token = signToken(user);

    return res.status(201).json({
      ok: true,
      token,
      user: {
        id: user._id,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    const msg = String(err?.message || err);
    if (msg.includes("E11000")) {
      return res.status(409).json({ ok: false, error: "email or phone already in use" });
    }
    return res.status(500).json({ ok: false, error: msg });
  }
}
