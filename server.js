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

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Root
app.get("/", (req, res) => {
  res.json({ ok: true, service: "koshgel" });
});

// Routes
app.use("/api", healthRoute);        // /api/health
app.use("/api/auth", authRoute);     // /api/auth/login
app.use("/api", meRoute);             // /api/me
app.use("/api", adminRoute);          // /api/admin/ping

// Server
const PORT = process.env.PORT || 10000;

async function start() {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI missing");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  }
}

start();
