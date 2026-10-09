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
        background: '#1B1420',
        borderBottom: '1px solid rgba(230, 198, 117, 0.3)',
        padding: '7px 24px',
        fontSize: '0.82rem',
        fontWeight: 600,
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        userSelect: 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      <button
        onClick={handlePrev}
        aria-label="Annonce précédente"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          cursor: 'pointer',
          padding: 0,
          color: '#E6C675',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease',
          flexShrink: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(230, 198, 117, 0.3)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
          color: '#F5EFEA',
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
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          cursor: 'pointer',
          padding: 0,
          color: '#E6C675',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease',
          flexShrink: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(230, 198, 117, 0.3)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
