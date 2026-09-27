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
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 36px',
            height: '72px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--line)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
          }}
        >
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.65rem',
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: '0.02em',
            }}
          >
            {title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-soft)', background: 'var(--blush-soft)', padding: '6px 14px', borderRadius: '100px', border: '1px solid var(--line)' }}>
              🟢 Session Administrateur Active
            </span>
          </div>
        </header>

        <main style={{ padding: '36px 40px', flex: 1, maxWidth: '1360px', width: '100%', boxSizing: 'border-box' }}>
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
