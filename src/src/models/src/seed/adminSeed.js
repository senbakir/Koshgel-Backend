import bcrypt from "bcryptjs";
import User from "../models/User.js";

export async function ensureAdminSeed() {
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "";
  const role = process.env.ADMIN_ROLE || "ceo";

  if (!email || !password) {
    console.warn("Admin seed skipped: ADMIN_EMAIL or ADMIN_PASSWORD missing");
    return;
  }

  const existing = await User.findOne({ email });

  if (existing) {
    // Role/status düzeltmek istersen burada normalize edebiliriz
    if (existing.role !== role || existing.status !== "active") {
      existing.role = role;
      existing.status = "active";
      await existing.save();
      console.log(`Admin updated: ${email} (${role})`);
    } else {
      console.log(`Admin exists: ${email}`);
    }
    return;
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  await User.create({
    email,
    passwordHash,
    role,
    status: "active",
  });

  console.log(`Admin created: ${email} (${role})`);
}
