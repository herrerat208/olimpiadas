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
    <nav className="nav-shell" style={styles.nav}>
      <Link to="/clientes" className="headline" style={styles.brand}>Taller Mecánico</Link>
      <div style={styles.links}>
        <Link to="/clientes" style={linkStyle('/clientes')}>Clientes <span style={styles.navHint}>01</span></Link>
        <Link to="/vehiculos" style={linkStyle('/vehiculos')}>Vehículos <span style={styles.navHint}>02</span></Link>
      </div>
      <div style={styles.right}>
        {usuario && <span style={styles.user}><span style={styles.userDot} />{usuario.email}</span>}
        <button onClick={logout} style={styles.logout}>Salir</button>
      </div>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 40,
    padding: '18px max(24px, calc((100vw - 1180px) / 2))',
    borderBottom: '1px solid var(--line)',
    background: 'rgba(26, 34, 43, 0.92)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backdropFilter: 'blur(12px)',
  },
  brand: { fontSize: 19, color: 'var(--amber)', textDecoration: 'none', whiteSpace: 'nowrap' },
  links: { display: 'flex', gap: 8, flex: 1 },
  navHint: { fontSize: 10, color: 'var(--steel)', marginLeft: 5, opacity: 0.7 },
  right: { display: 'flex', alignItems: 'center', gap: 16 },
  user: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  userDot: { width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 0 4px rgba(98, 192, 149, 0.12)' },
  logout: {
    background: 'transparent',
    border: '1px solid var(--line)',
    color: 'var(--bone)',
    borderRadius: 7,
    padding: '8px 14px',
    fontSize: 13,
    cursor: 'pointer',
  },
};

export default Navbar;