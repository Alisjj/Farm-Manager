const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    // Drop the old feed-related tables
    await queryInterface.dropTable("batch_ingredients");
    await queryInterface.dropTable("feed_batches");
    await queryInterface.dropTable("feed_recipes");

    // Create new feed_batches table with flexible design
    await queryInterface.createTable("feed_batches", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      batch_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      batch_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      total_quantity_tons: {
        type: DataTypes.DECIMAL(8, 3),
        allowNull: false,
      },
      bag_size_kg: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
        defaultValue: 50.0,
      },
      total_bags: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_cost: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      cost_per_bag: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      cost_per_kg: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });

    // Create new batch_ingredients table
    await queryInterface.createTable("batch_ingredients", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      batch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "feed_batches",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      ingredient_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      quantity_kg: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
      },
      total_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      cost_per_kg: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
      },
      supplier: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    // Drop new tables
    await queryInterface.dropTable("batch_ingredients");
    await queryInterface.dropTable("feed_batches");

    // Recreate old tables (basic recreation for rollback)
    await queryInterface.createTable("feed_recipes", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      recipe_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      corn_percent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      soybean_percent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      wheat_bran_percent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      limestone_percent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      other_ingredients: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });

    await queryInterface.createTable("feed_batches", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      batch_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      batch_size_kg: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
      },
      recipe_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "feed_recipes",
          key: "id",
        },
      },
      total_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      cost_per_kg: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });

    await queryInterface.createTable("batch_ingredients", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      batch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "feed_batches",
          key: "id",
        },
      },
      ingredient_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      amount_kg: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
      },
      cost_per_kg: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
      },
      total_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  },
};
