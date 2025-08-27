import DailyLog from "../models/DailyLog.js";
import FeedBatch from "../models/FeedBatch.js";
import OperatingCost from "../models/OperatingCost.js";
import Payroll from "../models/Payroll.js";
import { NotFoundError, BadRequestError } from "../utils/exceptions.js";
import { Op } from "sequelize";

const costService = {
  // Helper function to get average monthly production (Design 7.1)
  getAverageMonthlyProduction: async (date) => {
    const monthKey = date.substring(0, 7); // YYYY-MM
    const parts = date.split("-");
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const daysInMonth = new Date(year, month, 0).getDate();
    
    const monthStart = monthKey + "-01";
    const monthEnd = `${monthKey}-${daysInMonth.toString().padStart(2, "0")}`;
    
    const monthlyLogs = await DailyLog.findAll({
      where: { logDate: { [Op.between]: [monthStart, monthEnd] } },
    });

    if (monthlyLogs.length === 0) return 0;

    const totalMonthlyEggs = monthlyLogs.reduce((s, l) => {
      const eggs =
        (Number(l.eggsGradeA) || 0) +
        (Number(l.eggsGradeB) || 0) +
        (Number(l.eggsGradeC) || 0);
      return s + eggs;
    }, 0);

    return totalMonthlyEggs;
  },

  // Helper function to get working days in month (excluding Sundays)
  getWorkingDaysInMonth: (date) => {
    const parts = date.split("-");
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const daysInMonth = new Date(year, month, 0).getDate();
    
    let workingDays = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = new Date(year, month - 1, day).getDay();
      if (dayOfWeek !== 0) { // 0 = Sunday
        workingDays++;
      }
    }
    return workingDays;
  },

  getDailyCosts: async (date) => {
    if (!date) throw new BadRequestError("date is required");

    // aggregate daily logs
    const logs = await DailyLog.findAll({ where: { logDate: date } });

    // coerce values (Sequelize may return DECIMAL as strings)
    const totalEggs = logs.reduce((s, l) => {
      const a = Number(l.eggsGradeA) || 0;
      const b = Number(l.eggsGradeB) || 0;
      const c = Number(l.eggsGradeC) || 0;
      return s + a + b + c;
    }, 0);

    // feed cost: sum feedConsumption * estimate price per kg from recent feed batches
    const totalFeedKg = logs.reduce(
      (s, l) => s + (Number(l.feedConsumption) || 0),
      0
    );

    let feedCost = 0;
    if (totalFeedKg > 0) {
      // approximate by using latest feed batch costPerKg
      const latestBatch = await FeedBatch.findOne({
        order: [["batchDate", "DESC"]],
      });
      const costPerKg = latestBatch ? Number(latestBatch.costPerKg) || 0 : 0;
      feedCost = totalFeedKg * costPerKg;
    }

    return {
      date,
      totalEggs,
      totalFeedKg,
      feedCost,
      feedCostPerEgg: totalEggs ? feedCost / totalEggs : 0,
    };
  },

  getSummary: async (start, end) => {
    if (!start || !end) throw new BadRequestError("start and end are required");
    const logs = await DailyLog.findAll({
      where: { logDate: { [Op.between]: [start, end] } },
    });
    const totalEggs = logs.reduce((s, l) => {
      const a = Number(l.eggsGradeA) || 0;
      const b = Number(l.eggsGradeB) || 0;
      const c = Number(l.eggsGradeC) || 0;
      return s + a + b + c;
    }, 0);
    const totalFeedKg = logs.reduce(
      (s, l) => s + (Number(l.feedConsumption) || 0),
      0
    );

    return { start, end, totalEggs, totalFeedKg };
  },

  createOperatingCosts: async (data) => {
    if (!data.monthYear) throw new BadRequestError("monthYear is required");
    // normalize month key for payroll lookup (YYYY-MM)
    const monthKey = (data.monthYear || "").toString().slice(0, 7);
    const existing = await OperatingCost.findOne({
      where: { monthYear: data.monthYear },
    });
    if (existing)
      throw new BadRequestError("Operating costs for this month already exist");

    // If totalLaborerSalaries not provided, use Payroll records for the month
    let laborSalaries = Number(data.totalLaborerSalaries || 0);
    if (!laborSalaries) {
      const payrollRows = await Payroll.findAll({
        where: { monthYear: monthKey },
      });
      laborSalaries = payrollRows.reduce(
        (s, p) => s + (Number(p.grossPay) || 0),
        0
      );
    }

    const totalMonthlyCost =
      (data.supervisorSalary || 0) +
      laborSalaries +
      (data.electricityCost || 0) +
      (data.waterCost || 0) +
      (data.maintenanceCost || 0) +
      (data.otherCosts || 0);

    const oc = await OperatingCost.create({
      ...data,
      totalLaborerSalaries: laborSalaries,
      totalMonthlyCost,
    });
    return oc;
  },

  getEggPriceEstimate: async (date) => {
    if (!date) throw new BadRequestError("date is required");

    // Get daily costs for feed
    const daily = await costService.getDailyCosts(date);
    const feedCostPerEgg = daily.feedCostPerEgg || 0;

    // Get monthly context for fixed cost distribution
    const monthKey = date.substring(0, 7); // YYYY-MM
    const monthStart = monthKey + "-01";
    const parts = date.split("-");
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const daysInMonth = new Date(year, month, 0).getDate();

    // Get average monthly production using the new helper function (Design 7.1)
    const avgMonthlyProduction = await costService.getAverageMonthlyProduction(date);
    const avgDailyProduction = avgMonthlyProduction > 0 ? avgMonthlyProduction / daysInMonth : daily.totalEggs || 1;

    // Get monthly labor costs from payroll (Design 7.3)
    const payrollRows = await Payroll.findAll({
      where: { monthYear: monthKey },
    });
    const monthlyLaborCosts = payrollRows.reduce(
      (s, p) => s + (Number(p.netPay) || 0),
      0
    );

    // Get other operating costs for the month (supervisor, utilities, etc.)
    const op = await OperatingCost.findOne({
      where: { monthYear: monthStart },
    });
    const monthlyOperatingCosts = op
      ? (Number(op.supervisorSalary) || 0) +
        (Number(op.electricityCost) || 0) +
        (Number(op.waterCost) || 0) +
        (Number(op.maintenanceCost) || 0) +
        (Number(op.otherCosts) || 0)
      : 0;

    // Calculate costs per egg based on average monthly production (Design 7.1)
    const laborCostPerEgg = avgDailyProduction > 0
      ? monthlyLaborCosts / daysInMonth / avgDailyProduction
      : 0;
    const fixedCostPerEgg = avgDailyProduction > 0
      ? monthlyOperatingCosts / daysInMonth / avgDailyProduction
      : 0;

    // Calculate health cost per egg (bird costs distributed over laying period)
    const healthCostPerEgg = await costService.calculateHealthCostPerEgg(date);

    const totalCostPerEgg =
      feedCostPerEgg + laborCostPerEgg + fixedCostPerEgg + healthCostPerEgg;

    return {
      date,
      avgMonthlyProduction,
      avgDailyProduction,
      feedCostPerEgg,
      laborCostPerEgg,
      fixedCostPerEgg,
      healthCostPerEgg,
      totalCostPerEgg,
      suggestedPrices: {
        gradeA: totalCostPerEgg * 1.25, // 25% markup
        gradeB: totalCostPerEgg * 1.2,  // 20% markup
        gradeC: totalCostPerEgg * 1.15, // 15% markup
      },
    };
  },

  // Calculate health costs per egg (bird acquisition costs distributed over laying period)
  calculateHealthCostPerEgg: async (date) => {
    // This would integrate with a bird_costs table as per design
    // For now, return 0 as placeholder
    // TODO: Implement bird cost calculation when bird_costs table is available
    return 0;
  },

  // Daily cost calculation as per Design 7.1
  calculateDailyCost: async (date) => {
    if (!date) throw new BadRequestError("date is required");

    // Get daily production data
    const dailyLogs = await DailyLog.findAll({ where: { logDate: date } });
    const totalEggs = dailyLogs.reduce((sum, log) => {
      const a = Number(log.eggsGradeA) || 0;
      const b = Number(log.eggsGradeB) || 0;
      const c = Number(log.eggsGradeC) || 0;
      return sum + a + b + c;
    }, 0);

    if (totalEggs === 0) {
      return {
        date,
        totalEggs: 0,
        feedCostPerEgg: 0,
        laborCostPerEgg: 0,
        fixedCostPerEgg: 0,
        healthCostPerEgg: 0,
        totalCostPerEgg: 0,
        suggestedPrices: { gradeA: 0, gradeB: 0, gradeC: 0 }
      };
    }

    // Calculate feed cost
    const totalFeedKg = dailyLogs.reduce(
      (sum, log) => sum + (Number(log.feedConsumption) || 0),
      0
    );

    let feedCost = 0;
    if (totalFeedKg > 0) {
      const latestBatch = await FeedBatch.findOne({
        order: [["batchDate", "DESC"]],
      });
      const costPerKg = latestBatch ? Number(latestBatch.costPerKg) || 0 : 0;
      feedCost = totalFeedKg * costPerKg;
    }
    const feedCostPerEgg = feedCost / totalEggs;

    // Calculate monthly labor cost distributed daily
    const monthKey = date.substring(0, 7); // YYYY-MM
    const parts = date.split("-");
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const daysInMonth = new Date(year, month, 0).getDate();

    const payrollRows = await Payroll.findAll({
      where: { monthYear: monthKey },
    });
    const monthlyLaborCosts = payrollRows.reduce(
      (sum, p) => sum + (Number(p.netPay) || 0),
      0
    );

    const avgDailyProduction = await costService.getAverageMonthlyProduction(date) / daysInMonth;
    const laborCostPerEgg = avgDailyProduction > 0
      ? (monthlyLaborCosts / daysInMonth) / avgDailyProduction
      : 0;

    // Calculate other fixed costs (supervisor, utilities, etc.)
    const monthStart = monthKey + "-01";
    const op = await OperatingCost.findOne({
      where: { monthYear: monthStart },
    });
    const monthlyOperatingCosts = op
      ? (Number(op.supervisorSalary) || 0) +
        (Number(op.electricityCost) || 0) +
        (Number(op.waterCost) || 0) +
        (Number(op.maintenanceCost) || 0) +
        (Number(op.otherCosts) || 0)
      : 0;

    const fixedCostPerEgg = avgDailyProduction > 0
      ? (monthlyOperatingCosts / daysInMonth) / avgDailyProduction
      : 0;

    // Calculate health costs (bird costs distributed over laying period)
    const healthCostPerEgg = await costService.calculateHealthCostPerEgg(date);

    const totalCostPerEgg = feedCostPerEgg + laborCostPerEgg + fixedCostPerEgg + healthCostPerEgg;

    return {
      date,
      totalEggs,
      feedCostPerEgg,
      laborCostPerEgg,
      fixedCostPerEgg,
      healthCostPerEgg,
      totalCostPerEgg,
      suggestedPrices: {
        gradeA: totalCostPerEgg * 1.25, // 25% markup
        gradeB: totalCostPerEgg * 1.2,  // 20% markup
        gradeC: totalCostPerEgg * 1.15, // 15% markup
      },
    };
  },
};

export default costService;
