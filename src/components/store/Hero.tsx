import heroBannerBack from '../../assets/hero-banner-back.png';

export default function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0.28) 100%), url(${heroBannerBack})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        backgroundRepeat: 'no-repeat',
        padding: '96px 24px',
        borderBottom: '1px solid var(--line)',
        imageRendering: '-webkit-optimize-contrast',
        WebkitBackfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
    >
      <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', color: '#FFFFFF', zIndex: 2 }}>
        <div
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: '#F9EBEF',
            textTransform: 'uppercase',
            marginBottom: '16px',
            textShadow: '0 2px 8px rgba(0,0,0,0.35)',
          }}
        >
          PRENEZ SOIN DE CE QUI VOUS REND UNIQUE
        </div>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '3.4rem',
            fontWeight: 600,
            letterSpacing: '0.03em',
            lineHeight: 1.15,
            color: '#FFFFFF',
            marginBottom: '20px',
            textShadow: '0 4px 16px rgba(0,0,0,0.45)',
          }}
        >
          The clean girl era commence ici.
        </h1>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '1.05rem',
            lineHeight: 1.65,
            color: 'rgba(255, 255, 255, 0.94)',
            maxWidth: '680px',
            margin: '0 auto 34px auto',
            textShadow: '0 2px 10px rgba(0,0,0,0.4)',
          }}
        >
          Taneem'Store — <em>Prenez soin de ce qui vous rend unique.</em> Découvrez notre sélection exclusive d'essentiels beauté et bien-être importés — soins du corps, du visage, accessoires et compléments.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <a
            className="btn-primary"
            href="#corps"
            style={{
              background: '#A99084',
              color: '#FFFFFF',
              padding: '14px 34px',
              fontSize: '0.9rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              borderRadius: '100px',
              boxShadow: '0 6px 20px rgba(169, 144, 132, 0.45)',
              border: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#8F776C')}
            onMouseLeave={e => (e.currentTarget.style.background = '#A99084')}
          >
            Découvrir la collection
          </a>
        </div>
      </div>
    </section>
  );
}
