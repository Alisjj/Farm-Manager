import express from "express";
import feedController from "../controllers/feedController.js";
import {
  validateCreateFeedBatch,
  validateAddBatchIngredient,
  validateId,
  handleValidation,
} from "../middleware/validation.js";
import { validateBatchCostCalculation } from "../validations/feed.js";
import { param } from "express-validator";

const validateBatchAndIngredientIds = [
  param("batchId")
    .isInt({ min: 1 })
    .withMessage("batchId must be a positive integer"),
  param("ingredientId")
    .isInt({ min: 1 })
    .withMessage("ingredientId must be a positive integer"),
];

const router = express.Router();

// Batches
router.post(
  "/batches",
  validateCreateFeedBatch,
  handleValidation,
  feedController.createBatch
);
router.get("/batches", feedController.getAllBatches);
router.get(
  "/batches/:id",
  validateId,
  handleValidation,
  feedController.getBatchById
);
router.put(
  "/batches/:id",
  validateId,
  handleValidation,
  feedController.updateBatch
);
router.delete(
  "/batches/:id",
  validateId,
  handleValidation,
  feedController.deleteBatch
);

// Batch ingredients
router.post(
  "/batches/:id/ingredients",
  validateAddBatchIngredient,
  handleValidation,
  feedController.addIngredient
);
router.get(
  "/batches/:id/ingredients",
  validateId,
  handleValidation,
  feedController.getBatchIngredients
);
router.put(
  "/batches/:batchId/ingredients/:ingredientId",
  validateBatchAndIngredientIds,
  handleValidation,
  feedController.updateIngredient
);
router.delete(
  "/batches/:batchId/ingredients/:ingredientId",
  validateBatchAndIngredientIds,
  handleValidation,
  feedController.deleteIngredient
);

// Calculate batch cost without creating
router.post(
  "/batches/calculate-cost",
  validateBatchCostCalculation,
  handleValidation,
  feedController.calculateBatchCost
);

// Batch usage statistics
router.get("/batches-usage", feedController.getBatchUsageStats);
router.get(
  "/batches/:id/usage",
  validateId,
  handleValidation,
  feedController.getBatchUsageById
);

export default router;
