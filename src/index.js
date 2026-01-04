import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";   // 👈 BU SATIR
import adminRoutes from "./routes/admin.js"; // 👈 BU SATIR
import { ensureCeoUser } from "./seed/ensureCeo.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

// 👇 BUNLAR YOKSA 404 ALIRSIN
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 10000;

async function start() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  await ensureCeoUser();

  app.listen(PORT, () => console.log("Server running on port", PORT));
}

start();
