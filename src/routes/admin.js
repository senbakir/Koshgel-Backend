import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

// TEST endpoint
router.get("/ping", requireAuth, requireRole("admin"), (req, res) => {
  res.json({
    ok: true,
    message: "admin route works",
    user: req.user
  });
});

export default router;
