import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["ceo", "manager", "cs", "worker", "employer"],
      default: "employer",
      index: true,
    },
    status: { type: String, enum: ["active", "blocked"], default: "active", index: true },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
