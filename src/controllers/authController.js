import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  return jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: "7d" });
}

export const register = async (req, res) => {
  try {
    const { fullName, email, password, role, categories } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "email and password are required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(400).json({ ok: false, message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: fullName || "",
      email: normalizedEmail,
      password: hashed,
      role: role || "worker",
      categories: Array.isArray(categories) ? categories : []
    });

    const token = signToken(user);
    return res.json({ ok: true, token });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "email and password required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(401).json({ ok: false, message: "invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ ok: false, message: "invalid credentials" });

    const token = signToken(user);
    return res.json({ ok: true, token });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
