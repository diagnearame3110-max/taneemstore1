import React from 'react';

interface SignatureSectionProps {
  onOpenSkinQuiz: () => void;
}

export default function SignatureSection({ onOpenSkinQuiz }: SignatureSectionProps) {
  return (
    <section 
      className="py-24 px-6 relative overflow-hidden my-12"
      style={{
        background: 'linear-gradient(135deg, #FAF8F4 0%, #E7CDD2 100%)',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)'
      }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text */}
        <div className="space-y-6 text-left">
          <span className="text-xs font-sans font-semibold tracking-[0.25em] text-[var(--rose-vieilli)] uppercase block">
            SECTION SIGNATURE
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[var(--espresso)] tracking-tight leading-tight">
            COMMENCE PAR UNE PEAU SAINE.
          </h2>
          <p className="text-sm md:text-base text-[var(--text-soft)] font-sans leading-relaxed">
            We believe skincare doesn't have to be complicated. It starts with understanding your skin, choosing what it needs and creating a ritual you can actually enjoy.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={onOpenSkinQuiz}
              className="btn-primary"
            >
              DISCOVER YOUR ROUTINE
            </button>
          </div>
          <div className="pt-2">
            <button
              onClick={onOpenSkinQuiz}
              className="text-xs font-medium text-[var(--espresso)] hover:text-[var(--rose-vieilli)] transition-colors underline underline-offset-4 tracking-wider uppercase"
            >
              FIND YOUR ROUTINE — Take the Taneem'Store Skin Quiz →
            </button>
          </div>
        </div>

        {/* Right Column: Visual Cream Texture & Product Aesthetic */}
        <div className="relative flex justify-center items-center">
          <div className="w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative border-4 border-white/60">
            <img
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"
              alt="Clean Skincare Ritual Texture"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white text-xs font-sans font-medium bg-black/30 backdrop-blur-md p-4 rounded-xl">
              "Simple. Clean. Effective rituals for everyday radiance."
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
