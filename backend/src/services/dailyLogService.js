import DailyLog from "../models/DailyLog.js";
import { NotFoundError, BadRequestError } from "../utils/exceptions.js";

const dailyLogService = {
  createDailyLog: async (data) => {
    if (!data.logDate || !data.houseId) {
      throw new BadRequestError("logDate and houseId are required");
    }

    const created = await DailyLog.create(data);
    return created;
  },

  getAllDailyLogs: async (filters = {}) => {
    const where = {};
    const date = filters.date || filters.logDate;
    if (date) {
      where.logDate = date;
    }

    if (filters.houseId) {
      const hid = Number(filters.houseId);
      if (!Number.isNaN(hid)) where.houseId = hid;
    }

    const logs = await DailyLog.findAll({ where });
    return logs;
  },

  getDailyLogById: async (id) => {
    const log = await DailyLog.findByPk(id);
    if (!log) throw new NotFoundError("Daily log not found");
    return log;
  },

  updateDailyLog: async (id, updates) => {
    const [updatedCount] = await DailyLog.update(updates, { where: { id } });
    if (!updatedCount) throw new NotFoundError("Daily log not found");
    const updated = await DailyLog.findByPk(id);
    return updated;
  },

  deleteDailyLog: async (id) => {
    const deleted = await DailyLog.destroy({ where: { id } });
    if (!deleted) throw new NotFoundError("Daily log not found");
    return true;
  },
};

export default dailyLogService;
