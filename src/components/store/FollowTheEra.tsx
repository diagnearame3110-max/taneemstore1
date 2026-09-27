import React from 'react';

export default function FollowTheEra() {
  const images = [
    {
      url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
      caption: 'Bath & Body Rituals'
    },
    {
      url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
      caption: 'Clean Skincare Drops'
    },
    {
      url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80',
      caption: 'Minimalist Bathroom Vibe'
    },
    {
      url: 'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=600&auto=format&fit=crop&q=80',
      caption: 'Sunday Self-Care Moments'
    },
    {
      url: 'https://images.unsplash.com/photo-1608248597261-8131d24c08c9?w=600&auto=format&fit=crop&q=80',
      caption: 'Luxury Packaging & Details'
    }
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto border-t border-[var(--line)]">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-serif text-[var(--espresso)] tracking-tight mb-2">
          FOLLOW THE ERA
        </h2>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-sans font-semibold tracking-[0.2em] text-[var(--rose-vieilli)] hover:underline uppercase block mb-1"
        >
          @taneemstore
        </a>
        <p className="text-xs text-[var(--text-soft)] font-sans">
          Beauty • Self-care • Wellness • Lifestyle
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {images.map((img, idx) => (
          <a
            key={idx}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square rounded-2xl overflow-hidden bg-[var(--ivoire)] border border-[var(--line)] shadow-sm"
          >
            <img
              src={img.url}
              alt={img.caption}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3 text-center">
              <span className="text-white text-xs font-sans font-medium">
                {img.caption}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
