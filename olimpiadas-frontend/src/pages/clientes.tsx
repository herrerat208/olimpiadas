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

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState({ nombre: '', apellido: '', telefono: '', email: '', dni: '' });
  const [error, setError] = useState('');

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

  return (
    <div style={styles.page}>
      <p style={styles.eyebrow}>Registro de clientes</p>
      <h1 className="headline" style={styles.title}>Clientes</h1>

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
          placeholder="Teléfono"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          style={styles.input}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={styles.input}
        />
        <input
          placeholder="DNI"
          value={form.dni}
          onChange={(e) => setForm({ ...form, dni: e.target.value })}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Agregar cliente</button>
      </form>

      {error && <p style={{ color: '#D9552B' }}>{error}</p>}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Teléfono</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>DNI</th>
            <th style={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td style={styles.td}>{c.nombre} {c.apellido}</td>
              <td style={styles.td}>{c.telefono}</td>
              <td style={styles.td}>{c.email}</td>
              <td style={styles.td}>{c.dni}</td>
              <td style={styles.td}>
                <button onClick={() => eliminar(c.id)} style={styles.deleteButton}>Eliminar</button>
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

export default Clientes;