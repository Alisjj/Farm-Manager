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
  gradeAQty: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  gradeAPrice: {
    type: DataTypes.DECIMAL(8, 2),
    defaultValue: 0,
  },
  gradeBQty: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  gradeBPrice: {
    type: DataTypes.DECIMAL(8, 2),
    defaultValue: 0,
  },
  gradeCQty: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  gradeCPrice: {
    type: DataTypes.DECIMAL(8, 2),
    defaultValue: 0,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM("cash", "transfer", "check"),
    allowNull: false,
    defaultValue: "cash",
  },
  paymentStatus: {
    type: DataTypes.ENUM("paid", "pending"),
    allowNull: false,
    defaultValue: "pending",
  },
  supervisorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

export default Sales;
