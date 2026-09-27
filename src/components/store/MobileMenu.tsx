import type { Category } from '../../data/types';
import { buildWhatsAppLink } from '../../utils/whatsapp';

interface Props {
  open: boolean;
  onClose: () => void;
  categories: Category[];
}

export default function MobileMenu({ open, onClose, categories }: Props) {
  return (
    <>
      {/* Scrim */}
      <div
        className="fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: 'rgba(27,20,32,0.5)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col py-8 px-7 transition-transform duration-300"
        style={{
          width: '78%',
          maxWidth: 320,
          background: 'var(--bg)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          borderLeft: '1px solid var(--line)',
        }}
      >
        <button
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full text-xl"
          onClick={onClose}
          aria-label="Fermer le menu"
          style={{ color: 'var(--ink)' }}
        >
          ✕
        </button>

        <div className="mt-8 mb-10">
          <span
            className="text-2xl"
            style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: 'var(--pink)' }}
          >
            Taneem'Store
          </span>
        </div>

        <nav className="flex flex-col gap-6">
          {categories.map(cat => (
            <a
              key={cat.slug}
              href={`#${cat.slug}`}
              onClick={onClose}
              className="text-xl"
              style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: 'var(--ink)' }}
            >
              {cat.title}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
