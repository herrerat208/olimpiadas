import request from 'supertest';
import express from 'express';
import cors from 'cors';
import authRoutes from '../src/routes/authRoutes';
import { pool } from '../src/config/db';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth API', () => {
  const email = `test_${Date.now()}@taller.com`;

  it('deberia registrar un usuario nuevo', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email, password: '123456', rol: 'admin' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(email);
  });

  it('deberia loguear con credenciales correctas', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email, password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('deberia rechazar login con password incorrecta', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email, password: 'incorrecta' });

    expect(res.status).toBe(401);
  });

  afterAll(async () => {
    await pool.end();
  });
});