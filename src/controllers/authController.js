import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
  try {
    const { fullName, email, password, role, categories } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "Email and password required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({ ok: false, message: "Email already exists" });
    }

    const user = await User.create({
      fullName,
      email: normalizedEmail,
      password,
      role,
      categories: Array.isArray(categories) ? categories : [],
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
      return res.status(400).json({ ok: false, message: "Email and password required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // password select:false olduğu için +password ile çekiyoruz
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    const token = signToken(user);
    return res.json({ ok: true, token });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
