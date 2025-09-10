import FeedBatch from "./FeedBatch.js";
import BatchIngredient from "./BatchIngredient.js";
import House from "./House.js";
import DailyLog from "./DailyLog.js";

// Feed-related associations
FeedBatch.hasMany(BatchIngredient, {
  foreignKey: "batchId",
  as: "ingredients",
});

BatchIngredient.belongsTo(FeedBatch, {
  foreignKey: "batchId",
  as: "batch",
});

// FeedBatch-DailyLog associations
FeedBatch.hasMany(DailyLog, {
  foreignKey: "feedBatchId",
  as: "dailyLogs",
});

DailyLog.belongsTo(FeedBatch, {
  foreignKey: "feedBatchId",
  as: "FeedBatch",
});

// House-DailyLog associations
House.hasMany(DailyLog, {
  foreignKey: "houseId",
  as: "dailyLogs",
});

DailyLog.belongsTo(House, {
  foreignKey: "houseId",
  as: "House",
});

export { FeedBatch, BatchIngredient, House, DailyLog };
