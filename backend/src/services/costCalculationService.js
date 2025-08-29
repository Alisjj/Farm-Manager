import costService from "./costService.js";

// Lightweight bridge exposing the cost calculation functions referenced in
// architecture docs. Keeps a single implementation in costService while
// providing a dedicated module name for future refactors.
const costCalculationService = {
  calculateDailyCost: costService.calculateDailyCost,
  getEggPriceEstimate: costService.getEggPriceEstimate,
  updateDailyCosts: async (date) => {
    // optional helper used by some legacy code paths: compute and persist daily_costs
    const calc = await costService.calculateDailyCost(date);
    // persist into daily_costs table if model exists
    try {
      const DailyCost = (await import("../models/index.js")).DailyCost;
      if (DailyCost) {
        await DailyCost.upsert({
          cost_date: date,
          total_feed_cost: calc.feedCostPerEgg * calc.totalEggs || 0,
          total_eggs_produced: calc.totalEggs || 0,
          feed_cost_per_egg: calc.feedCostPerEgg || 0,
          fixed_cost_per_egg: calc.fixedCostPerEgg || 0,
          health_cost_per_egg: calc.healthCostPerEgg || 0,
          total_cost_per_egg: calc.totalCostPerEgg || 0,
          suggested_price_grade_a: calc.suggestedPrices?.gradeA,
          suggested_price_grade_b: calc.suggestedPrices?.gradeB,
          suggested_price_grade_c: calc.suggestedPrices?.gradeC,
        });
      }
    } catch (e) {
      // non-fatal; model may not exist or DB not migrated yet
      // console.warn("Could not persist daily cost:", e);
    }
    return calc;
  },
};

export default costCalculationService;
