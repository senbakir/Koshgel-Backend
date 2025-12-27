import { register, login } from "../controllers/authController.js";

import { register } from "../controllers/authController.js";
router.post("/login", login);

const router = express.Router();

router.get("/ping", (req, res) => {
  res.json({ ok: true, route: "auth" });
});

router.post("/register", register);

export default router;
