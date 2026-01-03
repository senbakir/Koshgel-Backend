router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ ok: false, message: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(500).json({ ok: false, message: "User password hash missing in DB" });
    }

    let ok = false;
    try {
      ok = await bcrypt.compare(password, user.password);
    } catch (e) {
      // Hash bozuk / bcrypt formatı değilse burada patlar → 401 dönelim
      console.error("BCRYPT COMPARE ERROR:", e?.message || e);
      return res.status(401).json({ ok: false, message: "Invalid credentials" });
    }

    // ✅ TERSLİK BURADA DÜZELTİLDİ
    if (!ok) {
      return res.status(401).json({ ok: false, message: "Invalid credentials" });
    }

    const secret = process.env.JWT_SECRET; // env var zaten var sende
    const token = jwt.sign(
      { _id: user._id.toString(), role: user.role },   // ✅ role eklendi
      secret,
      { expiresIn: "7d" }
    );

    return res.json({
      ok: true,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ ok: false, message: "Login failed" });
  }
});
