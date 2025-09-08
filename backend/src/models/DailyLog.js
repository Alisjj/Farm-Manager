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
  eggsTotal: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
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
  crackedEggs: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  feedGivenKg: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: 0,
  },
  feedType: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  mortalityCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  supervisorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

export default DailyLog;
