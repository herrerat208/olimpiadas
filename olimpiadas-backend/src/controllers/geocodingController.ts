import { Request, Response } from 'express';

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

const NOMINATIM_URL = process.env.NOMINATIM_URL || 'https://nominatim.openstreetmap.org/search';

export const geocodeAddress = async (req: Request, res: Response) => {
  const address = typeof req.query.address === 'string' ? req.query.address.trim() : '';

  if (!address) {
    return res.status(400).json({ error: 'La dirección es obligatoria' });
  }

  const params = new URLSearchParams({
    q: address,
    format: 'jsonv2',
    limit: '1',
    addressdetails: '1',
  });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'GestorTallerMecanico/1.0 (olimpiada-institucional)',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'El servicio de mapas no está disponible' });
    }

    const results = (await response.json()) as NominatimResult[];
    if (results.length === 0) {
      return res.status(404).json({ error: 'No se encontró la dirección' });
    }

    const [result] = results;
    return res.json({
      latitud: Number(result.lat),
      longitud: Number(result.lon),
      displayName: result.display_name,
      mapaUrl: `https://www.openstreetmap.org/?mlat=${result.lat}&mlon=${result.lon}#map=18/${result.lat}/${result.lon}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al consultar Nominatim:', message);
    return res.status(502).json({ error: 'No se pudo consultar el servicio de mapas' });
  } finally {
    clearTimeout(timeout);
  }
};
