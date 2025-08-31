import express from "express";
import feedController from "../controllers/feedController.js";
import {
  validateCreateFeedRecipe,
  validateCreateFeedBatch,
  validateAddBatchIngredient,
  validateId,
  handleValidation,
} from "../middleware/validation.js";
import { validateFeedEstimate } from "../validations/feed.js";

const router = express.Router();

// Recipes
router.post(
  "/recipes",
  validateCreateFeedRecipe,
  handleValidation,
  feedController.createRecipe
);
router.get("/recipes", feedController.getAllRecipes);
router.get("/recipes/:id", feedController.getRecipeById);
router.put("/recipes/:id", feedController.updateRecipe);
router.delete("/recipes/:id", feedController.deleteRecipe);

// Batches
router.post(
  "/batches",
  validateCreateFeedBatch,
  handleValidation,
  feedController.createBatch
);
router.get("/batches", feedController.getAllBatches);
router.get("/batches/:id", feedController.getBatchById);
router.put("/batches/:id", feedController.updateBatch);
router.delete("/batches/:id", feedController.deleteBatch);

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
router.delete(
  "/batches/:id/ingredients/:ingredientId",
  validateId,
  handleValidation,
  feedController.deleteIngredient
);

// Estimate batch cost without creating
router.post(
  "/batches/estimate",
  validateFeedEstimate,
  handleValidation,
  feedController.estimateBatchCost
);

export default router;
