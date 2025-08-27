import { DataTypes } from "sequelize";
import { sequelize } from "../utils/database.js";

const FeedBatch = sequelize.define("FeedBatch", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  batchDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  batchSizeKg: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  costPerKg: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
  },
});

export default FeedBatch;
