import heroBannerBack from '../../assets/hero-banner-back.jpg';

export default function Hero() {
  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        minHeight: '380px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '110px 24px 40px 24px',
        borderBottom: '1px solid var(--line)',
        overflow: 'hidden',
        background: '#1B1420 url("/banier.jpg") center center / cover no-repeat',
      }}
    >
      {/* Background Image Tag - public/banier.jpg */}
      <img
        src={heroBannerBack || '/banier.jpg'}
        alt="Taneem'Store Hero Banner"
        className="hero-bg-img"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=1200';
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
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
        <h1
          className="hero-h1"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2.4rem',
            fontWeight: 600,
            letterSpacing: '0.03em',
            lineHeight: 1.15,
            color: '#FFFFFF',
            marginBottom: '12px',
            textShadow: '0 4px 16px rgba(0,0,0,0.5)',
          }}
        >
          Welcome to your Clean Girl Era
        </h1>

        <p
          className="hero-p"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.92rem',
            lineHeight: 1.55,
            color: 'rgba(255, 255, 255, 0.95)',
            maxWidth: '680px',
            margin: '0 auto 20px auto',
            textShadow: '0 2px 10px rgba(0,0,0,0.45)',
          }}
        >
          Beauty, wellness & everyday rituals designed to make taking care of yourself feel effortless.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <a
            className="btn-primary"
            href="#skincare"
            style={{
              background: '#A99084',
              color: '#FFFFFF',
              padding: '10px 28px',
              fontSize: '0.84rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              borderRadius: '100px',
              boxShadow: '0 4px 14px rgba(169, 144, 132, 0.45)',
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
