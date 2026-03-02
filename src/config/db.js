import mongoose from "mongoose";
import environment from "./environment.js";

const connectDB = async () => {
  try {
    await mongoose.connect(environment.mongoUri);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;