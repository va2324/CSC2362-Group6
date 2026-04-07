/**
 * PostgreSQL connection - vulnerable version
 */
require('dotenv').config();

const { Pool } = require('pg');

if(!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD){
  throw new Error('Database credentials in environment variables are required!');
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

module.exports = { pool };
