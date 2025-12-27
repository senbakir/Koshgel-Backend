import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullName, email, password, role, categories } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashed,
      role,
      categories
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ ok: true, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
