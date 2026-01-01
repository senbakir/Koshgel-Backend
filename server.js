import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import healthRoute from "./src/routes/health.js";
import authRoute from "./src/routes/auth.js";
import meRoute from "./src/routes/me.js";
import adminRoute from "./src/routes/admin.js";

dotenv.config();

const app = express();

// --- Middlewares ---
app.use(
  cors({
    origin: process.env.CORS_ORIGIN === "*" ? true : (process.env.CORS_ORIGIN || true),
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// --- Routes ---
app.get("/", (req, res) => res.json({ ok: true, service: "koshgel" }));

app.use("/api", healthRoute);      // /api/health
app.use("/api/auth", authRoute);   // /api/auth/register , /api/auth/login
app.use("/api", meRoute);          // /api/me
app.use("/api", adminRoute);       // /api/admin/ping  (admin.js içinde tanımlı)

// --- Start ---
const PORT = process.env.PORT || 10000;

async function start() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MONGO_URI missing. Add it in Render Environment Variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err?.message || err);
    process.exit(1);
  }

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

start();
