import React from 'react';
import { useWishlist } from '../../store/WishlistContext';
import { useCart } from '../../store/CartContext';
import { useToast } from '../../store/ToastContext';

export default function WishlistDrawer() {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, removeFromWishlist } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();
  const { showToast } = useToast();

  if (!isWishlistOpen) return null;

  const handleMoveToCart = (product: any) => {
    addToCart(product);
    removeFromWishlist(product.id);
    showToast(`${product.name} ajouté à votre sac !`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[var(--ivoire)] shadow-2xl flex flex-col justify-between border-l border-[var(--line)]">
          {/* Header */}
          <div className="p-6 border-b border-[var(--line)] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <span className="text-lg">♡</span>
              <h2 className="text-xl font-serif text-[var(--espresso)] font-semibold tracking-wide">
                MY WISHLIST ({wishlist.length})
              </h2>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="w-9 h-9 rounded-full bg-[var(--ivoire)] hover:bg-[var(--rose-poudre)] flex items-center justify-center text-[var(--espresso)] text-sm transition-colors"
            >
              ✕
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlist.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <span className="text-4xl block text-[var(--taupe)]">♡</span>
                <p className="text-sm font-serif text-[var(--espresso)] font-medium">
                  Votre liste d'envies est vide.
                </p>
                <p className="text-xs text-[var(--text-soft)] font-sans">
                  Explorez nos rituels beauté et sauvegardez vos coups de cœur.
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="btn-outline text-xs py-3 px-6 mt-2"
                >
                  DÉCOUVRIR LE STORE
                </button>
              </div>
            ) : (
              wishlist.map(item => (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-[var(--line)] flex items-center gap-4 shadow-sm"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[var(--ivoire)] flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="text-sm font-serif font-semibold text-[var(--espresso)] truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs font-sans text-[var(--rose-vieilli)] font-semibold">
                      {item.priceFormatted}
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="btn-primary text-[10px] py-1.5 px-3 uppercase tracking-wider"
                      >
                        AJOUTER AU SAC
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-[10px] text-red-500 hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlist.length > 0 && (
            <div className="p-6 bg-white border-t border-[var(--line)] space-y-3">
              <button
                onClick={() => {
                  wishlist.forEach(item => addToCart(item));
                  setIsWishlistOpen(false);
                  setIsCartOpen(true);
                  showToast('Tous les articles ont été ajoutés à votre sac !', 'success');
                }}
                className="btn-primary w-full py-3.5 text-xs tracking-widest uppercase"
              >
                TOUT AJOUTER AU SAC
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
