import { useState, useEffect } from 'react';

const ANNOUNCEMENTS = [
  "🎉 OFFRE SPÉCIALE : -20% sur toute la boutique avec le code TANEEM20 !",
  "✨ Profitez de -10% de réduction immédiate avec le code WELCOME10 !",
  "🚚 Livraison express à Dakar & dans toutes les régions du Sénégal 🇸🇳",
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
        position: 'relative',
        zIndex: 60,
        background: 'linear-gradient(90deg, var(--pink) 0%, var(--pink-deep) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '8px 24px',
        fontSize: '0.84rem',
        fontWeight: 600,
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        userSelect: 'none',
        boxShadow: '0 2px 10px rgba(169, 144, 132, 0.35)',
      }}
    >
      <button
        onClick={handlePrev}
        aria-label="Annonce précédente"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.15s ease, opacity 0.15s ease',
          flexShrink: 0,
          opacity: 0.9,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = 'scale(1.2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.opacity = '0.9';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div
        style={{
          textAlign: 'center',
          flex: 1,
          padding: '0 12px',
          letterSpacing: '0.02em',
          transition: 'opacity 0.3s ease',
          color: '#FFFFFF',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '0.82rem',
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
          padding: '4px',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.15s ease, opacity 0.15s ease',
          flexShrink: 0,
          opacity: 0.9,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = 'scale(1.2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.opacity = '0.9';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
