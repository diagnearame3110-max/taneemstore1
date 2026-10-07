import { useState } from 'react';
import { buildWhatsAppLink } from '../../utils/whatsapp';
import { useProducts } from '../../store/ProductsContext';
import { useCart } from '../../store/CartContext';
import { SEED_CATEGORIES } from '../../data/seedData';
import SearchModal from './SearchModal';
import TopAnnouncementBar from './TopAnnouncementBar';

function formatMenuTitle(title?: string): string {
  if (!title) return '';
  const clean = title.replace(/&amp;/g, '&').trim();
  if (clean.toLowerCase().includes('corp')) return 'Corps';
  if (clean.toLowerCase().includes('visage')) return 'Visage';
  if (clean.toLowerCase().includes('maquillage')) return 'Maquillage';
  if (clean.toLowerCase().includes('accessoire')) return 'Accessoires';
  if (clean.toLowerCase().includes('bien') || clean.toLowerCase().includes('hygien')) return 'Bien-être';
  return clean;
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { categories } = useProducts() || {};
  const { totalItems, openCart } = useCart();
  const validCategories = Array.isArray(categories) && categories.length > 0 ? categories : SEED_CATEGORIES;
  const sorted = [...validCategories].sort((a, b) => (a.order || 0) - (b.order || 0));

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <TopAnnouncementBar />
      <header>
        <div className="wrap navrow">
          <a href="/" className="brand" style={{ color: '#000000', fontWeight: 700 }}>
            <span>Taneem'Store</span>
          </a>

          <nav className="links">
            {sorted.map(cat => (
              <a key={cat.slug} href={`#${cat.slug}`}>
                {formatMenuTitle(cat.title)}
              </a>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Rechercher un produit"
              title="Rechercher"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text)',
                borderRadius: '50%',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--pink)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text)')}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <a
              href={buildWhatsAppLink("Bonjour Taneem'Store, je souhaite des informations.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact"
              title="Contactez-nous sur WhatsApp"
              style={{
                background: 'var(--blush-soft)',
                color: 'var(--pink-deep)',
                border: '1px solid var(--line)',
                padding: '6px 14px',
                borderRadius: '100px',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'transform 0.15s ease, background 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'var(--blush)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'var(--blush-soft)';
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Contact</span>
            </a>

            <button
              onClick={openCart}
              aria-label="Voir le panier"
              title="Mon Panier"
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {totalItems > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: 'var(--pink)',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--bg)',
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>

            <button
              className={`burger ${menuOpen ? 'is-open' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <div
        className={`menu-scrim ${menuOpen ? 'is-open' : ''}`}
        onClick={closeMenu}
      />
      <div className={`mobile-menu ${menuOpen ? 'is-open' : ''}`}>
        {sorted.map(cat => (
          <a key={cat.slug} href={`#${cat.slug}`} onClick={closeMenu}>
            {formatMenuTitle(cat.title)}
          </a>
        ))}
        <button
          onClick={() => {
            closeMenu();
            setSearchOpen(true);
          }}
          className="btn-ghost"
          style={{ marginTop: '20px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          🔍 Rechercher un produit
        </button>
        <button
          onClick={() => {
            closeMenu();
            openCart();
          }}
          className="btn-primary"
          style={{ marginTop: '10px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          🛒 Voir le panier ({totalItems})
        </button>
      </div>
    </>
  );
}
