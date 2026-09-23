import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getClientes = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM cliente ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

export const getClienteById = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM cliente WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
};

export const createCliente = async (req: Request, res: Response) => {
  const { nombre, apellido, telefono, email, dni } = req.body;

  if (!nombre || !apellido) {
    return res.status(400).json({ error: 'Nombre y apellido son obligatorios' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO cliente (nombre, apellido, telefono, email, dni) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, apellido, telefono, email, dni]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear cliente' });
  }
};

export const updateCliente = async (req: Request, res: Response) => {
  const { nombre, apellido, telefono, email, dni } = req.body;

  try {
    const result = await pool.query(
      `UPDATE cliente SET nombre = $1, apellido = $2, telefono = $3, email = $4, dni = $5
       WHERE id = $6 RETURNING *`,
      [nombre, apellido, telefono, email, dni, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
};

export const deleteCliente = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('DELETE FROM cliente WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ mensaje: 'Cliente eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
};