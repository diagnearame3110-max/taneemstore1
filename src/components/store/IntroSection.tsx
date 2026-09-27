import React from 'react';

export default function IntroSection() {
  const scrollToCategory = () => {
    const el = document.getElementById('the-taneem-edit');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 text-center px-6" style={{ background: 'var(--ivoire)', borderBottom: '1px solid var(--line)' }}>
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl md:text-5xl font-serif text-[var(--espresso)] tracking-tight leading-tight">
          BEAUTY SHOULD FEEL SIMPLE.
        </h2>
        <p className="text-sm md:text-base font-sans text-[var(--text-soft)] leading-relaxed max-w-xl mx-auto">
          Discover carefully selected essentials for your skin, body, beauty and everyday wellness.
        </p>
        <div className="pt-2">
          <button 
            onClick={scrollToCategory}
            className="btn-outline text-xs tracking-widest uppercase py-3.5 px-8 hover:opacity-90 transition-all"
          >
            DISCOVER TANEEM'STORE
          </button>
        </div>
      </div>
    </section>
  );
}
