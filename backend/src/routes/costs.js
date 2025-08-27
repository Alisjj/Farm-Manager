import express from "express";
import costController from "../controllers/costController.js";
import { param, query, body } from "express-validator";
import { handleValidation } from "../middleware/validation.js";

const router = express.Router();

router.get(
  "/daily/:date",
  [
    param("date").isISO8601().withMessage("date must be YYYY-MM-DD"),
    handleValidation,
  ],
  costController.getDaily
);

router.get(
  "/summary",
  [
    query("start").isISO8601().withMessage("start is required"),
    query("end").isISO8601().withMessage("end is required"),
    handleValidation,
  ],
  costController.getSummary
);

router.post(
  "/operating",
  [
    body("monthYear")
      .isISO8601()
      .withMessage("monthYear is required (YYYY-MM-DD)"),
    handleValidation,
  ],
  costController.createOperating
);

router.get(
  "/egg-price/:date",
  [
    param("date").isISO8601().withMessage("date must be YYYY-MM-DD"),
    handleValidation,
  ],
  costController.getEggPrice
);

// Daily cost calculation as per Design 7.1
router.get(
  "/daily-calculation/:date",
  [
    param("date").isISO8601().withMessage("date must be YYYY-MM-DD"),
    handleValidation,
  ],
  costController.getDailyCalculation
);

// Get average monthly production
router.get(
  "/avg-production/:date",
  [
    param("date").isISO8601().withMessage("date must be YYYY-MM-DD"),
    handleValidation,
  ],
  costController.getAverageMonthlyProduction
);

export default router;
