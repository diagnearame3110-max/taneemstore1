import { NavLink, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../../store/AuthContext';
import { useProducts } from '../../store/ProductsContext';

const links = [
  { to: '/admin', label: 'Tableau de bord', icon: 'lucide:layout-dashboard', exact: true },
  { to: '/admin/orders', label: 'Commandes', icon: 'lucide:shopping-bag' },
  { to: '/admin/products', label: 'Produits', icon: 'lucide:package' },
  { to: '/admin/categories', label: 'Catégories', icon: 'lucide:tags' },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const { isSupabaseActive } = useProducts();
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
        background: '#150F18',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 20px',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Brand Header */}
      <div style={{ marginBottom: '36px', paddingLeft: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #A99084 0%, #8F776C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '1.2rem',
              boxShadow: '0 4px 12px rgba(169, 144, 132, 0.3)',
            }}
          >
            T
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.45rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: '#FFFFFF',
                lineHeight: 1.1,
              }}
            >
              Taneem'Store
            </div>
            <div
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--pink)',
                marginTop: '3px',
                fontWeight: 700,
              }}
            >
              Administration
            </div>
          </div>
        </div>

        {/* Database Status Indicator */}
        <div
          style={{
            marginTop: '16px',
            padding: '6px 12px',
            borderRadius: '100px',
            background: isSupabaseActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            border: `1px solid ${isSupabaseActive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.72rem',
            fontWeight: 600,
            color: isSupabaseActive ? '#34D399' : '#FBBF24',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isSupabaseActive ? '#10B981' : '#F59E0B' }} />
          <span>{isSupabaseActive ? 'Supabase Connecté' : 'Mode Local'}</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
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
              fontSize: '0.88rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)',
              background: isActive ? 'linear-gradient(90deg, #A99084 0%, #8F776C 100%)' : 'transparent',
              boxShadow: isActive ? '0 4px 14px rgba(169, 144, 132, 0.35)' : 'none',
            })}
          >
            <Icon icon={link.icon} style={{ fontSize: '1.2rem' }} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
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
            color: 'rgba(255,255,255,0.85)',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
          }}
        >
          <Icon icon="lucide:external-link" style={{ fontSize: '1.05rem' }} /> Voir la boutique
        </a>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '11px 16px',
            borderRadius: '12px',
            fontSize: '0.84rem',
            fontWeight: 600,
            color: '#F87171',
            background: 'rgba(248, 113, 113, 0.08)',
            border: '1px solid rgba(248, 113, 113, 0.2)',
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
          <Icon icon="lucide:log-out" style={{ fontSize: '1.05rem' }} /> Déconnexion
        </button>
      </div>
    </aside>
  );
}

