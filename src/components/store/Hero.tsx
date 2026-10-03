import heroBannerBack from '../../assets/hero-banner-back.jpg';

export default function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '620px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '96px 24px',
        borderBottom: '1px solid var(--line)',
        overflow: 'hidden',
        background: '#1B1420 url("/banier.jpg") center center / cover no-repeat',
      }}
    >
      {/* Background Image Tag - public/banier.jpg */}
      <img
        src={heroBannerBack || '/banier.jpg'}
        alt="Taneem'Store Hero Banner"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/banier.jpg';
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 40%',
          zIndex: 1,
        }}
      />

      {/* Subtle Overlay Gradient for optimal text contrast */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.26) 0%, rgba(0, 0, 0, 0.44) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Hero Content */}
      <div
        style={{
          maxWidth: '820px',
          margin: '0 auto',
          textAlign: 'center',
          color: '#FFFFFF',
          position: 'relative',
          zIndex: 3,
        }}
      >
        <div
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: '#F9EBEF',
            textTransform: 'uppercase',
            marginBottom: '16px',
            textShadow: '0 2px 8px rgba(0,0,0,0.4)',
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
            textShadow: '0 4px 16px rgba(0,0,0,0.5)',
          }}
        >
          Welcome to the Clean Girl Era
        </h1>

        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '1.05rem',
            lineHeight: 1.65,
            color: 'rgba(255, 255, 255, 0.95)',
            maxWidth: '680px',
            margin: '0 auto 34px auto',
            textShadow: '0 2px 10px rgba(0,0,0,0.45)',
          }}
        >
          Beauty, wellness & everyday rituals designed to make taking care of yourself feel effortless.
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
