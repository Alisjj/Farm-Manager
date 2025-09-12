import FeedBatch from "./FeedBatch.js";
import BatchIngredient from "./BatchIngredient.js";
import House from "./House.js";
import DailyLog from "./DailyLog.js";
import CostEntry from "./CostEntry.js";
import User from "./User.js";

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

// CostEntry associations
House.hasMany(CostEntry, {
  foreignKey: "houseId",
  as: "costEntries",
});

CostEntry.belongsTo(House, {
  foreignKey: "houseId",
  as: "house",
});

User.hasMany(CostEntry, {
  foreignKey: "createdBy",
  as: "costEntries",
});

CostEntry.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

export { FeedBatch, BatchIngredient, House, DailyLog, CostEntry, User };
