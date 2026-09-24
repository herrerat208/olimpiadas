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

const MARCAS = [
  'Chevrolet',
  'Fiat',
  'Ford',
  'Peugeot',
  'Renault',
  'Volkswagen',
  'Citroën',
  'Toyota',
  'Honda',
  'Nissan',
  'Hyundai',
  'Kia',
  'Suzuki',
  'Mitsubishi',
  'Chery',
];

const ANIO_ACTUAL = new Date().getFullYear();
const ANIOS = Array.from({ length: ANIO_ACTUAL - 1960 + 1 }, (_, i) => ANIO_ACTUAL - i);

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

    if (!form.marca) {
      setError('Seleccioná una marca.');
      return;
    }
    if (!form.anio) {
      setError('Seleccioná un año.');
      return;
    }
    if (!form.cliente_id) {
      setError('Seleccioná un cliente.');
      return;
    }

    try {
      await api.post('/vehiculos', {
        ...form,
        anio: Number(form.anio),
        cliente_id: Number(form.cliente_id),
      });
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
      <p style={styles.eyebrow}>Registro de vehiculos</p>
      <h1 className="headline" style={styles.title}>Vehiculos</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          placeholder="Patente"
          value={form.patente}
          onChange={(e) => setForm({ ...form, patente: e.target.value })}
          style={styles.input}
          required
        />

        <select
          value={form.marca}
          onChange={(e) => setForm({ ...form, marca: e.target.value })}
          style={styles.input}
          required
        >
          <option value="">Marca...</option>
          {MARCAS.map((marca) => (
            <option key={marca} value={marca}>{marca}</option>
          ))}
        </select>

        <input
          placeholder="Modelo"
          value={form.modelo}
          onChange={(e) => setForm({ ...form, modelo: e.target.value })}
          style={styles.input}
          required
        />

        <select
          value={form.anio}
          onChange={(e) => setForm({ ...form, anio: e.target.value })}
          style={styles.input}
          required
        >
          <option value="">Año...</option>
          {ANIOS.map((anio) => (
            <option key={anio} value={anio}>{anio}</option>
          ))}
        </select>

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

        <button type="submit" style={styles.button}>Agregar vehiculo</button>
      </form>

      {error && <p style={styles.errorText}>{error}</p>}

      <div className="data-table-wrap">
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
            {vehiculos.length === 0 ? (
              <tr>
                <td colSpan={5} style={styles.empty}>
                  Todavia no hay vehiculos registrados.
                </td>
              </tr>
            ) : (
              vehiculos.map((v) => (
                <tr key={v.id}>
                  <td style={styles.td}>{v.patente}</td>
                  <td style={styles.td}>{v.marca} {v.modelo}</td>
                  <td style={styles.td}>{v.anio}</td>
                  <td style={styles.td}>{v.cliente_nombre} {v.cliente_apellido}</td>
                  <td style={styles.td}>
                    <button onClick={() => eliminar(v.id)} style={styles.deleteButton}>Eliminar</button>
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
  page: { padding: '32px 40px', maxWidth: 1180, margin: '0 auto' },
  eyebrow: { color: 'var(--steel)', fontSize: 13, margin: 0, fontFamily: 'monospace' },
  title: { fontSize: 28, margin: '6px 0 24px' },
  errorText: { color: 'var(--danger)' },
  form: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 24,
    padding: 16,
    background: 'var(--panel)',
    border: '1px solid var(--line)',
    borderRadius: 14,
  },
  input: {
    padding: '8px 10px',
    background: 'var(--graphite)',
    border: '1px solid var(--line)',
    color: 'var(--bone)',
    fontSize: 14,
    flex: '1 1 140px',
    borderRadius: 8,
  },
  button: {
    padding: '8px 16px',
    background: 'var(--amber)',
    color: '#1C1F22',
    border: 'none',
    fontWeight: 600,
    cursor: 'pointer',
    borderRadius: 8,
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
  empty: {
    padding: '28px 16px',
    color: 'var(--muted)',
    textAlign: 'center',
    fontSize: 14,
  },
  deleteButton: {
    background: 'transparent',
    border: '1px solid rgba(240, 113, 103, 0.45)',
    color: 'var(--danger)',
    padding: '4px 10px',
    fontSize: 12,
    cursor: 'pointer',
    borderRadius: 7,
  },
};

export default Vehiculos;