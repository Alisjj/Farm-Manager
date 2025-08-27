import { DataTypes } from "sequelize";
import { sequelize } from "../utils/database.js";

const Sales = sequelize.define("Sales", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  saleDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  eggsGradeA: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  eggsGradeB: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  eggsGradeC: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  priceGradeA: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  priceGradeB: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  priceGradeC: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM("Cash", "Transfer", "Check"),
    defaultValue: "Cash",
  },
  paymentStatus: {
    type: DataTypes.ENUM("Paid", "Pending", "Partial"),
    defaultValue: "Pending",
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default Sales;
