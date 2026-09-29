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
        background: 'linear-gradient(135deg, #150F18 0%, #2A1F30 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Soft Glow Background Elements */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(169, 144, 132, 0.15) 0%, rgba(0,0,0,0) 70%)',
          top: '-100px',
          right: '-100px',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(143, 119, 108, 0.12) 0%, rgba(0,0,0,0) 70%)',
          bottom: '-80px',
          left: '-80px',
          pointerEvents: 'none',
        }}
      />

      {/* Login Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '52px 44px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #A99084 0%, #8F776C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '1.6rem',
              margin: '0 auto 16px auto',
              boxShadow: '0 8px 24px rgba(169, 144, 132, 0.35)',
            }}
          >
            T
          </div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.4rem',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '4px',
              letterSpacing: '0.02em',
              lineHeight: 1.1,
            }}
          >
            Taneem'Store
          </h1>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--pink-deep)',
            }}
          >
            Espace d'Administration Sécurisé
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text)' }}>
              Adresse Email *
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
                background: '#FAF8F4',
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
            <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text)' }}>
              Mot de Passe *
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
                background: '#FAF8F4',
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
            <div
              style={{
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#DC2626',
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                padding: '12px 16px',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
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
              background: 'linear-gradient(90deg, #A99084 0%, #8F776C 100%)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(169, 144, 132, 0.4)',
              transition: 'all 0.2s ease',
              marginTop: '6px',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
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
