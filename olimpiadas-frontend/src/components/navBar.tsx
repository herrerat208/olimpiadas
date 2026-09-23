import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { usuario, logout } = useAuth();

  const linkStyle = (path: string): React.CSSProperties => ({
    color: location.pathname === path ? 'var(--amber)' : 'var(--bone)',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    padding: '6px 0',
    borderBottom: location.pathname === path ? '2px solid var(--amber)' : '2px solid transparent',
  });

  return (
    <nav style={styles.nav}>
      <span className="headline" style={styles.brand}>Taller Mecánico</span>
      <div style={styles.links}>
        <Link to="/clientes" style={linkStyle('/clientes')}>Clientes</Link>
        <Link to="/vehiculos" style={linkStyle('/vehiculos')}>Vehículos</Link>
      </div>
      <div style={styles.right}>
        {usuario && <span style={styles.user}>{usuario.email}</span>}
        <button onClick={logout} style={styles.logout}>Salir</button>
      </div>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 32,
    padding: '16px 40px',
    borderBottom: '1px solid var(--line)',
    background: 'var(--panel)',
  },
  brand: { fontSize: 18, color: 'var(--amber)' },
  links: { display: 'flex', gap: 24, flex: 1 },
  right: { display: 'flex', alignItems: 'center', gap: 16 },
  user: { fontSize: 13, color: 'var(--muted)' },
  logout: {
    background: 'transparent',
    border: '1px solid var(--line)',
    color: 'var(--bone)',
    padding: '6px 14px',
    fontSize: 13,
    cursor: 'pointer',
  },
};

export default Navbar;