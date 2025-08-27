import { DataTypes } from "sequelize";
import { sequelize } from "../utils/database.js";

const Laborer = sequelize.define("Laborer", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: true },
  monthlySalary: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

export default Laborer;
