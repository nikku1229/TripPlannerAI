const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("✅ MongoDB connected successfully");
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1);
    });

  // Handle MongoDB connection events
  mongoose.connection.on("connected", () => {
    console.log("🔌 Mongoose connected to MongoDB");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ Mongoose connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ Mongoose disconnected from MongoDB");
  });

  // Graceful shutdown
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed through app termination");
    process.exit(0);
  });
};

module.exports = connectDB;
