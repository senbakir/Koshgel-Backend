router.get(
  "/admin/ping",
  requireAuth,
  requireRole("admin", "ceo", "manager"),
  (req, res) => {
    res.json({ ok: true, route: "admin", user: req.user });
  }
);
