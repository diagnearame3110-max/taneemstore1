import { useState, useEffect } from 'react';

const ANNOUNCEMENTS = [
  "✨ Bienvenue chez Taneem'Store — Profitez de -10% avec le code promo WELCOME10 !",
  "💖 Prenez soin de ce qui vous rend unique — Découvrez tous nos nouveaux arrivages !",
  "🚚 Livraison rapide à Dakar & dans toutes les régions du Sénégal 🇸🇳",
  "💳 Paiement sécurisé à la livraison via Wave & Orange Money"
];

export default function TopAnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % ANNOUNCEMENTS.length);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, var(--pink) 0%, var(--pink-deep) 100%)',
        padding: '9px 24px',
        fontSize: '0.86rem',
        fontWeight: 600,
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        userSelect: 'none',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
      }}
    >
      <button
        onClick={handlePrev}
        aria-label="Annonce précédente"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px 10px',
          color: 'rgba(255, 255, 255, 0.85)',
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.2s, transform 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.transform = 'scale(1.15)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div
        style={{
          textAlign: 'center',
          flex: 1,
          padding: '0 12px',
          letterSpacing: '0.01em',
          transition: 'opacity 0.3s ease',
          textShadow: '0 1px 2px rgba(0,0,0,0.15)',
        }}
      >
        {ANNOUNCEMENTS[currentIndex]}
      </div>

      <button
        onClick={handleNext}
        aria-label="Annonce suivante"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px 10px',
          color: 'rgba(255, 255, 255, 0.85)',
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.2s, transform 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.transform = 'scale(1.15)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
