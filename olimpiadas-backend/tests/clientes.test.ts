import request from 'supertest';
import express from 'express';
import cors from 'cors';
import authRoutes from '../src/routes/authRoutes';
import clienteRoutes from '../src/routes/clienteRoutes';
import { pool } from '../src/config/db';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/clientes', clienteRoutes);

describe('Clientes API', () => {
  let token: string;
  let clienteId: number;
  const email = `test_cliente_${Date.now()}@taller.com`;

  beforeAll(async () => {
    await request(app).post('/auth/register').send({ email, password: '123456', rol: 'admin' });
    const login = await request(app).post('/auth/login').send({ email, password: '123456' });
    token = login.body.token;
  });

  it('deberia rechazar el acceso sin token', async () => {
    const res = await request(app).get('/clientes');
    expect(res.status).toBe(401);
  });

  it('deberia crear un cliente con token valido', async () => {
    const res = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Test', apellido: 'Cliente', telefono: '123', email: 'test@cliente.com', dni: `${Date.now()}` });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    clienteId = res.body.id;
  });

  it('deberia listar clientes', async () => {
    const res = await request(app).get('/clientes').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deberia eliminar el cliente creado', async () => {
    const res = await request(app).delete(`/clientes/${clienteId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await pool.end();
  });
});