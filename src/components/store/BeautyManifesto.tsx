export default function BeautyManifesto() {
  return (
    <section
      style={{
        background: 'var(--bg)',
        padding: '64px 24px',
        textAlign: 'center',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2.1rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text)',
            marginBottom: '14px',
          }}
        >
          LA BEAUTÉ DOIT ÊTRE SIMPLE.
        </h2>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.92rem',
            lineHeight: 1.65,
            color: 'var(--text-soft)',
            maxWidth: '560px',
            margin: '0 auto 28px auto',
          }}
        >
          Découvrez des essentiels soigneusement sélectionnés pour votre peau, votre corps, votre beauté et votre bien-être au quotidien.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <a
            href="#corps"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 30px',
              borderRadius: '100px',
              border: '1.5px solid var(--text)',
              color: 'var(--text)',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              background: 'transparent',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--text)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text)';
            }}
          >
            DÉCOUVRIR TANEEM'STORE
          </a>
        </div>
      </div>
    </section>
  );
}
