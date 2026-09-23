import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 5432,
});

pool.connect()
  .then((client) => {
    console.log('Conectado a PostgreSQL');
    client.release();
  })
  .catch((err) => console.error('Error de conexion a PostgreSQL:', err));