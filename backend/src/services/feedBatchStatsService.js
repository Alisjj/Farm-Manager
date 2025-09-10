import DailyLog from "../models/DailyLog.js";
import FeedBatch from "../models/FeedBatch.js";
import { sequelize } from "../utils/database.js";

const feedBatchStatsService = {
  getBatchUsageStats: async (batchId) => {
    const batch = await FeedBatch.findByPk(batchId);
    if (!batch) {
      throw new Error("Feed batch not found");
    }

    // Get total bags used from daily logs
    const usageResult = await DailyLog.sum("feedBagsUsed", {
      where: { feedBatchId: batchId },
    });

    const totalBagsUsed = usageResult || 0;
    const remainingBags = Math.max(0, batch.totalBags - totalBagsUsed);
    const usagePercentage =
      batch.totalBags > 0 ? (totalBagsUsed / batch.totalBags) * 100 : 0;

    return {
      batchId: batch.id,
      batchName: batch.batchName,
      totalBags: batch.totalBags,
      bagsUsed: totalBagsUsed,
      remainingBags,
      usagePercentage: Math.round(usagePercentage * 100) / 100,
      isNearlyEmpty: remainingBags <= batch.totalBags * 0.1, // Less than 10% remaining
      isEmpty: remainingBags <= 0,
    };
  },

  getAllBatchUsageStats: async () => {
    const batches = await FeedBatch.findAll({
      attributes: ["id", "batchName", "totalBags", "costPerBag", "bagSizeKg"],
    });

    const statsPromises = batches.map(async (batch) => {
      const usageResult = await DailyLog.sum("feedBagsUsed", {
        where: { feedBatchId: batch.id },
      });

      const totalBagsUsed = usageResult || 0;
      const remainingBags = Math.max(0, batch.totalBags - totalBagsUsed);
      const usagePercentage =
        batch.totalBags > 0 ? (totalBagsUsed / batch.totalBags) * 100 : 0;

      return {
        batchId: batch.id,
        batchName: batch.batchName,
        totalBags: batch.totalBags,
        bagsUsed: totalBagsUsed,
        remainingBags,
        usagePercentage: Math.round(usagePercentage * 100) / 100,
        isNearlyEmpty: remainingBags <= batch.totalBags * 0.1,
        isEmpty: remainingBags <= 0,
        costPerBag: batch.costPerBag,
        bagSizeKg: batch.bagSizeKg,
      };
    });

    return await Promise.all(statsPromises);
  },
};

export default feedBatchStatsService;
