"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Users
    await queryInterface.createTable("users", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING(255), allowNull: false },
      role: { type: Sequelize.STRING(20), allowNull: false },
      full_name: { type: Sequelize.STRING(100), allowNull: false },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });

    // Houses
    await queryInterface.createTable("houses", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      house_name: { type: Sequelize.STRING(50), allowNull: false },
      capacity: { type: Sequelize.INTEGER, allowNull: false },
      current_bird_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      location: { type: Sequelize.STRING(100) },
      description: { type: Sequelize.TEXT },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Daily logs
    await queryInterface.createTable("daily_logs", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      log_date: { type: Sequelize.DATEONLY, allowNull: false },
      house_id: { type: Sequelize.INTEGER, allowNull: false },
      eggs_total: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      eggs_grade_a: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      eggs_grade_b: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      eggs_grade_c: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      feed_given_kg: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false,
        defaultValue: 0,
      },
      mortality_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      notes: { type: Sequelize.TEXT },
      supervisor_id: { type: Sequelize.INTEGER },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Customers
    await queryInterface.createTable("customers", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      customer_name: { type: Sequelize.STRING(100), allowNull: false },
      phone: { type: Sequelize.STRING(20) },
      email: { type: Sequelize.STRING(100) },
      address: { type: Sequelize.TEXT },
      preferred_contact: { type: Sequelize.STRING(20), defaultValue: "phone" },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });

    // Sales
    await queryInterface.createTable("sales", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      sale_date: { type: Sequelize.DATEONLY, allowNull: false },
      customer_id: { type: Sequelize.INTEGER, allowNull: false },
      grade_a_qty: { type: Sequelize.INTEGER, defaultValue: 0 },
      grade_a_price: { type: Sequelize.DECIMAL(8, 2), defaultValue: 0 },
      grade_b_qty: { type: Sequelize.INTEGER, defaultValue: 0 },
      grade_b_price: { type: Sequelize.DECIMAL(8, 2), defaultValue: 0 },
      grade_c_qty: { type: Sequelize.INTEGER, defaultValue: 0 },
      grade_c_price: { type: Sequelize.DECIMAL(8, 2), defaultValue: 0 },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.ENUM("cash", "transfer", "check"),
        allowNull: false,
        defaultValue: "cash",
      },
      payment_status: {
        type: Sequelize.ENUM("paid", "pending"),
        allowNull: false,
        defaultValue: "pending",
      },
      supervisor_id: { type: Sequelize.INTEGER },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Feed recipes
    await queryInterface.createTable("feed_recipes", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      recipe_name: { type: Sequelize.STRING(100), allowNull: false },
      corn_percent: { type: Sequelize.DECIMAL(5, 2), allowNull: false },
      soybean_percent: { type: Sequelize.DECIMAL(5, 2), allowNull: false },
      wheat_bran_percent: { type: Sequelize.DECIMAL(5, 2), allowNull: false },
      limestone_percent: { type: Sequelize.DECIMAL(5, 2), allowNull: false },
      other_ingredients: { type: Sequelize.JSONB },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Feed batches
    await queryInterface.createTable("feed_batches", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      batch_date: { type: Sequelize.DATEONLY, allowNull: false },
      batch_size_kg: { type: Sequelize.DECIMAL(8, 2), allowNull: false },
      recipe_id: { type: Sequelize.INTEGER },
      total_cost: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      cost_per_kg: { type: Sequelize.DECIMAL(8, 2), allowNull: false },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Batch ingredients
    await queryInterface.createTable("batch_ingredients", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      batch_id: { type: Sequelize.INTEGER },
      ingredient_name: { type: Sequelize.STRING(50), allowNull: false },
      amount_kg: { type: Sequelize.DECIMAL(8, 2), allowNull: false },
      cost_per_kg: { type: Sequelize.DECIMAL(8, 2), allowNull: false },
      total_cost: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
    });

    // Laborers
    await queryInterface.createTable("laborers", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      employee_id: { type: Sequelize.STRING(20), unique: true },
      full_name: { type: Sequelize.STRING(100), allowNull: false },
      phone: { type: Sequelize.STRING(20) },
      address: { type: Sequelize.TEXT },
      position: { type: Sequelize.STRING(50), allowNull: false },
      monthly_salary: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      hire_date: { type: Sequelize.DATEONLY },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      emergency_contact: { type: Sequelize.STRING(100) },
      emergency_phone: { type: Sequelize.STRING(20) },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Work assignments
    await queryInterface.createTable("work_assignments", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      work_date: { type: Sequelize.DATEONLY, allowNull: false },
      laborer_id: { type: Sequelize.INTEGER },
      tasks_assigned: { type: Sequelize.ARRAY(Sequelize.TEXT) },
      attendance_status: {
        type: Sequelize.STRING(20),
        defaultValue: "present",
      },
      performance_notes: { type: Sequelize.TEXT },
      supervisor_id: { type: Sequelize.INTEGER },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Payroll
    await queryInterface.createTable("payrolls", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      month_year: { type: Sequelize.STRING(7), allowNull: false },
      laborer_id: { type: Sequelize.INTEGER, allowNull: false },
      base_salary: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      days_worked: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      days_absent: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      salary_deductions: { type: Sequelize.DECIMAL(8, 2), defaultValue: 0 },
      bonus_amount: { type: Sequelize.DECIMAL(8, 2), defaultValue: 0 },
      final_salary: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      payment_date: { type: Sequelize.DATEONLY },
      payment_status: {
        type: Sequelize.ENUM("pending", "paid"),
        defaultValue: "pending",
      },
      notes: { type: Sequelize.TEXT },
    });

    // Operating costs
    await queryInterface.createTable("operating_costs", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      month_year: { type: Sequelize.DATEONLY, allowNull: false },
      supervisor_salary: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      total_laborer_salaries: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      electricity_cost: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      water_cost: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      maintenance_cost: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      other_costs: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      total_monthly_cost: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
    });

    // Bird costs
    await queryInterface.createTable("bird_costs", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      batch_date: { type: Sequelize.DATEONLY, allowNull: false },
      birds_purchased: { type: Sequelize.INTEGER, allowNull: false },
      cost_per_bird: { type: Sequelize.DECIMAL(8, 2), allowNull: false },
      vaccination_cost_per_bird: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false,
        defaultValue: 0,
      },
      expected_laying_months: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 12,
      },
    });

    // Daily costs
    await queryInterface.createTable("daily_costs", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      cost_date: { type: Sequelize.DATEONLY, allowNull: false, unique: true },
      total_feed_cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total_eggs_produced: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      feed_cost_per_egg: {
        type: Sequelize.DECIMAL(8, 4),
        allowNull: false,
        defaultValue: 0,
      },
      fixed_cost_per_egg: {
        type: Sequelize.DECIMAL(8, 4),
        allowNull: false,
        defaultValue: 0,
      },
      health_cost_per_egg: { type: Sequelize.DECIMAL(8, 4), defaultValue: 0 },
      total_cost_per_egg: {
        type: Sequelize.DECIMAL(8, 4),
        allowNull: false,
        defaultValue: 0,
      },
      suggested_price_grade_a: { type: Sequelize.DECIMAL(8, 2) },
      suggested_price_grade_b: { type: Sequelize.DECIMAL(8, 2) },
      suggested_price_grade_c: { type: Sequelize.DECIMAL(8, 2) },
      calculated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface /* , Sequelize */) {
    // Drop tables in reverse order
    await queryInterface.dropTable("daily_costs");
    await queryInterface.dropTable("bird_costs");
    await queryInterface.dropTable("operating_costs");
    await queryInterface.dropTable("payrolls");
    await queryInterface.dropTable("work_assignments");
    await queryInterface.dropTable("laborers");
    await queryInterface.dropTable("batch_ingredients");
    await queryInterface.dropTable("feed_batches");
    await queryInterface.dropTable("feed_recipes");
    await queryInterface.dropTable("sales");
    await queryInterface.dropTable("customers");
    await queryInterface.dropTable("daily_logs");
    await queryInterface.dropTable("houses");
    await queryInterface.dropTable("users");
  },
};
