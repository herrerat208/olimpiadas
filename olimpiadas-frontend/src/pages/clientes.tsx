import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import api from '../api/axios';

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  dni: string;
}

interface Ubicacion {
  latitud: number;
  longitud: number;
  displayName: string;
  mapaUrl: string;
}

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState({ nombre: '', apellido: '', telefono: '', email: '', dni: '' });
  const [error, setError] = useState('');

  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<Ubicacion | null>(null);
  const [mapError, setMapError] = useState('');
  const [searching, setSearching] = useState(false);

  const cargarClientes = async () => {
    try {
      const res = await api.get('/clientes');
      setClientes(res.data);
    } catch {
      setError('No se pudieron cargar los clientes.');
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.nombre.trim() || !form.apellido.trim()) {
      setError('Nombre y apellido son obligatorios.');
      return;
    }
    if (form.dni && (form.dni.length < 7 || form.dni.length > 8)) {
      setError('El DNI debe tener 7 u 8 digitos.');
      return;
    }
    if (form.telefono && form.telefono.length < 6) {
      setError('El telefono debe tener al menos 6 digitos.');
      return;
    }

    try {
      await api.post('/clientes', form);
      setForm({ nombre: '', apellido: '', telefono: '', email: '', dni: '' });
      cargarClientes();
    } catch {
      setError('No se pudo crear el cliente.');
    }
  };

  const eliminar = async (id: number) => {
    await api.delete(`/clientes/${id}`);
    cargarClientes();
  };

  const notificarWhatsapp = async (cliente: Cliente) => {
    try {
      const res = await api.post('/whatsapp/generar-link', {
        telefono: cliente.telefono,
        mensaje: `Hola ${cliente.nombre}, te escribimos desde el taller mecanico.`,
      });
      window.open(res.data.link, '_blank');
    } catch {
      setError('No se pudo generar el link de WhatsApp.');
    }
  };

  const buscarDireccion = async (e: FormEvent) => {
    e.preventDefault();
    setMapError('');
    setLocation(null);
    setSearching(true);

    try {
      const res = await api.get('/geocoding/search', { params: { address } });
      setLocation(res.data);
    } catch {
      setMapError('No se encontro la direccion.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div style={styles.page}>
      <div className="page-header" style={styles.pageHeader}>
        <div>
          <p style={styles.eyebrow}>Panel de gestion / 01</p>
          <h1 className="headline" style={styles.title}>Clientes</h1>
          <p style={styles.subtitle}>Administra los datos de las personas que confian en tu taller.</p>
        </div>
        <div style={styles.stat}>
          <strong>{clientes.length}</strong>
          <span>clientes registrados</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          style={styles.input}
          required
        />
        <input
          placeholder="Apellido"
          value={form.apellido}
          onChange={(e) => setForm({ ...form, apellido: e.target.value })}
          style={styles.input}
          required
        />
        <input
          placeholder="Telefono"
          type="tel"
          pattern="[0-9]{6,15}"
          title="Solo numeros, entre 6 y 15 digitos"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value.replace(/\D/g, '') })}
          style={styles.input}
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={styles.input}
        />
        <input
          placeholder="DNI"
          type="text"
          pattern="[0-9]{7,8}"
          title="DNI valido: 7 u 8 digitos"
          value={form.dni}
          onChange={(e) => setForm({ ...form, dni: e.target.value.replace(/\D/g, '') })}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Agregar cliente</button>
      </form>

      {error && <p style={styles.errorText}>{error}</p>}

      <section style={styles.mapPanel}>
        <p style={styles.sectionLabel}>Integracion externa · OpenStreetMap</p>
        <h2 className="headline" style={styles.sectionTitle}>Ubicar una direccion</h2>

        <form onSubmit={buscarDireccion} style={styles.mapForm}>
          <input
            placeholder="Ej.: Avenida Rivadavia 12000, Moron"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={styles.mapInput}
            required
          />
          <button type="submit" style={styles.button} disabled={searching}>
            {searching ? 'Buscando...' : 'Buscar en el mapa'}
          </button>
        </form>

        {mapError && <p style={styles.errorText}>{mapError}</p>}

        {location && (
          <div style={styles.result}>
            <strong>{location.displayName}</strong>
            <span>Latitud: {location.latitud} · Longitud: {location.longitud}</span>

            <iframe
              title="Mapa de la direccion"
              style={styles.mapFrame}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitud - 0.01}%2C${location.latitud - 0.01}%2C${location.longitud + 0.01}%2C${location.latitud + 0.01}&layer=mapnik&marker=${location.latitud}%2C${location.longitud}`}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <a href={location.mapaUrl} target="_blank" rel="noreferrer" style={styles.mapLink}>
                Abrir en OpenStreetMap
              </a>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(`${location.latitud}, ${location.longitud}`)}
                style={styles.copyButton}
              >
                Copiar coordenadas
              </button>
            </div>
          </div>
        )}
      </section>

      <div className="data-table-wrap">
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Telefono</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>DNI</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr>
                <td colSpan={5} style={styles.empty}>
                  Todavia no hay clientes registrados. Agrega el primero desde el formulario superior.
                </td>
              </tr>
            ) : (
              clientes.map((c) => (
                <tr key={c.id}>
                  <td style={styles.td}>{c.nombre} {c.apellido}</td>
                  <td style={styles.td}>{c.telefono}</td>
                  <td style={styles.td}>{c.email}</td>
                  <td style={styles.td}>{c.dni}</td>
                  <td style={styles.td}>
                    <button onClick={() => notificarWhatsapp(c)} style={styles.whatsappButton}>WhatsApp</button>
                    <button onClick={() => eliminar(c.id)} style={styles.deleteButton}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: { padding: '48px 24px 72px', maxWidth: 1180, margin: '0 auto' },
  pageHeader: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 24,
    marginBottom: 28,
  },
  eyebrow: {
    color: 'var(--amber)',
    fontSize: 11,
    margin: 0,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  title: { fontSize: 38, margin: '8px 0 6px' },
  subtitle: { color: 'var(--muted)', margin: 0, fontSize: 14 },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', color: 'var(--muted)', fontSize: 12 },
  errorText: { color: 'var(--danger)' },

  form: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 28,
    padding: 22,
    background: 'var(--panel)',
    border: '1px solid var(--line)',
    borderRadius: 14,
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
  },
  input: {
    padding: '11px 12px',
    background: 'rgba(17, 22, 28, 0.7)',
    border: '1px solid var(--line)',
    borderRadius: 8,
    color: 'var(--bone)',
    fontSize: 14,
    flex: '1 1 140px',
  },
  button: {
    padding: '11px 17px',
    background: 'var(--amber)',
    color: '#1C1F22',
    border: 'none',
    fontWeight: 600,
    cursor: 'pointer',
    borderRadius: 8,
  },

  mapPanel: {
    marginBottom: 28,
    padding: 22,
    background: 'var(--panel)',
    border: '1px solid var(--line)',
    borderRadius: 14,
  },
  sectionLabel: { color: 'var(--steel)', fontSize: 12, margin: 0, fontFamily: 'monospace' },
  sectionTitle: { fontSize: 20, margin: '5px 0 14px' },
  mapForm: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 },
  mapInput: {
    padding: '11px 12px',
    background: 'rgba(17, 22, 28, 0.7)',
    border: '1px solid var(--line)',
    borderRadius: 8,
    color: 'var(--bone)',
    fontSize: 14,
    flex: '1 1 300px',
  },
  result: { display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14, fontSize: 13 },
  mapFrame: {
    width: '100%',
    height: 280,
    border: '1px solid var(--line)',
    borderRadius: 10,
    marginTop: 4,
  },
  mapLink: { color: 'var(--amber)', width: 'fit-content' },
  copyButton: {
    background: 'transparent',
    border: '1px solid var(--line)',
    color: 'var(--bone)',
    padding: '6px 12px',
    fontSize: 12,
    cursor: 'pointer',
    borderRadius: 7,
  },

  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left',
    padding: '15px 16px',
    borderBottom: '2px solid var(--line)',
    color: 'var(--steel)',
    fontSize: 13,
    fontWeight: 600,
  },
  td: {
    padding: '15px 16px',
    borderBottom: '1px solid var(--line)',
    fontSize: 14,
  },
  empty: {
    padding: '28px 16px',
    color: 'var(--muted)',
    textAlign: 'center',
    fontSize: 14,
  },
  whatsappButton: {
    background: 'transparent',
    border: '1px solid #25D366',
    color: '#25D366',
    padding: '7px 11px',
    fontSize: 12,
    cursor: 'pointer',
    borderRadius: 7,
    marginRight: 6,
  },
  deleteButton: {
    background: 'transparent',
    border: '1px solid rgba(240, 113, 103, 0.45)',
    color: 'var(--danger)',
    padding: '7px 11px',
    fontSize: 12,
    cursor: 'pointer',
    borderRadius: 7,
  },
};

export default Clientes;