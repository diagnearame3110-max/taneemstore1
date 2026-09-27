import React from 'react';

export default function OurStorySection() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto border-t border-[var(--line)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Brand Story Narrative */}
        <div className="space-y-6">
          <span className="text-xs font-sans font-semibold tracking-[0.25em] text-[var(--taupe)] uppercase block">
            OUR STORY
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[var(--espresso)] tracking-tight leading-tight">
            IT STARTED WITH A SIMPLE IDEA.
          </h2>
          <div className="space-y-4 text-sm md:text-base text-[var(--text-soft)] font-sans leading-relaxed">
            <p>
              Taneem'Store was created from a love for beauty, self-care and the little rituals that make us feel good.
            </p>
            <p>
              We believe taking care of yourself shouldn't feel complicated. It should feel good.
            </p>
            <p>
              Taneem'Store is a space for discovering carefully selected beauty, body care and wellness essentials — created for women who want to make self-care part of their everyday life.
            </p>
          </div>
          <div className="pt-4 border-t border-[var(--line)]">
            <p className="text-xs font-serif font-semibold tracking-widest text-[var(--espresso)] uppercase">
              WELCOME TO TANEEM’STORE.
            </p>
            <p className="text-xs font-sans text-[var(--rose-vieilli)] tracking-widest uppercase mt-1">
              THE CLEAN GIRLS ERA.
            </p>
          </div>
        </div>

        {/* Right Column: Floral & Bath Aesthetics */}
        <div className="relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-8 border-white">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80"
              alt="Taneem Store Flowers and Self Care"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl border border-[var(--line)] shadow-lg max-w-xs hidden sm:block">
            <p className="font-serif italic text-xs text-[var(--espresso)]">
              "Clean • Féminin • Premium • Minimaliste • Moderne"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
