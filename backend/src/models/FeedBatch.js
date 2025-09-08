import { DataTypes } from "sequelize";
import { sequelize } from "../utils/database.js";

const FeedBatch = sequelize.define(
  "FeedBatch",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    batchDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "batch_date",
    },
    batchName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "batch_name",
    },
    totalQuantityTons: {
      type: DataTypes.DECIMAL(8, 3),
      allowNull: false,
      field: "total_quantity_tons",
    },
    bagSizeKg: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
      defaultValue: 50.0,
      field: "bag_size_kg",
    },
    totalBags: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "total_bags",
    },
    totalCost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: "total_cost",
    },
    costPerBag: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "cost_per_bag",
    },
    costPerKg: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      field: "cost_per_kg",
    },
  },
  {
    tableName: "feed_batches",
    underscored: true,
  }
);

export default FeedBatch;
