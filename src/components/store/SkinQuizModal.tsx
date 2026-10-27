import React, { useState } from 'react';
import { useProducts } from '../../store/ProductsContext';
import { useCart } from '../../store/CartContext';
import { useToast } from '../../store/ToastContext';

interface SkinQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SkinQuizModal({ isOpen, onClose }: SkinQuizModalProps) {
  const [step, setStep] = useState(1);
  const [skinType, setSkinType] = useState<string | null>(null);
  const [mainConcern, setMainConcern] = useState<string | null>(null);
  const [preferredGoal, setPreferredGoal] = useState<string | null>(null);

  const { products } = useProducts();
  const { addToCart, setIsCartOpen } = useCart();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleReset = () => {
    setStep(1);
    setSkinType(null);
    setMainConcern(null);
    setPreferredGoal(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  // Recommended products based on selections
  const recommendedProducts = products.filter(p => p.categorySlug === 'skincare').slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[var(--bg)] rounded-2xl max-w-lg w-full p-4 sm:p-6 relative border border-[var(--line)] shadow-2xl max-h-[88vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-[var(--blush)] flex items-center justify-center text-[var(--text)] transition-colors border border-[var(--line)] shadow-xs cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center mb-4 pr-6 pl-6">
          <span className="text-[9px] font-sans font-bold tracking-[0.25em] text-[var(--pink-deep)] uppercase block mb-0.5">
            TANEEM'STORE BEAUTY CONSULTANT
          </span>
          <h2 className="text-xl sm:text-2xl font-serif text-[var(--text)]">
            YOUR CUSTOM SKINCARE ROUTINE
          </h2>
          <p className="text-[11px] text-[var(--text-soft)] mt-0.5 font-sans">
            Étape {step} sur 3 — Répondez à 3 questions rapides
          </p>
        </div>

        {/* Question 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-serif font-semibold text-[var(--espresso)] text-center">
              1. Quel est votre type de peau principal ?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {['Normale / Mixte', 'Sèche & Déshydratée', 'Grasse & Suette aux imperfections', 'Sensible & Réactive'].map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    setSkinType(opt);
                    setStep(2);
                  }}
                  className="p-2.5 sm:p-3 bg-white border border-[var(--line)] hover:border-[var(--pink-deep)] hover:bg-[var(--blush)]/40 rounded-xl text-xs font-sans text-[var(--text)] font-medium text-center transition-all cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-serif font-semibold text-[var(--espresso)] text-center">
              2. Quelle est votre priorité absolue ?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {['Éclat du teint & Taches', 'Hydratation intense 24h', 'Lisser la texture de peau', 'Routine épurée clean-girl'].map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    setMainConcern(opt);
                    setStep(3);
                  }}
                  className="p-2.5 sm:p-3 bg-white border border-[var(--line)] hover:border-[var(--pink-deep)] hover:bg-[var(--blush)]/40 rounded-xl text-xs font-sans text-[var(--text)] font-medium text-center transition-all cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-serif font-semibold text-[var(--espresso)] text-center">
              3. Quelle texture préférez-vous pour vos soins ?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {['Sérum fluide & Léger', 'Baume / Masque onctueux', 'Huile nourissante fine', 'Gommage / Nettoyant doux'].map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    setPreferredGoal(opt);
                    setStep(4); // Results
                  }}
                  className="p-2.5 sm:p-3 bg-white border border-[var(--line)] hover:border-[var(--pink-deep)] hover:bg-[var(--blush)]/40 rounded-xl text-xs font-sans text-[var(--text)] font-medium text-center transition-all cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-[var(--line)] text-center">
              <p className="text-xs text-[var(--rose-vieilli)] font-semibold uppercase tracking-wider">
                VOTRE PROFIL BEAUTÉ :
              </p>
              <p className="text-sm font-serif font-semibold text-[var(--espresso)] mt-1">
                {skinType} • {mainConcern}
              </p>
            </div>

            <h3 className="text-sm font-serif font-semibold text-[var(--espresso)]">
              VOS 3 ESSENTIELS RECOMMANDÉS :
            </h3>

            <div className="space-y-3">
              {recommendedProducts.map(prod => (
                <div
                  key={prod.id}
                  className="bg-white p-3 rounded-2xl border border-[var(--line)] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-xs font-serif font-semibold text-[var(--espresso)] truncate max-w-[200px]">
                        {prod.name}
                      </h4>
                      <p className="text-[11px] font-sans text-[var(--rose-vieilli)] font-medium">
                        {prod.priceFormatted}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(prod);
                      showToast(`${prod.name} ajouté à votre sac !`, 'success');
                    }}
                    className="btn-primary text-[10px] py-1.5 px-3 whitespace-nowrap"
                  >
                    + AJOUTER
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  recommendedProducts.forEach(p => addToCart(p));
                  handleClose();
                  setIsCartOpen(true);
                  showToast('Routine complète ajoutée à votre sac !', 'success');
                }}
                className="btn-primary flex-1 py-3 text-xs uppercase tracking-widest"
              >
                AJOUTER LA ROUTINE COMPLÈTE
              </button>
              <button
                onClick={handleReset}
                className="btn-outline py-3 px-4 text-xs"
              >
                RECOMMENCER
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
