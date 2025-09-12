import express from "express";
import costEntryController from "../controllers/costEntryController.js";
import { authenticate } from "../middleware/auth.js";
import {
  validateCostEntry,
  validateCostEntryUpdate,
} from "../validations/costEntryValidation.js";

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

router.get("/types", costEntryController.getCostTypes);

router.get("/summary", costEntryController.getCostSummary);

router.get("/", costEntryController.getCostEntries);

router.get("/:id", costEntryController.getCostEntry);

router.post("/", validateCostEntry, costEntryController.createCostEntry);

router.put(
  "/:id",
  validateCostEntryUpdate,
  costEntryController.updateCostEntry
);

router.delete("/:id", costEntryController.deleteCostEntry);

export default router;
