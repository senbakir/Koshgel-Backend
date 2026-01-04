import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) throw new Error("MONGO_URI is missing");

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri, {
    // mongoose v7+ için extra options gerekmez
  });

  console.log("MongoDB connected");
}
