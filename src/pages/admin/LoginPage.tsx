import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { ADMIN_USER } from '../../data/adminUser';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = login(email, password);
    if (ok) navigate('/admin');
    else setError('Email ou mot de passe incorrect.');
  }

  function handleFillDemo() {
    setEmail(ADMIN_USER.email);
    setPassword(ADMIN_USER.password);
    setError('');
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        background: 'linear-gradient(135deg, var(--blush-soft) 0%, var(--bg) 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
          border: '1px solid var(--line)',
          padding: '52px 44px',
        }}
      >
        <div style={{ textCenter: 'center', textAlign: 'center', marginBottom: '36px' }}>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.5rem',
              fontWeight: 700,
              color: 'var(--pink)',
              marginBottom: '6px',
              letterSpacing: '0.02em',
            }}
          >
            Taneem'Store
          </div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-soft)' }}>
            ACCÈS ESPACE ADMINISTRATION
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text)' }}>
              Adresse Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '14px',
                border: '1.5px solid var(--line)',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                background: 'var(--bg)',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--pink)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--line)')}
              placeholder="admin@taneemstore.sn"
              required
              autoComplete="email"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text)' }}>
              Mot de Passe
            </label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '14px',
                border: '1.5px solid var(--line)',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                background: 'var(--bg)',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--pink)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--line)')}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p style={{ fontSize: '0.84rem', fontWeight: 600, color: '#DC2626', background: '#FEE2E2', padding: '12px 16px', borderRadius: '12px', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '100px',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: '#FFFFFF',
              background: 'var(--pink)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(169, 144, 132, 0.35)',
              transition: 'all 0.2s ease',
              marginTop: '8px',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--pink-deep)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--pink)')}
          >
            Se Connecter
          </button>

          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              width: '100%',
              padding: '12px 18px',
              borderRadius: '100px',
              fontWeight: 600,
              fontSize: '0.84rem',
              color: 'var(--pink-deep)',
              background: 'var(--blush-soft)',
              border: '1px solid var(--line)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--blush)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--blush-soft)')}
          >
            ✨ Remplir avec les identifiants démo
          </button>
        </form>
      </div>
    </div>
  );
}
