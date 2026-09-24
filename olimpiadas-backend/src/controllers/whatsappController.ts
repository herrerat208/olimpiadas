import { Request, Response } from 'express';

export const generarLink = (req: Request, res: Response) => {
  const { telefono, mensaje } = req.body;

  if (!telefono || !mensaje) {
    return res.status(400).json({ error: 'Telefono y mensaje son obligatorios' });
  }

  const numeroLimpio = telefono.replace(/\D/g, '');
  const numeroConCodigo = numeroLimpio.startsWith('54') ? numeroLimpio : `54${numeroLimpio}`;
  const mensajeCodificado = encodeURIComponent(mensaje);

  const link = `https://wa.me/${numeroConCodigo}?text=${mensajeCodificado}`;

  res.json({ link });
};