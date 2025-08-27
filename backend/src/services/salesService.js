import Sales from "../models/Sales.js";
import { NotFoundError, BadRequestError } from "../utils/exceptions.js";

const salesService = {
  createSale: async (data) => {
    if (!data.saleDate || !data.customerId || !data.totalAmount) {
      throw new BadRequestError(
        "saleDate, customerId, and totalAmount are required"
      );
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
