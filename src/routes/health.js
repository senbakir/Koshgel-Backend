import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, service: "koshgel-backend" });
});

export default router;
