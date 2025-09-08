import FeedBatch from "./FeedBatch.js";
import BatchIngredient from "./BatchIngredient.js";

// Set up associations
FeedBatch.hasMany(BatchIngredient, {
  foreignKey: "batchId",
  as: "ingredients",
});

BatchIngredient.belongsTo(FeedBatch, {
  foreignKey: "batchId",
  as: "batch",
});

export { FeedBatch, BatchIngredient };
