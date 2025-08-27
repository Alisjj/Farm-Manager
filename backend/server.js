import express from "express";
import authRoutes from "./src/routes/auth.js";
import dailyLogsRoutes from "./src/routes/dailyLogs.js";
import housesRoutes from "./src/routes/houses.js";
import customersRoutes from "./src/routes/customers.js";
import salesRoutes from "./src/routes/sales.js";
import feedRoutes from "./src/routes/feed.js";
import costsRoutes from "./src/routes/costs.js";
import laborRoutes from "./src/routes/labor.js";
import { autoMigrate } from "./src/utils/database.js";
import errorHandler from "./src/middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/daily-logs", dailyLogsRoutes);
app.use("/api/houses", housesRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/costs", costsRoutes);
app.use("/api", laborRoutes);

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await autoMigrate();
    console.log("Automigration completed.");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start the server:", err);
  }
})();

app.use(errorHandler);
