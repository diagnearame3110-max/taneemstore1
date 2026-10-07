import React from 'react';
import { useProducts } from '../../store/ProductsContext';
import { SEED_CATEGORIES } from '../../data/seedData';
import { normalizeCategorySlug } from '../../utils/format';

export default function ExploreCategories() {
  const { categories, products } = useProducts() || {};
  const validCategories = Array.isArray(categories) && categories.length > 0 ? categories : SEED_CATEGORIES;
  const sorted = [...validCategories].sort((a, b) => (a.order || 0) - (b.order || 0));

  const scrollToCategory = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + (window.scrollY || window.pageYOffset || 0) - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const scrollToFirst = () => {
    const el = document.getElementById('boutique') || (sorted.length > 0 ? document.getElementById(sorted[0].slug) : null);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + (window.scrollY || window.pageYOffset || 0) - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    } else {
      window.location.href = '/#boutique';
    }
  };

  return (
    <section
      style={{
        padding: '40px 0 20px',
        background: 'var(--bg)',
      }}
    >
      <div className="wrap">
        {/* Header section with Title + Subtitle + Action Link */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '24px',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 1.85rem)',
                fontWeight: 700,
                color: 'var(--text)',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Explorez nos catégories
            </h2>
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--text-soft)',
                marginTop: '6px',
                marginBottom: 0,
              }}
            >
              Trouvez rapidement ce dont vous avez besoin
            </p>
          </div>

          <button
            onClick={scrollToFirst}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--pink)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 0',
              transition: 'gap 0.2s ease, color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--pink-deep)';
              e.currentTarget.style.gap = '10px';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--pink)';
              e.currentTarget.style.gap = '6px';
            }}
          >
            Voir tout <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>&rarr;</span>
          </button>
        </div>

        {/* Categories horizontal track / grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            overflowX: 'auto',
            paddingBottom: '8px',
          }}
        >
          {sorted.map(cat => {
            const targetSlug = normalizeCategorySlug(cat.slug);
            const count = (products || []).filter(p => p && normalizeCategorySlug(p.categorySlug || (p as any).category_slug) === targetSlug).length;
            const firstProd = (products || []).find(p => p && normalizeCategorySlug(p.categorySlug || (p as any).category_slug) === targetSlug);
            const image = firstProd?.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80';
            const catTitle = (cat.title || '').replace(/&amp;/g, '&');

            return (
              <div
                key={cat.slug}
                onClick={() => scrollToCategory(cat.slug)}
                style={{
                  position: 'relative',
                  height: '220px',
                  borderRadius: '0px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                  transition: 'transform 0.25s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.25s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.12)';
                  const imgEl = e.currentTarget.querySelector('img');
                  if (imgEl) imgEl.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.06)';
                  const imgEl = e.currentTarget.querySelector('img');
                  if (imgEl) imgEl.style.transform = 'scale(1)';
                }}
              >
                {/* Background Image */}
                <img
                  src={image}
                  alt={catTitle}
                  onError={e => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80';
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                />

                {/* Dark Bottom Gradient Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0) 85%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '16px 18px',
                  }}
                >
                  <h3
                    style={{
                      color: '#ffffff',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      margin: 0,
                      fontFamily: "'Inter', sans-serif",
                      letterSpacing: '-0.01em',
                      lineHeight: 1.25,
                      textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                    }}
                  >
                    {catTitle}
                  </h3>
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.88)',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      marginTop: '4px',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    }}
                  >
                    {count} {count > 1 ? 'produits' : 'produit'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

