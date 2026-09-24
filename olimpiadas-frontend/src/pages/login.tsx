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
      <div className="login-intro" style={styles.intro}>
        <p style={styles.introEyebrow}>Ficha N° 001 · Panel interno</p>
        <h2 className="headline" style={styles.introTitle}>
          Gestioná tu taller<br />mucho más fácil.
        </h2>
        <p style={styles.introText}>
          Cargá clientes, vehículos y turnos en un solo lugar, sin planillas sueltas ni cuadernos.
        </p>
      </div>
      <div style={styles.card}>
        <div style={styles.accentBar} />
        <div style={styles.body}>
          <p style={styles.eyebrow}>Ficha de acceso</p>
          <h1 className="headline" style={styles.title}>Tu Taller</h1>
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
    gap: 'clamp(32px, 8vw, 120px)',
    padding: '48px 24px',
    background: 'var(--graphite)',
  },
  intro: { maxWidth: 300 },
  introEyebrow: {
    color: 'var(--steel)',
    fontSize: 13,
    fontFamily: 'monospace',
    margin: '0 0 14px',
  },
  introTitle: { fontSize: 40, lineHeight: 1.08, margin: 0 },
  introText: { color: 'var(--muted)', lineHeight: 1.6, fontSize: 15, margin: '18px 0 0' },
  card: {
    width: 'min(100%, 410px)',
    background: 'var(--panel)',
    border: '1px solid var(--line)',
    borderRadius: 16,
    boxShadow: '0 24px 70px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden',
  },
  accentBar: {
    height: 5,
    background: 'var(--amber)',
  },
  body: {
    padding: '36px 32px 32px',
  },
  eyebrow: {
    color: 'var(--steel)',
    fontSize: 13,
    margin: 0,
    fontFamily: 'monospace',
  },
  title: {
    fontSize: 32,
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
    background: 'rgba(17, 22, 28, 0.7)',
    border: '1px solid var(--line)',
    borderRadius: 8,
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
    borderRadius: 8,
  },
};

export default Login;