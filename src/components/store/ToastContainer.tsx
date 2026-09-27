import { useToast } from '../../store/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      {toasts.map(t => (
        <div
          key={t.id}
          style={{
            pointerEvents: 'auto',
            background: t.type === 'error' ? 'var(--pink)' : '#1B1420',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '100px',
            fontSize: '0.88rem',
            fontWeight: 500,
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeInUp 0.25s ease-out forwards',
          }}
        >
          <span>{t.type === 'error' ? '⚠️' : '🛍️'}</span>
          <span>{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              opacity: 0.7,
              cursor: 'pointer',
              marginLeft: '8px',
              fontSize: '0.8rem',
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
