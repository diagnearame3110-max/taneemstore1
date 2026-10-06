import React from 'react';
import editorialMoodboard from '../../assets/editorial-moodboard.jpg';

export default function EditorialDualBanner() {
  return (
    <section
      style={{
        padding: '56px 0',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div className="wrap">
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--line)',
            borderRadius: '0px',
            padding: '44px 40px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '44px',
              alignItems: 'center',
            }}
          >
            {/* Left Column: TEXT ONLY */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--text-soft)',
                    marginBottom: '12px',
                  }}
                >
                  NOTRE HISTOIRE
                </div>

                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '2rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: 'var(--text)',
                    marginBottom: '20px',
                    lineHeight: 1.2,
                  }}
                >
                  TOUT A COMMENCÉ AVEC<br />UNE IDÉE SIMPLE.
                </h2>

                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '0.88rem',
                    lineHeight: 1.65,
                    color: 'var(--text-soft)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    marginBottom: '28px',
                  }}
                >
                  <p>
                    Taneem'Store est née d'un amour pour la beauté, le soin de soi et les petits rituels du quotidien.
                  </p>
                  <p>
                    Prendre soin de soi ne devrait pas être compliqué. Cela devrait être un véritable plaisir.
                  </p>
                  <p>
                    Un espace dédié aux essentiels de beauté et de bien-être pour vous sublimer jour après jour.
                  </p>
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--text)',
                    lineHeight: 1.35,
                  }}
                >
                  BIENVENUE CHEZ TANEEM'STORE.
                  <br />
                  L'ÈRE DES CLEAN GIRLS.
                </div>
              </div>
            </div>

            {/* Right Column: IMAGE ONLY */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  marginBottom: '12px',
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: 'var(--text)',
                    marginBottom: '4px',
                  }}
                >
                  SUIVEZ L'ÈRE
                </h2>

                <a
                  href="https://www.instagram.com/taneemstore/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-soft)',
                    textDecoration: 'none',
                  }}
                >
                  @taneemstore · Beauté · Soins · Bien-être
                </a>
              </div>

              {/* Moodboard Image */}
              <div
                style={{
                  borderRadius: '0px',
                  overflow: 'hidden',
                  border: '1px solid var(--line)',
                }}
              >
                <img
                  src={editorialMoodboard || '/editorial-moodboard.jpg'}
                  alt="Taneem'Store — Lumière Moodboard Collection"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800';
                  }}
                  style={{
                    width: '100%',
                    height: '340px',
                    objectFit: 'cover',
                    borderRadius: '0px',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
