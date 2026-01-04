import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) return res.status(401).json({ ok: false, message: "Missing token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select("_id email role status");

    if (!user) return res.status(401).json({ ok: false, message: "User not found" });
    if (user.status !== "active") return res.status(403).json({ ok: false, message: "User blocked" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) return res.status(401).json({ ok: false, message: "Unauthorized" });
    if (!roles.includes(role)) return res.status(403).json({ ok: false, message: "Forbidden" });
    next();
  };
}
