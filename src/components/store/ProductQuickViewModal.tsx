import React, { useState, useEffect, useMemo } from 'react';
import type { Product, ProductColor } from '../../data/types';
import { useCart } from '../../store/CartContext';
import { useToast } from '../../store/ToastContext';
import { formatPrice } from '../../utils/format';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductQuickViewModal({ product, onClose }: Props) {
  const { addToCart, openCart } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);

  // Collect all unique images: main image + gallery images + color images
  const allImages = useMemo(() => {
    if (!product) return [];
    const list: string[] = [];
    if (product.image) list.push(product.image);
    if (Array.isArray(product.gallery)) {
      product.gallery.forEach(img => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    if (Array.isArray(product.colors)) {
      product.colors.forEach(c => {
        if (c.image && !list.includes(c.image)) list.push(c.image);
      });
    }
    return list.length > 0
      ? list
      : ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&auto=format'];
  }, [product]);

  useEffect(() => {
    setQuantity(1);
    if (product) {
      const defaultImg = product.image || allImages[0] || '';
      setSelectedImage(defaultImg);
      if (Array.isArray(product.colors) && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
        if (product.colors[0].image) {
          setSelectedImage(product.colors[0].image);
        }
      } else {
        setSelectedColor(null);
      }
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && product) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const handleSelectColor = (color: ProductColor) => {
    setSelectedColor(color);
    if (color.image) {
      setSelectedImage(color.image);
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = allImages.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setSelectedImage(allImages[nextIndex]);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = allImages.indexOf(selectedImage);
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setSelectedImage(allImages[prevIndex]);
  };

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product, quantity, selectedColor?.name, selectedImage);
    const colorNote = selectedColor ? ` (${selectedColor.name})` : '';
    showToast(`"${product.name}${colorNote}" (${quantity}) ajouté au panier !`, 'success');
    onClose();
    openCart();
  };

  return (
    <div
      className="fixed inset-0 z-[110] bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[360px] sm:max-w-[400px] md:max-w-[760px] max-h-[92vh] rounded-[28px] border border-stone-200/70 shadow-[0_25px_60px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col md:flex-row relative transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Subtle, Minimalist Close button */}
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-3.5 right-3.5 z-40 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-500 hover:text-stone-900 border border-stone-200/80 shadow-xs flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Media Column: Soft luxury studio backdrop */}
        <div className="w-full md:w-[330px] md:shrink-0 bg-[#FAF8F5] flex flex-col justify-center items-center relative md:border-r border-stone-100 shrink-0">
          <div className="relative w-full h-[220px] sm:h-[240px] md:h-[340px] flex items-center justify-center p-5 sm:p-6">
            <img
              src={selectedImage || product.image || allImages[0]}
              alt={product.name}
              onError={e => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&auto=format';
              }}
              className="max-w-full max-h-full object-contain drop-shadow-xs transition-transform duration-300 hover:scale-105"
            />

            {/* Navigation Arrows (discreet, only if multiple photos) */}
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  title="Précédent"
                  aria-label="Photo précédente"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-xs flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  title="Suivant"
                  aria-label="Photo suivante"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-xs flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Minimalist Pagination Dots */}
          {allImages.length > 1 && (
            <div className="flex gap-1.5 pb-3 items-center justify-center">
              {allImages.map((img, idx) => {
                const isActive = img === selectedImage;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    aria-label={`Photo ${idx + 1}`}
                    className={`transition-all rounded-full cursor-pointer ${
                      isActive
                        ? 'w-4 h-1.5 bg-[var(--pink-deep)]'
                        : 'w-1.5 h-1.5 bg-stone-300 hover:bg-stone-400'
                    }`}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Details Column: Ordered, properly aligned on both desktop & mobile */}
        <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left p-6 sm:p-7 md:p-8 md:pr-12 overflow-y-auto">
          {/* Eyebrow Category */}
          <span className="inline-block text-[11px] uppercase font-bold tracking-[0.25em] text-[var(--pink-deep)] mb-1.5">
            {product.categorySlug}
          </span>

          {/* Title: Refined, elegant */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-stone-900 leading-snug mb-2.5 max-w-sm">
            {product.name}
          </h2>

          {/* Price & Stock Badge */}
          <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
            <span className="text-xl sm:text-2xl font-extrabold text-[var(--pink-deep)]">
              {product.priceFormatted || formatPrice(product.price)}
            </span>
            <span className="text-stone-300">•</span>
            <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
              product.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}>
              {product.inStock ? 'En stock' : 'Rupture'}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4 max-w-sm line-clamp-3">
            {product.description || "Soin d'exception sélectionné pour votre routine quotidienne."}
          </p>

          {/* Color Selector (if present) */}
          {Array.isArray(product.colors) && product.colors.length > 0 && (
            <div className="w-full mb-4">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5 text-xs">
                <span className="text-stone-400 uppercase tracking-wider text-[10px] font-bold">Teinte :</span>
                <span className="font-semibold text-stone-800">{selectedColor?.name || 'Choisir'}</span>
              </div>
              <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start">
                {product.colors.map(c => {
                  const isSelected = selectedColor?.id === c.id || (!selectedColor && product.colors?.[0]?.id === c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectColor(c)}
                      title={c.name}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--pink-deep)] bg-white font-bold text-stone-900 shadow-xs'
                          : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-white'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                        style={{ background: c.hex || '#E8A598' }}
                      />
                      <span className="text-xs">{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions Row: Properly aligned (centered on mobile, left-aligned on desktop) */}
          <div className="w-full pt-4 border-t border-stone-100 flex items-center justify-center md:justify-start gap-3 mb-3">
            {/* Quantity Stepper */}
            <div className="flex items-center bg-stone-100 rounded-full h-11 px-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                aria-label="Diminuer la quantité"
                className="w-8 h-8 flex items-center justify-center font-bold text-sm text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                -
              </button>
              <span className="w-7 text-center font-bold text-sm text-stone-800">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                aria-label="Augmenter la quantité"
                className="w-8 h-8 flex items-center justify-center font-bold text-sm text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 md:flex-initial md:px-7 h-11 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                product.inStock
                  ? 'bg-[var(--pink)] hover:bg-[var(--pink-deep)] text-white shadow-xs hover:shadow cursor-pointer'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>{product.inStock ? 'Ajouter au panier' : 'Rupture'}</span>
            </button>
          </div>

          {/* Reassurance Badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3.5 gap-y-1 text-[11px] text-stone-500">
            <span className="inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              100% Authentique
            </span>
            <span className="inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Livraison Dakar
            </span>
            <span className="inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Paiement à la livraison
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
