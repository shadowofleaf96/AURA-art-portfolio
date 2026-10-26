import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import itemsRoutes from "./routes/items.js";
import servicesRoutes from "./routes/services.js";
import ordersRoutes from "./routes/orders.js";
import pool from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration: allows local Vite dev server and production deployments (Vercel)
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      // Allow configured client URL or any vercel.app preview domain or localhost
      if (
        origin === clientUrl ||
        origin.startsWith("http://localhost:") ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev to prevent CORS issues
    },
    credentials: true,
  }),
);

app.use(express.json());

// Request logging in development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint (for deployment monitoring on Railway/Render)
app.get("/api/health", async (req, res) => {
  try {
    const dbTest = await pool.query("SELECT NOW() as current_time;");
    res.json({
      status: "healthy",
      message: "AURA Photography API is running",
      database: "connected",
      dbTime: dbTest.rows[0].current_time,
    });
  } catch (err) {
    res.status(500).json({
      status: "unhealthy",
      message: "API running but database connection failed",
      error: err.message,
    });
  }
});

// Mount modular API routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/orders", ordersRoutes);

// 404 fallback for undefined routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found." });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`🚀 AURA API server listening on http://localhost:${PORT}`);
  console.log(
    `📡 Healthcheck available at http://localhost:${PORT}/api/health`,
  );
});
