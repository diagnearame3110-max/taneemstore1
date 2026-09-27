import React from 'react';
import editorialMoodboard from '../../assets/editorial-moodboard.jpg';

export default function EditorialDualBanner() {
  return (
    <section
      style={{
        width: '100%',
        padding: '0',
        background: '#FFFFFF',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div
        style={{
          width: '100%',
          padding: '36px 48px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'stretch',
          }}
        >
          {/* Left Column: NOTRE HISTOIRE */}
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
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--text-soft)',
                  marginBottom: '10px',
                }}
              >
                NOTRE HISTOIRE
              </div>

              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  color: 'var(--text)',
                  marginBottom: '14px',
                  lineHeight: 1.2,
                }}
              >
                TOUT A COMMENCÉ AVEC UNE IDÉE SIMPLE.
              </h2>

              <div
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '0.85rem',
                  lineHeight: 1.6,
                  color: 'var(--text-soft)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginBottom: '20px',
                }}
              >
                <p>
                  Taneem'Store est née d'un amour pour la beauté, le soin de soi et les rituels du quotidien.
                </p>
                <p>
                  Un espace dédié aux essentiels de beauté et de bien-être pour vous sublimer jour après jour.
                </p>
              </div>

              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'var(--text)',
                  lineHeight: 1.3,
                  marginBottom: '20px',
                }}
              >
                BIENVENUE CHEZ TANEEM'STORE. L'ÈRE DES CLEAN GIRLS.
              </div>
            </div>

            {/* Left Photo: Aesthetic Skincare Image */}
            <div
              style={{
                borderRadius: '0px',
                overflow: 'hidden',
                border: '1px solid var(--line)',
                marginTop: 'auto',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"
                alt="Taneem'Store — Notre Histoire Self Care"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = editorialMoodboard || '/editorial-moodboard.jpg';
                }}
                style={{
                  width: '100%',
                  height: '210px',
                  objectFit: 'cover',
                  borderRadius: '0px',
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* Right Column: SUIVEZ L'ÈRE with Moodboard Collage */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  color: 'var(--text)',
                  marginBottom: '4px',
                }}
              >
                SUIVEZ L'ÈRE
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
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
                  @taneemstore
                </a>

                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '0.8rem',
                    color: 'var(--text-soft)',
                  }}
                >
                  · Beauté · Soins · Bien-être
                </span>
              </div>
            </div>

            {/* Right Photo: Image 1 Lumière Moodboard Collage */}
            <div
              style={{
                borderRadius: '0px',
                overflow: 'hidden',
                border: '1px solid var(--line)',
                marginTop: 'auto',
              }}
            >
              <img
                src={editorialMoodboard || '/editorial-moodboard.jpg'}
                alt="Taneem'Store — Lumière Moodboard Collection"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/editorial-moodboard.jpg';
                }}
                style={{
                  width: '100%',
                  height: '210px',
                  objectFit: 'cover',
                  borderRadius: '0px',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
