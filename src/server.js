import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

// ROUTES
import healthRoute from "./routes/health.js";
import authRoute from "./routes/auth.js";
import meRoute from "./routes/me.js";
import adminRoute from "./routes/admin.js";

dotenv.config();

const app = express();

/* =====================
   MIDDLEWARES
===================== */

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN === "*" ? true : process.env.CORS_ORIGIN || true,
    credentials: true,
  })
);

// JSON parser (GET’te body crash olmasın diye güvenli)
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

app.use("/api", healthRoute);        // /api/health
app.use("/api/auth", authRoute);     // /api/auth/login
app.use("/api", meRoute);            // /api/me
app.use("/api", adminRoute);         // /api/admin/ping

/* =====================
   SERVER + DB
===================== */
const PORT = process.env.PORT || 10000;

async function start() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("❌ MONGO_URI missing");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected");
     console.log("✅ Mongo DB Name:", mongoose.connection.name);
console.log("✅ Mongo Host:", mongoose.connection.host);

  } catch (err) {
    console.error("❌ MongoDB Error:", err?.message || err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

start();
