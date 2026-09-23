import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/db';
import authRoutes from './routes/authRoutes';
import clienteRoutes from './routes/clienteRoutes';
import vehiculoRoutes from './routes/vehiculoRoutes';
import geocodingRoutes from './routes/geocodingRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/clientes', clienteRoutes);
app.use('/vehiculos', vehiculoRoutes);
app.use('/geocoding', geocodingRoutes);

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});