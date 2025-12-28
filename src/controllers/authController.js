import jwt from "jsonwebtoken";
import User from "../models/User.js";

function signToken(user) {
  const secret = process.env.JWT_SECRET || "dev_secret_change_me";
  return jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: "7d" });
}

export const register = async (req, res) => {
  export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ ok: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ ok: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      ok: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        categories: user.categories,
      },
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

  try {
    const { fullName, email, password, role, categories } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "email and password are required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(400).json({ ok: false, message: "User already exists" });

    const user = await User.create({
      fullName,
      email: normalizedEmail,
      password,
      role: role || "worker",
      categories: Array.isArray(categories) ? categories : []
    });

    const token = signToken(user);

    return res.status(201).json({
      ok: true,
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, categories: user.categories }
    });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ ok: false, message: "Register failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "email and password are required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) return res.status(401).json({ ok: false, message: "Invalid credentials" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ ok: false, message: "Invalid credentials" });

    const token = signToken(user);
    return res.json({
      ok: true,
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, categories: user.categories }
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ ok: false, message: "Login failed" });
  }
};
