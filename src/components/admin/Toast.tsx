import { useToast } from '../../store/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white min-w-48 max-w-xs animate-in slide-in-from-right"
          style={{ background: toast.type === 'error' ? '#b91c1c' : 'var(--ink)' }}
        >
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="opacity-60 hover:opacity-100 text-base leading-none">✕</button>
        </div>
      ))}
    </div>
  );
}
