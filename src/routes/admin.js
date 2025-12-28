import express from "express";
import mongoose from "mongoose";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/test", requireAuth, requireAdmin, (req, res) => {
  console.log("ADMIN MONGODB_URI:", process.env.MONGODB_URI?.slice(0, 40));
  console.log("Mongoose state:", mongoose.connection.readyState);

  res.json({
    ok: true,
    message: "Admin access granted",
    user: req.user,
  });
});

export default router;
import bcrypt from "bcryptjs";
import User from "../models/User.js";

router.post("/seed-admin", async (req, res) => {
  try {
    const email = "senbakir@gmail.com";
    const password = "Barbaros32!!!!";

    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({ ok: true, message: "Admin already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashed,
      role: "admin",
    });

    res.json({ ok: true, message: "Admin user created" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});
