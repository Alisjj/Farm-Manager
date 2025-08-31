import express from "express";
import authRoutes from "./auth.js";
import staffRoutes from "./staff.js";
import dailyLogs from "./dailyLogs.js";
import houses from "./houses.js";
import sales from "./sales.js";
import customers from "./customers.js";
import feed from "./feed.js";
import labor from "./labor.js";
import costs from "./costs.js";
import reports from "./reports.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/staff", staffRoutes);
router.use("/daily-logs", dailyLogs);
router.use("/houses", houses);
router.use("/sales", sales);
router.use("/customers", customers);
router.use("/feed", feed);
router.use("/labor", labor);
router.use("/costs", costs);
router.use("/reports", reports);

export default router;
