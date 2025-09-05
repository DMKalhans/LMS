import pg from "pg";
import dotenv from "dotenv";

dotenv.config({});

const db = new pg.Client({
  connectionString: process.env.NEON_DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Connection error", err.stack));

export default db;
