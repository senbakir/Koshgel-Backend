import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

// Routes
import healthRoute from "./src/routes/health.js";
import authRoute from "./src/routes/auth.js";
import meRoute from "./src/routes/me.js";
import adminRoute from "./src/routes/admin.js";

dotenv.config();

const app = express();

/* =====================
   MIDDLEWARES
===================== */

// CORS
app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN === "*"
        ? true
        : process.env.CORS_ORIGIN || true,
    credentials: true,
  })
);

// 🔴 KRİTİK: JSON parser (GET body crash fix)
app.use((req, res, next) => {
  if (req.method === "GET") return next();
  express.json({ limit: "1mb", strict: true })(req, res, next);
});

// Logger
app.use(morgan("dev"));

/* =====================
   ROUTES
===================== */

app.get("/", (req, res) => {
  res.json({ ok: true, service: "koshgel" });
});

app.use("/api", healthRoute);       // /api/health
app.use("/api/auth", authRoute);    // /api/auth/login
app.use("/api", meRoute);           // /api/me
app.use("/api", adminRoute);        // /api/admin/ping

/* =====================
   SERVER + DB
===================== */

const PORT = process.env.PORT || 10000;

async function start() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    co
