// backend/db.js
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });



const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

console.log("Connecting with:", {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

module.exports = pool;
