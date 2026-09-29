import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import ToastContainer from './Toast';

interface Props {
  children: ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Glassmorphism Header */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 36px',
            height: '76px',
            background: 'rgba(250, 248, 244, 0.92)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--line)',
            boxShadow: '0 1px 6px rgba(0,0,0,0.02)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-soft)', marginBottom: '2px' }}>
              Espace Administration
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'var(--text)',
                letterSpacing: '0.02em',
                lineHeight: 1.1,
              }}
            >
              {title}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text)',
                background: '#FFFFFF',
                padding: '8px 16px',
                borderRadius: '100px',
                border: '1px solid var(--line)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
              Session Admin Active
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main
          style={{
            padding: '36px 40px 60px 40px',
            flex: 1,
            maxWidth: '1360px',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
