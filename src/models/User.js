import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // select:false => login sırasında password alanını özellikle select etmen gerekebilir
    password: { type: String, required: true, select: false },

    role: {
      type: String,
      enum: ["worker", "employer", "manager", "supervisor", "admin"],
      default: "worker",
    },

    categories: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare plain password with hashed password
UserSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
