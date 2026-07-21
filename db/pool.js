require("dotenv").config();
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || process.env.DEV_DB_URL;

if (!connectionString) {
  console.error("pool: no database connection string found");
  process.exit(1);
}

const isProduction = !connectionString.includes("localhost");

module.exports = new Pool({
  connectionString: connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});
