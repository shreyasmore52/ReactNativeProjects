const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // set in .env
});


async function createTables() {
  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS appuser (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        firstname VARCHAR(50),
        lastname VARCHAR(50)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES appuser(id) ON DELETE CASCADE,
        about TEXT,
        address TEXT,
        profileimg TEXT,
        profilebackimg TEXT
      );
    `);

  } catch (err) {
    console.error("Error creating tables:", err);
  }
}


createTables();

module.exports = pool;
