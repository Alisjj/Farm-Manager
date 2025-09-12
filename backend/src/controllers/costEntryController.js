import costEntryService from "../services/costEntryService.js";

class CostEntryController {
  async createCostEntry(req, res) {
    try {
      const userId = req.user?.id;
      const costEntry = await costEntryService.createCostEntry(
        req.body,
        userId
      );

      res.status(201).json({
        success: true,
        message: "Cost entry created successfully",
        data: costEntry,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getCostEntries(req, res) {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        costType: req.query.costType,
        category: req.query.category,
        houseId: req.query.houseId ? parseInt(req.query.houseId) : undefined,
        createdBy: req.query.createdBy
          ? parseInt(req.query.createdBy)
          : undefined,
        minAmount: req.query.minAmount
          ? parseFloat(req.query.minAmount)
          : undefined,
        maxAmount: req.query.maxAmount
          ? parseFloat(req.query.maxAmount)
          : undefined,
      };

      const pagination = {
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 50,
      };

      const result = await costEntryService.getCostEntries(filters, pagination);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get cost entry by ID
  async getCostEntry(req, res) {
    try {
      const { id } = req.params;
      const costEntry = await costEntryService.getCostEntryById(parseInt(id));

      res.status(200).json({
        success: true,
        data: costEntry,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update cost entry
  async updateCostEntry(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const costEntry = await costEntryService.updateCostEntry(
        parseInt(id),
        req.body,
        userId
      );

      res.status(200).json({
        success: true,
        message: "Cost entry updated successfully",
        data: costEntry,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete cost entry
  async deleteCostEntry(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const result = await costEntryService.deleteCostEntry(
        parseInt(id),
        userId
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get cost summary
  async getCostSummary(req, res) {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        groupBy: req.query.groupBy || "month",
        houseId: req.query.houseId ? parseInt(req.query.houseId) : undefined,
      };

      const summary = await costEntryService.getCostSummary(filters);

      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get available cost types
  async getCostTypes(req, res) {
    try {
      const costTypes = costEntryService.getCostTypes();

      res.status(200).json({
        success: true,
        data: costTypes,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new CostEntryController();
