export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ ok: false, error: "Email and password required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // IMPORTANT: select password because schema has select:false
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const match = await bcrypt.compare(String(password), user.password);
    if (!match) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const token = signToken(user);

    // password'u response'a koyma
    return res.json({
      ok: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
