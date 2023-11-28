require('dotenv').config();
const mysql = require('mysql2/promise');

const POOL = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const poolConnection = async () => {
  try {
    const connection = await POOL.getConnection();

    const sessionTimezone = 'Asia/Taipei';
    await connection.query(`SET time_zone = '${sessionTimezone}'`);

    return connection;
  } catch (err) {
    console.error('connecting failed');
    throw err;
  }
};

module.exports = poolConnection;