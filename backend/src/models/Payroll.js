import { DataTypes } from "sequelize";
import { sequelize } from "../utils/database.js";

const Payroll = sequelize.define("Payroll", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  monthYear: { type: DataTypes.STRING, allowNull: false }, // e.g., 2025-08
  laborerId: { type: DataTypes.INTEGER, allowNull: false },
  grossPay: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  },
  deductions: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  },
  netPay: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
});

export default Payroll;
