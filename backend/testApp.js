import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./src/routes/auth.js";
import dailyLogsRoutes from "./src/routes/dailyLogs.js";
import housesRoutes from "./src/routes/houses.js";
import customersRoutes from "./src/routes/customers.js";
import salesRoutes from "./src/routes/sales.js";
import feedRoutes from "./src/routes/feed.js";
import costsRoutes from "./src/routes/costs.js";
import reportsRoutes from "./src/routes/reports.js";
import errorHandler from "./src/middleware/errorHandler.js";
import { autoMigrate } from "./src/utils/database.js";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/daily-logs", dailyLogsRoutes);
app.use("/api/houses", housesRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/costs", costsRoutes);
app.use("/api/reports", reportsRoutes);
app.get("/", (req, res) => res.send("test app"));
app.use(errorHandler);

(async () => {
  try {
    await autoMigrate();
  } catch (err) {
    console.error("Failed to prepare test DB", err);
  }
})();

export default app;
