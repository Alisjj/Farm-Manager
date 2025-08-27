import express from "express";
import feedController from "../controllers/feedController.js";
import {
  validateCreateFeedRecipe,
  validateCreateFeedBatch,
  validateAddBatchIngredient,
  validateId,
  handleValidation,
} from "../middleware/validation.js";

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

export default router;
