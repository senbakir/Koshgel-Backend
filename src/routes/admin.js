import express from "express";
import mongoose from "mongoose";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/test", requireAuth, requireAdmin, (req, res) => {
  console.log("ADMIN CHECK USER:", req.user);
  console.log("Mongoose state:", mongoose.connection.readyState);

  res.json({
    ok: true,
    message: "Admin access granted",
    user: req.user,
  });
});

export default router;
