import express from "express";
const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "koshgel",
    status: "healthy",
    time: new Date()
  });
});

export default router;
