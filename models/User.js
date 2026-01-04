import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    passwordHash: { type: String, required: true },

    // roles: ceo, admin, manager, supervisor, customer_service, worker, employer
    role: { type: String, default: "user", index: true },

    isActive: { type: Boolean, default: true },

    name: { type: String, default: "" },

    // worker side future fields
    phone: { type: String, default: "" },
    categories: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
