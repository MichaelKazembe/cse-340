const { Pool } = require("pg"); // imports the pg module - PostgreSQL client for Node.js
require("dotenv").config(); // loads environment variables from a .env file to store sensitive information like database credentials
/* ***************
 * Connection Pool
 * SSL Object needed for local and production environments
 * Use environment variable PGSSLMODE to control SSL usage if needed
 * *************** */
let pool;
const useSSL =
  process.env.PGSSLMODE === "require" || process.env.NODE_ENV === "production";
pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : undefined,
});

// Consistent query helper export for all environments
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      if (process.env.NODE_ENV !== "production") {
        console.log("executed query", { text });
      }
      return res;
    } catch (error) {
      console.error("error in query", { text, error: error.message });
      throw error;
    }
  },
};
