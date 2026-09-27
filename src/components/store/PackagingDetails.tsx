import React from 'react';

export default function PackagingDetails() {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-[var(--line)]">
      <div className="bg-[var(--rose-poudre)]/30 rounded-3xl p-8 sm:p-12 border border-[var(--line)] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs font-sans font-semibold tracking-[0.25em] text-[var(--rose-vieilli)] uppercase block">
            UNBOXING EXPERIENCE
          </span>
          <h2 className="text-3xl font-serif text-[var(--espresso)] tracking-tight">
            PACKAGING & DETAILS
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-soft)] font-sans leading-relaxed">
            Every order is carefully prepared in our signature soft-pink gift bags, accompanied by personalized thank you cards and delicate protective wrapping. We believe receiving your order should feel like receiving a present to yourself.
          </p>
          <ul className="space-y-2 text-xs font-sans text-[var(--espresso)] font-medium pt-2">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--rose-vieilli)]" /> Signature Taneem'Store Gift Bag
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--rose-vieilli)]" /> Custom Thank You Note & Card
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--rose-vieilli)]" /> Eco-friendly Protective Ribbon & Cushioning
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square rounded-2xl overflow-hidden shadow-md bg-white border border-[var(--line)]">
            <img
              src="https://images.unsplash.com/photo-1608248597261-8131d24c08c9?w=500&auto=format&fit=crop&q=80"
              alt="Luxury Taneem Gift Bag"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden shadow-md bg-white border border-[var(--line)]">
            <img
              src="https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=500&auto=format&fit=crop&q=80"
              alt="Personalized Card Details"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
