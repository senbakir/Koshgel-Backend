import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["worker", "employer", "admin"], required: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true, index: true },
    passwordHash: { type: String, required: true },

    workerProfile: {
      categories: [{ type: String }],
      isVerified: { type: Boolean, default: false }
    },

    employerProfile: {
      companyName: { type: String, trim: true }
    }
  },
  { timestamps: true }
);

// email veya phone zorunlu
UserSchema.pre("validate", function (next) {
  if (!this.email && !this.phone) return next(new Error("Email or phone is required"));
  next();
});

// Unique (boş değerleri unique sayma)
UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ phone: 1 }, { unique: true, sparse: true });

export default mongoose.model("User", UserSchema);
