import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.js";
import dailyLogsRoutes from "./src/routes/dailyLogs.js";
import housesRoutes from "./src/routes/houses.js";
import customersRoutes from "./src/routes/customers.js";
import salesRoutes from "./src/routes/sales.js";
import feedRoutes from "./src/routes/feed.js";
import costsRoutes from "./src/routes/costs.js";
import costEntriesRoutes from "./src/routes/costEntries.js";
// import laborRoutes from "./src/routes/labor.js"; // Disabled temporarily
import reportsRoutes from "./src/routes/reports.js";
import staffRoutes from "./src/routes/staff.js";
import { autoMigrate } from "./src/utils/database.js";
import errorHandler from "./src/middleware/errorHandler.js";
import requestLogger from "./src/middleware/logger.js";
import logger from "./src/config/logger.js";
const app = express();

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Allow both possible frontend ports
    credentials: true,
  })
);

app.use(express.json());

// Request logger (prints method, url, body for mutating requests, status, and timing)
app.use(requestLogger);

app.use("/api/auth", authRoutes);
app.use("/api/daily-logs", dailyLogsRoutes);
app.use("/api/houses", housesRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/costs", costsRoutes);
app.use("/api/cost-entries", costEntriesRoutes);
// app.use("/api", laborRoutes); // Disabled temporarily
app.use("/api/reports", reportsRoutes);
app.use("/api/staff", staffRoutes);

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend API is running",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

const PORT = process.env.PORT || 5001;
(async () => {
  try {
    await autoMigrate();
    logger.info("Automigration completed.");

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
      logger.info(`Log level: ${logger.level}`);
    });
  } catch (err) {
    logger.error("Failed to start the server:", err);
  }
})();

app.use(errorHandler);
