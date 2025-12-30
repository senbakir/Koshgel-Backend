import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ ok: false, message: "Missing token" });

    const secret = process.env.JWT_SECRET || "dev_secret_change_me";
    const payload = jwt.verify(token, secret);

    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ ok: false, message: "Invalid token user" });

    req.user = { id: user._id.toString(), role: user.role, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
};
