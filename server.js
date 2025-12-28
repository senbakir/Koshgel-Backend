import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./src/routes/auth.js";
import adminRoutes from "./src/routes/admin.js";

dotenv.config();

const app = express();

// --- Middlewares
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// --- Routes
app.get("/", (req, res) => res.send("Koshgel Backend Running ✅"));
app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// --- 404
app.use((req, res) => {
  res.status(404).json({ ok: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// --- Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err);
  res.status(500).json({ ok: false, error: err.message || "Server error" });
});

// --- DB + Start
const PORT = process.env.PORT || 10000;

const start = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI missing in environment variables");
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET missing in environment variables");
    }
