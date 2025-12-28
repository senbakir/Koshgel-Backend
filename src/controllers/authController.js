export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Email and password required"
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User
      .findOne({ email: normalizedEmail })
      .select("+password");

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Invalid credentials"
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        ok: false,
        message: "Invalid credentials"
      });
    }

    const token = signToken(user);
    return res.json({ ok: true, token });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
};
