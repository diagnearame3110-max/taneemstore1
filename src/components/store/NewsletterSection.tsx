import React, { useState } from 'react';
import { useToast } from '../../store/ToastContext';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Veuillez entrer une adresse email valide.', 'error');
      return;
    }
    showToast('Merci pour votre inscription à la communauté Clean Girls Era !', 'success');
    setEmail('');
  };

  return (
    <section className="py-20 px-6 max-w-5xl mx-auto my-8">
      <div 
        className="rounded-3xl p-8 sm:p-14 text-center border border-[var(--line)] shadow-xl relative overflow-hidden"
        style={{ background: 'var(--ivoire)' }}
      >
        <div className="max-w-xl mx-auto space-y-6">
          <span className="text-xs font-sans font-semibold tracking-[0.25em] text-[var(--rose-vieilli)] uppercase block">
            THE COMMUNITY
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[var(--espresso)] tracking-tight">
            JOIN THE CLEAN GIRLS ERA.
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-soft)] font-sans leading-relaxed">
            Get first access to new drops, exclusive offers & beauty tips.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 pt-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full bg-white border border-[var(--line)] rounded-full px-6 py-3.5 text-xs font-sans text-[var(--espresso)] placeholder:text-[var(--text-soft)] focus:outline-none focus:border-[var(--rose-vieilli)] transition-colors"
            />
            <button
              type="submit"
              className="btn-primary w-full sm:w-auto text-xs py-3.5 px-8 whitespace-nowrap"
            >
              JOIN US →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
