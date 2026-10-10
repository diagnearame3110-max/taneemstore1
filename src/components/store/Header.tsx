import { useState } from 'react';
import { buildWhatsAppLink } from '../../utils/whatsapp';
import { useProducts } from '../../store/ProductsContext';
import { useCart } from '../../store/CartContext';
import { SEED_CATEGORIES } from '../../data/seedData';
import { formatCategoryTitle } from '../../utils/format';
import SearchModal from './SearchModal';
import TopAnnouncementBar from './TopAnnouncementBar';

function formatMenuTitle(title?: string, slug?: string): string {
  return formatCategoryTitle(title, slug);
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { categories } = useProducts() || {};
  const { totalItems, openCart } = useCart();
  const validCategories = (Array.isArray(categories) && categories.length > 0 ? categories : SEED_CATEGORIES).filter(c => c && (c.slug as string) !== 'maquillage');
  const sorted = [...validCategories].sort((a, b) => (a.order || 0) - (b.order || 0));

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <TopAnnouncementBar />
        <header
          style={{
            background: 'transparent',
            borderBottom: 'none',
            padding: '4px 0 10px 0',
          }}
        >
        <div
          className="wrap navrow"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            padding: 0,
          }}
        >
          {/* Left Empty Balance Spacer */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Can hold subtle back link or remains clean for true symmetry */}
          </div>

          {/* CENTERED LOGO */}
          <a
            href="/"
            className="brand"
            aria-label="Taneem'Store Accueil"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              transition: 'transform 0.25s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span
              className="brand-logo-text"
              style={{
                color: '#FFFFFF',
                fontWeight: 600,
                fontFamily: "'Cormorant Garamond', 'Cinzel', serif",
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)',
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
            >
              TANEEM’STORE
            </span>
          </a>

          {/* RIGHT SEPARATE TRANSPARENT ICONS */}
          <div
            className="header-actions-right"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '6px',
            }}
          >
            {/* Search Icon Button */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Rechercher un produit"
              title="Rechercher"
              style={{
                background: 'rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.28)';
                e.currentTarget.style.transform = 'scale(1.06)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Contact WhatsApp Button */}
            <a
              href={buildWhatsAppLink("Bonjour Taneem'Store, je souhaite des informations.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact WhatsApp"
              title="Contactez-nous sur WhatsApp"
              className="nav-contact-btn"
              style={{
                background: 'rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: '100px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                color: '#FFFFFF',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255, 255, 255, 0.28)';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255, 255, 255, 0.14)';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className="nav-text-label">Contact</span>
            </a>

            {/* Cart Icon Button */}
            <button
              onClick={openCart}
              aria-label="Voir le panier"
              title="Mon Panier"
              style={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.28)';
                e.currentTarget.style.transform = 'scale(1.06)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {totalItems > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    background: '#E11D48',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid rgba(0,0,0,0.3)',
                    boxShadow: '0 2px 6px rgba(225, 29, 72, 0.5)',
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Burger Button */}
            <button
              className={`burger ${menuOpen ? 'is-open' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span style={{ backgroundColor: '#FFFFFF' }} />
              <span style={{ backgroundColor: '#FFFFFF' }} />
              <span style={{ backgroundColor: '#FFFFFF' }} />
            </button>
          </div>
        </div>
      </header>
      </div>

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
                justifyContent: 'space-between',
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
