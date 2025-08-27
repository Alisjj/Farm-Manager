import costService from "../services/costService.js";

const costController = {
  getDaily: async (req, res, next) => {
    try {
      const date = req.params.date || req.query.date;
      const data = await costService.getDailyCosts(date);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  getSummary: async (req, res, next) => {
    try {
      const { start, end } = req.query;
      const data = await costService.getSummary(start, end);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  createOperating: async (req, res, next) => {
    try {
      const oc = await costService.createOperatingCosts(req.body);
      res.status(201).json(oc);
    } catch (err) {
      next(err);
    }
  },

  getEggPrice: async (req, res, next) => {
    try {
      const date = req.params.date;
      const price = await costService.getEggPriceEstimate(date);
      res.json(price);
    } catch (err) {
      next(err);
    }
  },

  // Daily cost calculation as per Design 7.1
  getDailyCalculation: async (req, res, next) => {
    try {
      const date = req.params.date;
      const calculation = await costService.calculateDailyCost(date);
      res.json(calculation);
    } catch (err) {
      next(err);
    }
  },

  // Get average monthly production
  getAverageMonthlyProduction: async (req, res, next) => {
    try {
      const date = req.params.date;
      const production = await costService.getAverageMonthlyProduction(date);
      res.json({ date, avgMonthlyProduction: production });
    } catch (err) {
      next(err);
    }
  },
};

export default costController;
