import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./src/routes/auth.js";
import meRoutes from "./src/routes/me.js";
import healthRoutes from "./src/routes/health.js";
import adminRoutes from "./src/routes/admin.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Root test
app.get("/", (req, res) => {
  res.json({ ok: true, service: "koshgel" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/me", meRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/admin", adminRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ ok: false, error: err.message });
});

const PORT = process.env.PORT || 10000;

async function start() {
  try {
    if (!process.env.MONGO_URI) throw new Error("Missing MONGO_URI env var");
    if (!process.env.JWT_SECRET) throw new Error("Missing JWT_SECRET env var");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (e) {
    console.error("❌ Startup failed:", e.message);
    process.exit(1);
  }
}

start();
