import React, { useState } from 'react';

export default function TaneemJournal() {
  const [activeArticle, setActiveArticle] = useState<number | null>(null);

  const articles = [
    {
      id: 1,
      category: 'SKINCARE',
      title: '5 habits for healthier-looking skin',
      excerpt: 'Simple daily steps to strengthen your skin barrier and boost natural radiance without overloading your routine.',
      content: 'Achieving a healthy glow starts with consistency. Focus on gentle double cleansing, daily hydration with hyaluronic acid, never skipping broad-spectrum SPF, getting 8 hours of sleep, and keeping your skincare routine focused on ingredients your skin truly needs.',
      image: 'https://images.unsplash.com/photo-1512290900673-700200411b93?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      category: 'BODY CARE',
      title: 'How to build your perfect shower ritual',
      excerpt: 'Turn your everyday shower into a mindful, spa-like experience that relaxes the body and refreshes the mind.',
      content: 'Elevate your daily shower by dry brushing before stepping in, using warm (not hot) water, choosing a gentle nourishing body cleanser like OUAI or Tree Hut, and applying your body oil or lotion within 3 minutes of drying off.',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      category: 'WELLNESS',
      title: 'Your Sunday reset routine',
      excerpt: 'Essential wellness rituals to decompress, rejuvenate and start your week feeling grounded and calm.',
      content: 'Use Sundays for gentle care: light a scented candle, apply a hydration face mask, sip warm herbal tea, journal your intention for the week ahead, and enjoy a technology detox 1 hour before sleep.',
      image: 'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 4,
      category: 'BEAUTY',
      title: 'The effortless clean-girl beauty routine',
      excerpt: 'Minimalist makeup essentials for a fresh, dewy, put-together look in less than 5 minutes.',
      content: 'The clean girl look relies on fresh skin, brushed-up brows, a touch of hydrating cream blush on the cheeks, and a high-shine non-sticky lip oil for effortless elegance.',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto border-t border-[var(--line)]">
      <div className="text-center mb-12">
        <span className="text-xs font-sans font-semibold tracking-[0.25em] text-[var(--taupe)] uppercase block mb-1">
          EDITORIAL & RITUALS
        </span>
        <h2 className="text-3xl md:text-4xl font-serif text-[var(--espresso)] tracking-tight">
          THE TANEEM JOURNAL
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map(art => (
          <article
            key={art.id}
            onClick={() => setActiveArticle(art.id)}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[var(--line)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
          >
            <div className="aspect-[4/3] overflow-hidden bg-[var(--ivoire)] relative">
              <img
                src={art.image}
                alt={art.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-[var(--rose-vieilli)] uppercase block mb-2">
                  {art.category}
                </span>
                <h3 className="text-base font-serif font-semibold text-[var(--espresso)] leading-snug mb-2 group-hover:text-[var(--rose-vieilli)] transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-[var(--text-soft)] leading-relaxed font-sans">
                  {art.excerpt}
                </p>
              </div>
              <button className="text-xs font-semibold tracking-widest text-[var(--espresso)] group-hover:text-[var(--rose-vieilli)] transition-colors inline-flex items-center gap-1">
                READ MORE →
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="text-center mt-12">
        <a
          href="#journal"
          className="btn-outline text-xs tracking-widest py-3 px-8"
        >
          READ THE JOURNAL →
        </a>
      </div>

      {/* Article Modal */}
      {activeArticle !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[var(--ivoire)] hover:bg-[var(--rose-poudre)] flex items-center justify-center text-[var(--espresso)] transition-colors"
            >
              ✕
            </button>
            {(() => {
              const art = articles.find(a => a.id === activeArticle);
              if (!art) return null;
              return (
                <div className="space-y-6">
                  <span className="text-xs font-bold tracking-[0.2em] text-[var(--rose-vieilli)] uppercase block">
                    {art.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif text-[var(--espresso)] leading-tight">
                    {art.title}
                  </h3>
                  <div className="aspect-video rounded-2xl overflow-hidden">
                    <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-sm font-sans text-[var(--text-soft)] leading-relaxed">
                    {art.content}
                  </p>
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="btn-primary w-full py-3"
                  >
                    CLOSE ARTICLE
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
}
