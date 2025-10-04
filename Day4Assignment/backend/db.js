const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

async function createTable(){

    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(100) UNIQUE,
            password VARCHAR(100),
            firstname VARCHAR(50),
            lastname VARCHAR(50)
            );
            `);
        
    }catch(e){
        console.error("Error on DB.js ->",e);
    }
}

createTable();

module.exports = pool;