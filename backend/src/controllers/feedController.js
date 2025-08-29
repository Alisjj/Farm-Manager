import feedRecipeService from "../services/feedRecipeService.js";
import feedBatchService from "../services/feedBatchService.js";
import feedCostCalculator from "../services/feedCostCalculator.js";

const feedController = {
  // Recipes
  createRecipe: async (req, res, next) => {
    try {
      const recipe = await feedRecipeService.createFeedRecipe(req.body);
      res.status(201).json(recipe);
    } catch (err) {
      next(err);
    }
  },

  getAllRecipes: async (req, res, next) => {
    try {
      const recipes = await feedRecipeService.getAllFeedRecipes(req.query);
      res.json(recipes);
    } catch (err) {
      next(err);
    }
  },

  getRecipeById: async (req, res, next) => {
    try {
      const recipe = await feedRecipeService.getFeedRecipeById(req.params.id);
      res.json(recipe);
    } catch (err) {
      next(err);
    }
  },

  updateRecipe: async (req, res, next) => {
    try {
      const updated = await feedRecipeService.updateFeedRecipe(
        req.params.id,
        req.body
      );
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  deleteRecipe: async (req, res, next) => {
    try {
      await feedRecipeService.deleteFeedRecipe(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },

  // Batches
  createBatch: async (req, res, next) => {
    try {
      const batch = await feedBatchService.createFeedBatch(req.body);
      res.status(201).json(batch);
    } catch (err) {
      next(err);
    }
  },

  getAllBatches: async (req, res, next) => {
    try {
      const batches = await feedBatchService.getAllFeedBatches(req.query);
      res.json(batches);
    } catch (err) {
      next(err);
    }
  },

  getBatchById: async (req, res, next) => {
    try {
      const batch = await feedBatchService.getFeedBatchById(req.params.id);
      res.json(batch);
    } catch (err) {
      next(err);
    }
  },

  addIngredient: async (req, res, next) => {
    try {
      const ingredient = await feedBatchService.addBatchIngredient(
        req.params.id,
        req.body
      );
      res.status(201).json(ingredient);
    } catch (err) {
      next(err);
    }
  },

  getBatchIngredients: async (req, res, next) => {
    try {
      const ingredients = await feedBatchService.getBatchIngredients(
        req.params.id
      );
      res.json(ingredients);
    } catch (err) {
      next(err);
    }
  },

  estimateBatchCost: async (req, res, next) => {
    try {
      const { recipe, batchSizeKg, ingredientPrices } = req.body;
      const result = feedCostCalculator.calculateFeedBatchCost(
        recipe,
        Number(batchSizeKg),
        ingredientPrices || {}
      );
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};

export default feedController;
