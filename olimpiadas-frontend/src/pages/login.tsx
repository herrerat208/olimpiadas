import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/clientes');
    } catch {
      setError('Email o contraseña incorrectos.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.accentBar} />
        <div style={styles.body}>
          <p style={styles.eyebrow}>Ficha de acceso</p>
          <h1 className="headline" style={styles.title}>Taller Mecánico</h1>
          <p style={styles.subtitle}>Ingresá tus credenciales para ver el estado del taller.</p>

          <form onSubmit={handleSubmit} style={{ marginTop: 32 }}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="tu@taller.com"
              required
            />

            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" style={styles.button}>
              Entrar al panel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: 380,
    background: 'var(--panel)',
    border: '1px solid var(--line)',
  },
  accentBar: {
    height: 6,
    background: 'var(--amber)',
  },
  body: {
    padding: '32px 28px',
  },
  eyebrow: {
    color: 'var(--steel)',
    fontSize: 13,
    margin: 0,
    fontFamily: 'monospace',
  },
  title: {
    fontSize: 30,
    margin: '6px 0 4px',
  },
  subtitle: {
    color: 'var(--muted)',
    fontSize: 14,
    margin: 0,
    lineHeight: 1.5,
  },
  label: {
    display: 'block',
    fontSize: 13,
    color: 'var(--muted)',
    marginBottom: 6,
    marginTop: 18,
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    background: 'var(--graphite)',
    border: '1px solid var(--line)',
    color: 'var(--bone)',
    fontSize: 15,
  },
  error: {
    color: '#D9552B',
    fontSize: 13,
    marginTop: 14,
    marginBottom: 0,
  },
  button: {
    width: '100%',
    padding: '12px 0',
    marginTop: 26,
    background: 'var(--amber)',
    color: '#1C1F22',
    border: 'none',
    fontWeight: 600,
    fontSize: 15,
    cursor: 'pointer',
  },
};

export default Login;