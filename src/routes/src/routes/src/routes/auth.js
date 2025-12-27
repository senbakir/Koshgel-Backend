import express from "express";
import { register } from "../controllers/authController.js";

const router = express.Router();

router.get("/ping", (req, res) => res.json({ ok: true, route: "auth" }));
router.post("/register", register);

export default router;
