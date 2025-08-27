import { DataTypes } from "sequelize";
import { sequelize } from "../utils/database.js";

const DailyLog = sequelize.define("DailyLog", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  logDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  houseId: {
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
  feedConsumption: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  mortality: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default DailyLog;
