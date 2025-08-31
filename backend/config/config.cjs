// Note: avoid requiring dotenv in sequelize-cli context; the CLI will use process.env when present.
const DB_NAME = process.env.DB_NAME || "farm_manager";
const DB_USER = process.env.DB_USER || "aliyusani";
const DB_PASS = process.env.DB_PASS || "aliyusani";
const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;
const DB_DIALECT = process.env.DB_DIALECT || "postgres";

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME_TEST || "database_test",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    dialect: process.env.DB_DIALECT || "sqlite",
    storage: process.env.DB_STORAGE || ":memory:",
  },
  production: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
  },
};
