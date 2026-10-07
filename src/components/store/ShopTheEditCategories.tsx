import React from 'react';
import { useProducts } from '../../store/ProductsContext';

export default function ShopTheEditCategories() {
  const { categories } = useProducts();

  const editCategories = [
    {
      slug: 'visage',
      title: 'VISAGE',
      subtitle: 'Une peau saine & éclatante.',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      actionText: 'DÉCOUVRIR VISAGE →'
    },
    {
      slug: 'corps',
      title: 'CORPS',
      subtitle: 'Soin & rituel du corps.',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
      actionText: 'DÉCOUVRIR CORPS →'
    },
    {
      slug: 'maquillage',
      title: 'MAQUILLAGE',
      subtitle: 'Essentiels beauté au quotidien.',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      actionText: 'DÉCOUVRIR MAQUILLAGE →'
    },
    {
      slug: 'bienetre',
      title: 'BIEN-ÊTRE',
      subtitle: 'Sérénité & bien-être intérieur.',
      image: 'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=800&auto=format&fit=crop&q=80',
      actionText: 'DÉCOUVRIR BIEN-ÊTRE →'
    }
  ];

  const handleCategoryClick = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      style={{
        padding: '48px 0 36px 0',
        background: 'var(--bg)',
      }}
    >
      <div className="wrap">
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.4rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text)',
            marginBottom: '24px',
          }}
        >
          SHOP THE TANEEM'EDIT
        </h2>

        <div className="edit-cat-grid">
          {editCategories.map(cat => (
            <div
              key={cat.slug}
              onClick={() => handleCategoryClick(cat.slug)}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--line)',
                borderRadius: '0px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  aspectRatio: '1 / 1',
                  overflow: 'hidden',
                  borderRadius: '0px',
                  position: 'relative',
                  background: 'var(--blush-soft)',
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '0px',
                  }}
                />
              </div>

              <div style={{ padding: '16px 18px 20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--text)',
                      marginBottom: '4px',
                    }}
                  >
                    {cat.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '0.82rem',
                      color: 'var(--text-soft)',
                      lineHeight: 1.4,
                      marginBottom: '16px',
                    }}
                  >
                    {cat.subtitle}
                  </p>
                </div>

                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text)',
                    borderBottom: '1px solid var(--text)',
                    display: 'inline-block',
                    width: 'fit-content',
                    paddingBottom: '2px',
                  }}
                >
                  {cat.actionText}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
