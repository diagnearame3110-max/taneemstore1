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
  const validCategories = (Array.isArray(categories) && categories.length > 0 ? categories : SEED_CATEGORIES).filter(c => c && c.slug !== ('maquillage' as any));
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
        {/* Drawer Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' }}>
            Taneem'Store
          </span>
          <button
            onClick={closeMenu}
            aria-label="Fermer le menu"
            style={{
              background: 'var(--blush-soft)',
              border: '1px solid var(--line)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Category Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sorted.map((cat, idx) => (
            <a
              key={cat.slug}
              href={`#${cat.slug}`}
              onClick={closeMenu}
              style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '14px 18px',
                borderRadius: '12px',
                background: '#FFFFFF',
                border: '1px solid var(--line)',
                textDecoration: 'none',
                color: 'var(--text)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pink)', fontFamily: "'Montserrat', sans-serif" }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 600, fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.02em' }}>
                  {formatMenuTitle(cat.title)}
                </span>
              </div>
              <span style={{ color: 'var(--pink)', fontSize: '1.1rem', fontWeight: 600 }}>&rarr;</span>
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div style={{ marginTop: 'auto', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => {
              closeMenu();
              setSearchOpen(true);
            }}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '100px',
              background: '#FFFFFF',
              border: '1px solid var(--line)',
              color: 'var(--text)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Rechercher un produit
          </button>

          <button
            onClick={() => {
              closeMenu();
              openCart();
            }}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '100px',
              background: 'var(--pink)',
              border: 'none',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(209, 17, 110, 0.25)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Mon Panier ({totalItems})
          </button>

          <a
            href={buildWhatsAppLink("Bonjour Taneem'Store, je souhaite des informations.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '100px',
              background: 'var(--blush-soft)',
              border: '1px solid var(--line)',
              color: 'var(--pink-deep)',
              fontWeight: 600,
              fontSize: '0.88rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxSizing: 'border-box',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Nous contacter sur WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
