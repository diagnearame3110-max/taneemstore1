import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = login(email, password);
    if (ok) navigate('/admin');
    else setError('Email ou mot de passe incorrect.');
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
          borderRadius: '16px',
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
              borderRadius: '10px',
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

        <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
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
                borderRadius: '10px',
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
              autoComplete="off"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text)' }}>
              Mot de Passe *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                style={{
                  width: '100%',
                  padding: '14px 48px 14px 18px',
                  borderRadius: '10px',
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
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  color: 'var(--text-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-soft)')}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" x2="22" y1="2" y2="22" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
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
                borderRadius: '10px',
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
        </form>
      </div>
    </div>
  );
}
