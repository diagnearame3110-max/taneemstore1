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
      className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[var(--bg)] w-full max-w-[390px] md:max-w-[720px] min-h-[60vh] max-h-[85vh] rounded-3xl border border-[var(--line)] shadow-2xl overflow-hidden flex flex-col md:flex-row relative transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[var(--text)] border border-[var(--line)] shadow-sm flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Media Column (Image + Thumbnails) */}
        {/* On mobile: doubled height ~200px (double of 96px); On desktop: 310px width */}
        <div className="w-full md:w-[310px] md:shrink-0 bg-[#FAF7F5] flex flex-col md:border-r border-[var(--line)]">
          {/* Main Display Image Container: object-contain preserves all product shapes */}
          <div className="relative w-full h-[200px] sm:h-[220px] md:h-[300px] flex items-center justify-center p-3 overflow-hidden bg-white/40">
            <img
              src={selectedImage || product.image || allImages[0]}
              alt={product.name}
              onError={e => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&auto=format';
              }}
              className="w-full h-full object-contain transition-opacity duration-200"
            />

            {/* Navigation Arrows if multiple photos */}
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  title="Photo précédente"
                  aria-label="Photo précédente"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white backdrop-blur-xs border border-[var(--line)] flex items-center justify-center text-[var(--text)] shadow-xs transition-transform hover:scale-105 cursor-pointer"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  title="Photo suivante"
                  aria-label="Photo suivante"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white backdrop-blur-xs border border-[var(--line)] flex items-center justify-center text-[var(--text)] shadow-xs transition-transform hover:scale-105 cursor-pointer"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </>
            )}

            {/* Photo Counter Pill */}
            {allImages.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/65 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {allImages.indexOf(selectedImage) + 1} / {allImages.length}
              </div>
            )}
          </div>

          {/* Thumbnails Row */}
          {allImages.length > 1 && (
            <div className="flex gap-2 p-2 overflow-x-auto border-t border-[var(--line)] bg-white/70">
              {allImages.map((img, idx) => {
                const isActive = img === selectedImage;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-lg overflow-hidden p-0.5 shrink-0 border bg-[#FAF7F5] transition-all cursor-pointer ${
                      isActive
                        ? 'border-[var(--pink-deep)] ring-1.5 ring-[var(--pink-deep)] opacity-100 scale-105'
                        : 'border-[var(--line)] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Miniature ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="flex-1 flex flex-col p-4 sm:p-5 md:p-6 overflow-y-auto">
          {/* Category Tag */}
          <div className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-[var(--pink-deep)] mb-1">
            {product.categorySlug}
          </div>

          {/* Title */}
          <h2 className="text-base sm:text-lg md:text-xl font-serif font-bold text-[var(--text)] leading-snug mb-1 line-clamp-2">
            {product.name}
          </h2>

          {/* Price & Stock */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-base sm:text-lg font-extrabold text-[var(--pink-deep)]">
              {product.priceFormatted || formatPrice(product.price)}
            </span>
            <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
              product.inStock ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {product.inStock ? '● En stock' : '○ Rupture'}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[var(--text-soft)] leading-relaxed mb-3 line-clamp-3">
            {product.description || "Soin d'exception sélectionné pour votre routine quotidienne."}
          </p>

          {/* Color / Teinte Selection (if available) */}
          {Array.isArray(product.colors) && product.colors.length > 0 && (
            <div className="mb-3 p-2.5 rounded-xl bg-[#FAF7F5] border border-[var(--line)]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-[var(--text)] uppercase tracking-wider text-[10px]">
                  Teinte :
                </span>
                <span className="font-semibold text-[var(--pink-deep)]">
                  {selectedColor?.name || 'Choisir une teinte'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 items-center">
                {product.colors.map(c => {
                  const isSelected = selectedColor?.id === c.id || (!selectedColor && product.colors?.[0]?.id === c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectColor(c)}
                      title={c.name}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--pink-deep)] bg-white font-bold text-[var(--text)] shadow-xs'
                          : 'border-[var(--line)] bg-[#FAF8F4] text-[var(--text-soft)] hover:bg-white'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                        style={{ background: c.hex || '#E8A598' }}
                      />
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Actions Row: Stepper + Add to Cart */}
          <div className="mt-auto pt-3 border-t border-[var(--line)] flex items-center gap-2.5">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-[var(--line)] rounded-full bg-white h-10 px-1 shrink-0 shadow-xs">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                aria-label="Diminuer la quantité"
                className="w-7 h-7 flex items-center justify-center font-bold text-sm text-[var(--text)] hover:text-[var(--pink-deep)] cursor-pointer"
              >
                -
              </button>
              <span className="w-6 text-center font-bold text-xs sm:text-sm text-[var(--text)]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                aria-label="Augmenter la quantité"
                className="w-7 h-7 flex items-center justify-center font-bold text-sm text-[var(--text)] hover:text-[var(--pink-deep)] cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 h-10 px-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                product.inStock
                  ? 'bg-[var(--pink)] hover:bg-[var(--pink-deep)] text-white shadow-sm hover:shadow cursor-pointer'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>{product.inStock ? 'Ajouter au panier' : 'Rupture'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
