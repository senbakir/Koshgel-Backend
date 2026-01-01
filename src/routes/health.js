import { Router } from "express";

const router = Router();

// GET /api/health
router.get("/health", (req, res) => {
  res.json({ ok: true, service: "koshgel", status: "healthy" });
});

export default router;
