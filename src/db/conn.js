const mySql = require('mysql');
const { createPool } = require('mysql');

const pool = createPool({
    // port: 3000,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: process.env.DB_CON_LIM
});

module.exports = pool;