import express from "express";
import cors from "cors";

import { connectDB } from "./db.js";

// Routes (bunlar doğru yerde: src/routes)
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";

// ✅ DİKKAT: Model/seed klasörü sende src/src/ altında
// Eğer ensureCeo.js sende yoksa bu kısmı yorum satırı yap (aşağıda not var)
import { ensureCeoUser } from "./src/seed/ensureCeo.js";

const app = express();

app.use(cors());
app.use(express.json());

// Health
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 10000;

async function start() {
  try {
    await connectDB();

    // ✅ Eğer ensureCeo.js yoksa burayı yorum satırı yap
    await ensureCeoUser();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Your service is live 🚀");
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

start();
