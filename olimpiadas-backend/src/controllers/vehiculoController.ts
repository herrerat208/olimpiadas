import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getVehiculos = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT v.*, c.nombre AS cliente_nombre, c.apellido AS cliente_apellido
       FROM vehiculo v JOIN cliente c ON v.cliente_id = c.id
       ORDER BY v.id`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener vehiculos' });
  }
};

export const getVehiculoById = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM vehiculo WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vehiculo no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener vehiculo' });
  }
};

export const createVehiculo = async (req: Request, res: Response) => {
  const { patente, marca, modelo, anio, cliente_id } = req.body;

  if (!patente || !marca || !modelo || !cliente_id) {
    return res.status(400).json({ error: 'Patente, marca, modelo y cliente_id son obligatorios' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO vehiculo (patente, marca, modelo, anio, cliente_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [patente, marca, modelo, anio, cliente_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear vehiculo' });
  }
};

export const updateVehiculo = async (req: Request, res: Response) => {
  const { patente, marca, modelo, anio, cliente_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE vehiculo SET patente = $1, marca = $2, modelo = $3, anio = $4, cliente_id = $5
       WHERE id = $6 RETURNING *`,
      [patente, marca, modelo, anio, cliente_id, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vehiculo no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar vehiculo' });
  }
};

export const deleteVehiculo = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('DELETE FROM vehiculo WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vehiculo no encontrado' });
    }
    res.json({ mensaje: 'Vehiculo eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar vehiculo' });
  }
};