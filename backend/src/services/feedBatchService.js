import FeedBatch from "../models/FeedBatch.js";
import BatchIngredient from "../models/BatchIngredient.js";
import FeedRecipe from "../models/FeedRecipe.js";
import { NotFoundError, BadRequestError } from "../utils/exceptions.js";

const feedBatchService = {
  createFeedBatch: async (data) => {
    if (!data.batchDate || !data.batchSizeKg || !data.recipeId) {
      throw new BadRequestError(
        "batchDate, batchSizeKg, and recipeId are required"
      );
    }

    const recipe = await FeedRecipe.findByPk(data.recipeId);
    if (!recipe) {
      throw new BadRequestError("Recipe not found");
    }

    const batch = await FeedBatch.create(data);
    return batch;
  },

  getAllFeedBatches: async (filters = {}) => {
    const where = {};

    if (filters.date || filters.batchDate) {
      where.batchDate = filters.date || filters.batchDate;
    }

    if (filters.recipeId) {
      const recipeId = Number(filters.recipeId);
      if (!Number.isNaN(recipeId)) where.recipeId = recipeId;
    }

    const batches = await FeedBatch.findAll({ where });
    return batches;
  },

  getFeedBatchById: async (id) => {
    const batch = await FeedBatch.findByPk(id);
    if (!batch) throw new NotFoundError("Feed batch not found");
    return batch;
  },

  updateFeedBatch: async (id, updates) => {
    const [updatedCount] = await FeedBatch.update(updates, { where: { id } });
    if (!updatedCount) throw new NotFoundError("Feed batch not found");
    const updated = await FeedBatch.findByPk(id);
    return updated;
  },

  deleteFeedBatch: async (id) => {
    const deleted = await FeedBatch.destroy({ where: { id } });
    if (!deleted) throw new NotFoundError("Feed batch not found");
    return true;
  },

  getBatchIngredients: async (batchId) => {
    const batch = await FeedBatch.findByPk(batchId);
    if (!batch) throw new NotFoundError("Feed batch not found");

    const ingredients = await BatchIngredient.findAll({
      where: { batchId },
    });
    return ingredients;
  },

  addBatchIngredient: async (batchId, ingredientData) => {
    const batch = await FeedBatch.findByPk(batchId);
    if (!batch) throw new NotFoundError("Feed batch not found");

    if (
      !ingredientData.ingredientName ||
      !ingredientData.amountKg ||
      !ingredientData.costPerKg
    ) {
      throw new BadRequestError(
        "ingredientName, amountKg, and costPerKg are required"
      );
    }

    const totalCost = ingredientData.amountKg * ingredientData.costPerKg;

    const ingredient = await BatchIngredient.create({
      batchId,
      ...ingredientData,
      totalCost,
    });

    return ingredient;
  },
};

export default feedBatchService;
