import { DataTypes } from "sequelize";
import { sequelize } from "../utils/database.js";

const BatchIngredient = sequelize.define(
  "BatchIngredient",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    batchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "batch_id",
    },
    ingredientName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "ingredient_name",
    },
    quantityKg: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      field: "quantity_kg",
    },
    totalCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "total_cost",
    },
    costPerKg: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      field: "cost_per_kg",
    },
    supplier: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "batch_ingredients",
    underscored: true,
  }
);

export default BatchIngredient;
