import Sales from "../models/Sales.js";
import { NotFoundError, BadRequestError } from "../utils/exceptions.js";

const salesService = {
  createSale: async (data) => {
    // Ensure required fields
    if (!data.saleDate || !data.customerId) {
      throw new BadRequestError("saleDate and customerId are required");
    }

    // Accept both totalAmount or compute from grade quantities/prices
    if (!data.totalAmount) {
      const aQty = Number(data.gradeAQty || data.eggsGradeA || 0);
      const aPrice = Number(data.gradeAPrice || data.priceGradeA || 0);
      const bQty = Number(data.gradeBQty || data.eggsGradeB || 0);
      const bPrice = Number(data.gradeBPrice || data.priceGradeB || 0);
      const cQty = Number(data.gradeCQty || data.eggsGradeC || 0);
      const cPrice = Number(data.gradeCPrice || data.priceGradeC || 0);

      const computed = aQty * aPrice + bQty * bPrice + cQty * cPrice;

      // If computed is 0 and no explicit totalAmount provided, allow zero sales
      data.totalAmount = Number.isFinite(computed) ? computed : 0;
    }

    const sale = await Sales.create(data);
    return sale;
  },

  getAllSales: async (filters = {}) => {
    const where = {};

    // Filter by date
    const date = filters.date || filters.saleDate;
    if (date) {
      where.saleDate = date;
    }

    // Filter by customer
    if (filters.customer || filters.customerId) {
      const customerId = Number(filters.customer || filters.customerId);
      if (!Number.isNaN(customerId)) where.customerId = customerId;
    }

    const sales = await Sales.findAll({ where });
    return sales;
  },

  getSaleById: async (id) => {
    const sale = await Sales.findByPk(id);
    if (!sale) throw new NotFoundError("Sale not found");
    return sale;
  },

  updateSale: async (id, updates) => {
    const [updatedCount] = await Sales.update(updates, { where: { id } });
    if (!updatedCount) throw new NotFoundError("Sale not found");
    const updated = await Sales.findByPk(id);
    return updated;
  },

  deleteSale: async (id) => {
    const deleted = await Sales.destroy({ where: { id } });
    if (!deleted) throw new NotFoundError("Sale not found");
    return true;
  },
};

export default salesService;
