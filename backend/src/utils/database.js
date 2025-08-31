import { Sequelize } from "sequelize";
import fs from "fs";
import path from "path";

const DB_NAME = process.env.DB_NAME || "farm_manager";
const DB_USER = process.env.DB_USER || "aliyusani";
const DB_PASS = process.env.DB_PASS || "aliyusani";
const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;
const DB_DIALECT = process.env.DB_DIALECT || "postgres";
const LOG_SQL = process.env.DB_LOG === "true" || false;

let sequelize;
if (DB_DIALECT === "sqlite") {
  const DB_STORAGE = process.env.DB_STORAGE || ":memory:";
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: DB_STORAGE,
    logging: LOG_SQL ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: true,
      timestamps: true,
    },
  });
} else {
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
    logging: LOG_SQL ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: true,
      timestamps: true,
    },
  });
}

export async function connect() {
  try {
    await sequelize.authenticate();
    if (process.env.NODE_ENV !== "test") {
      console.log("Database connected successfully.");
    }
    return true;
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
}

export function close() {
  return sequelize.close();
}

export function initModels(modelsDir = path.join(__dirname, "..", "models")) {
  const models = {};
  if (!fs.existsSync(modelsDir)) return models;

  fs.readdirSync(modelsDir)
    .filter((f) => f.endsWith(".js"))
    .forEach((file) => {
      const modelPath = path.join(modelsDir, file);
      const model = require(modelPath)(sequelize, Sequelize.DataTypes);
      models[model.name] = model;
    });

  Object.values(models)
    .filter((m) => typeof m.associate === "function")
    .forEach((m) => m.associate(models));

  return models;
}

export async function autoMigrate() {
  try {
    if (process.env.USE_MIGRATIONS === "true") {
      try {
        const { execSync } = await import("child_process");
        if (process.env.NODE_ENV !== "test") {
          console.log("Running migrations via sequelize-cli...");
        }
        execSync("npx sequelize db:migrate", { stdio: "inherit" });
        if (process.env.NODE_ENV !== "test") {
          console.log("Migrations completed.");
        }
        return;
      } catch (mErr) {
        console.error("Failed to run sequelize migrations:", mErr);
      }
    }

    await sequelize.sync({ alter: true });
    // Database synchronized successfully (logging disabled for tests)
  } catch (err) {
    console.error("Database synchronization failed:", err);
    throw err;
  }
}

export { sequelize, Sequelize };
