import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.DB_PORT),
});

// Listen for connection events
pool.on('connection', (connection) => {
  console.log(`Connected to database with threadId: ${connection.threadId}`);
});

export default pool;
