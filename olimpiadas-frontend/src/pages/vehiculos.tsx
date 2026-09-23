import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import api from '../api/axios';

interface Vehiculo {
  id: number;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  cliente_id: number;
  cliente_nombre: string;
  cliente_apellido: string;
}

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
}

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState({ patente: '', marca: '', modelo: '', anio: '', cliente_id: '' });
  const [error, setError] = useState('');

  const cargarDatos = async () => {
    try {
      const [resVeh, resCli] = await Promise.all([
        api.get('/vehiculos'),
        api.get('/clientes'),
      ]);
      setVehiculos(resVeh.data);
      setClientes(resCli.data);
    } catch {
      setError('No se pudieron cargar los datos.');
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/vehiculos', { ...form, anio: Number(form.anio), cliente_id: Number(form.cliente_id) });
      setForm({ patente: '', marca: '', modelo: '', anio: '', cliente_id: '' });
      cargarDatos();
    } catch {
      setError('No se pudo crear el vehiculo.');
    }
  };

  const eliminar = async (id: number) => {
    await api.delete(`/vehiculos/${id}`);
    cargarDatos();
  };

  return (
    <div style={styles.page}>
      <p style={styles.eyebrow}>Registro de vehículos</p>
      <h1 className="headline" style={styles.title}>Vehículos</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          placeholder="Patente"
          value={form.patente}
          onChange={(e) => setForm({ ...form, patente: e.target.value })}
          style={styles.input}
          required
        />
        <input
          placeholder="Marca"
          value={form.marca}
          onChange={(e) => setForm({ ...form, marca: e.target.value })}
          style={styles.input}
          required
        />
        <input
          placeholder="Modelo"
          value={form.modelo}
          onChange={(e) => setForm({ ...form, modelo: e.target.value })}
          style={styles.input}
          required
        />
        <input
          placeholder="Año"
          type="number"
          value={form.anio}
          onChange={(e) => setForm({ ...form, anio: e.target.value })}
          style={styles.input}
        />
        <select
          value={form.cliente_id}
          onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
          style={styles.input}
          required
        >
          <option value="">Cliente...</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre} {c.apellido}</option>
          ))}
        </select>
        <button type="submit" style={styles.button}>Agregar vehículo</button>
      </form>

      {error && <p style={{ color: '#D9552B' }}>{error}</p>}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Patente</th>
            <th style={styles.th}>Marca / Modelo</th>
            <th style={styles.th}>Año</th>
            <th style={styles.th}>Cliente</th>
            <th style={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((v) => (
            <tr key={v.id}>
              <td style={styles.td}>{v.patente}</td>
              <td style={styles.td}>{v.marca} {v.modelo}</td>
              <td style={styles.td}>{v.anio}</td>
              <td style={styles.td}>{v.cliente_nombre} {v.cliente_apellido}</td>
              <td style={styles.td}>
                <button onClick={() => eliminar(v.id)} style={styles.deleteButton}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: { padding: '32px 40px', maxWidth: 900 },
  eyebrow: { color: 'var(--steel)', fontSize: 13, margin: 0, fontFamily: 'monospace' },
  title: { fontSize: 28, margin: '6px 0 24px' },
  form: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 24,
    padding: 16,
    background: 'var(--panel)',
    border: '1px solid var(--line)',
  },
  input: {
    padding: '8px 10px',
    background: 'var(--graphite)',
    border: '1px solid var(--line)',
    color: 'var(--bone)',
    fontSize: 14,
    flex: '1 1 140px',
  },
  button: {
    padding: '8px 16px',
    background: 'var(--amber)',
    color: '#1C1F22',
    border: 'none',
    fontWeight: 600,
    cursor: 'pointer',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left',
    padding: '10px 8px',
    borderBottom: '2px solid var(--line)',
    color: 'var(--steel)',
    fontSize: 13,
    fontWeight: 600,
  },
  td: {
    padding: '10px 8px',
    borderBottom: '1px solid var(--line)',
    fontSize: 14,
  },
  deleteButton: {
    background: 'transparent',
    border: '1px solid #D9552B',
    color: '#D9552B',
    padding: '4px 10px',
    fontSize: 12,
    cursor: 'pointer',
  },
};

export default Vehiculos;