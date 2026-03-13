import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import userRoutes from "./routes/users.js";
import analysisRoutes from "./routes/analysis.js";
import chatRoutes from "./routes/chat.js";
import aiServicesRoutes from "./routes/ai_services.route.js";
// Load environment variables
dotenv.config();
const app = express();
// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5174",
  credentials: true,
}));
app.use(express.json());
app.use(apiLimiter);
// Connect to MongoDB
connectDB();
// Health check
app.get("/", (req, res) => {
  res.json({
    message: "NexusAI API Server",
    version: "1.0.0",
    status: "running",
    docs: "/api/docs",
  });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ai", aiServicesRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    status: err.status || 500,
  });
});
// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const port = process.env.PORT || process.env.port || 3000;
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
  console.log(`📚 API Documentation: /api/docs`);
});