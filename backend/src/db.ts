import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '*****' : undefined);
console.log('DB_NAME:', process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('Uspešna konekcija sa bazom!');
    conn.release();
  } catch (error) {
    console.error('Greška pri konekciji:', error);
  }
}

async function testQuery() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    console.log('Rezultat upita:', rows);
  } catch (error) {
    console.error('Greška pri upitu:', error);
  }
}

testConnection();
testQuery();

export default pool;
