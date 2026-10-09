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
      <TopAnnouncementBar />
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          background: 'transparent',
          borderBottom: 'none',
          padding: '16px 0',
        }}
      >
        <div className="wrap navrow" style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Petite Logo Badge */}
          <a
            href="/"
            className="brand"
            aria-label="Taneem'Store Accueil"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              background: 'rgba(27, 20, 32, 0.45)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              padding: '5px 16px 5px 6px',
              borderRadius: '100px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.borderColor = 'rgba(230, 198, 117, 0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
            }}
          >
            {/* Small Gold Monogram Badge */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #E6C675 0%, #D4AF37 50%, #9A7B2C 100%)',
                padding: '1.5px',
                boxShadow: '0 2px 10px rgba(212, 175, 55, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: '#1B1420',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#E6C675',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                TS
              </div>
            </div>

            {/* Brand Title Typography */}
            <span
              style={{
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '1.25rem',
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: '0.08em',
                textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              TANEEM'STORE
              <span style={{ color: '#E6C675', fontSize: '0.75rem' }}>✦</span>
            </span>
          </a>

          {/* Unified Glassmorphic Capsule Menu for Action Elements ("les autres") */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(255, 255, 255, 0.16)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.28)',
              padding: '4px 6px',
              borderRadius: '100px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Recherche Item */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Rechercher un produit"
              title="Rechercher"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: '100px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                fontWeight: 600,
                transition: 'background 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="nav-text-label" style={{ letterSpacing: '0.02em', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                Recherche
              </span>
            </button>

            {/* Separator Line */}
            <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.22)', margin: '0 2px' }} />

            {/* Contact WhatsApp Item */}
            <a
              href={buildWhatsAppLink("Bonjour Taneem'Store, je souhaite des informations.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact"
              title="Contactez-nous sur WhatsApp"
              style={{
                background: 'transparent',
                color: '#FFFFFF',
                padding: '6px 12px',
                borderRadius: '100px',
                fontSize: '0.82rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background 0.2s ease',
                textShadow: '0 1px 3px rgba(0,0,0,0.4)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#22C55E',
                  boxShadow: '0 0 8px #22C55E',
                  display: 'inline-block',
                }}
              />
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className="nav-text-label">Contact</span>
            </a>

            {/* Separator Line */}
            <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.22)', margin: '0 2px' }} />

            {/* Panier (Cart) Item */}
            <button
              onClick={openCart}
              aria-label="Voir le panier"
              title="Mon Panier"
              style={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.22)',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 14px',
                borderRadius: '100px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                fontWeight: 700,
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
                e.currentTarget.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="nav-text-label">Panier</span>
              {totalItems > 0 && (
                <span
                  style={{
                    background: '#E11D48',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    minWidth: '18px',
                    height: '18px',
                    padding: '0 4px',
                    borderRadius: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '2px',
                    boxShadow: '0 2px 6px rgba(225, 29, 72, 0.4)',
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
              style={{ marginLeft: '4px' }}
            >
              <span style={{ backgroundColor: '#FFFFFF' }} />
              <span style={{ backgroundColor: '#FFFFFF' }} />
              <span style={{ backgroundColor: '#FFFFFF' }} />
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
