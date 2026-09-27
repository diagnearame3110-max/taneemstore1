import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

const links = [
  { to: '/admin', label: 'Tableau de bord', icon: '📊', exact: true },
  { to: '/admin/orders', label: 'Commandes', icon: '🛍️' },
  { to: '/admin/products', label: 'Produits', icon: '✨' },
  { to: '/admin/categories', label: 'Catégories', icon: '🏷️' },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        width: '260px',
        background: '#1B1420',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 20px',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div style={{ marginBottom: '36px', paddingLeft: '8px' }}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.5rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: 'var(--pink)',
            lineHeight: 1.2,
          }}
        >
          Taneem'Store
        </div>
        <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.45)', marginTop: '4px', fontWeight: 600 }}>
          ESPACE ADMINISTRATION
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.exact}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)',
              background: isActive ? 'var(--pink)' : 'transparent',
              boxShadow: isActive ? '0 4px 14px rgba(169, 144, 132, 0.35)' : 'none',
            })}
          >
            <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '11px 16px',
            borderRadius: '12px',
            fontSize: '0.84rem',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.75)',
            border: '1px solid rgba(255,255,255,0.15)',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          }}
        >
          <span>🌐</span> Voir la boutique
        </a>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '11px 16px',
            borderRadius: '12px',
            fontSize: '0.84rem',
            fontWeight: 600,
            color: '#F87171',
            background: 'rgba(248, 113, 113, 0.08)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            width: '100%',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(248, 113, 113, 0.18)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(248, 113, 113, 0.08)';
          }}
        >
          <span>🚪</span> Déconnexion
        </button>
      </div>
    </aside>
  );
}
