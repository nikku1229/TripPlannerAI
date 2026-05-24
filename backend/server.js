const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const tripRoutes = require("./routes/trip.routes");
const aiRoutes = require("./routes/ai.routes");
const weatherRoutes = require("./routes/weather.routes");

dotenv.config();

const app = express();
app.use(express.json());
connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/weather", weatherRoutes);

app.use("/", (req, res) => {
  res.send("Welcome to the Trip Planner API!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
