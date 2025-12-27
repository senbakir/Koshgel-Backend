import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoute from "./routes/auth.js";
import healthRoute from "./routes/health.js";
import meRoute from "./routes/me.js";
import adminRoute from "./routes/admin.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Root
app.get("/", (req, res) => {
  res.json({ message: "Koshgel API Running" });
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api", healthRoute);
app.use("/api", meRoute);
app.use("/api", adminRoute);

// Mongo
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
