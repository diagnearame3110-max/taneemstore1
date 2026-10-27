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
      className="fixed inset-0 z-[110] bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[28px] border border-stone-200/70 shadow-[0_25px_60px_rgba(0,0,0,0.18)] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row relative transition-all w-[min(94vw,460px)] md:w-[780px] md:max-w-[94vw]"
        style={{
          maxHeight: '92vh',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Subtle, Minimalist Close button (40px x 40px) */}
        <button
          onClick={onClose}
          aria-label="Fermer"
          style={{ width: '40px', height: '40px' }}
          className="absolute top-3.5 right-3.5 z-40 rounded-full bg-white/95 hover:bg-white text-stone-500 hover:text-stone-900 border border-stone-200/80 shadow-xs flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Media Column: Soft luxury studio backdrop */}
        <div className="w-full md:w-[350px] md:shrink-0 bg-[#FAF8F5] flex flex-col justify-center items-center relative md:border-r border-stone-100 shrink-0">
          <div
            className="relative w-full flex items-center justify-center overflow-hidden"
            style={{
              aspectRatio: '1 / 1',
              padding: '20px 20px 0',
            }}
          >
            <img
              src={selectedImage || product.image || allImages[0]}
              alt={product.name}
              onError={e => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&auto=format';
              }}
              className="w-full h-full object-contain drop-shadow-xs transition-transform duration-300 hover:scale-105"
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
            <div className="flex gap-1.5 py-2.5 items-center justify-center">
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

        {/* Details Column: Ordered: Title → Price + Stock → Description → Actions */}
        <div
          className="flex-1 min-h-0 flex flex-col justify-start text-left items-start md:overflow-y-auto"
          style={{
            padding: '24px 22px 28px',
            gap: '16px',
          }}
        >
          {/* 1. Title: font-size 1.35rem */}
          <h2
            className="font-serif font-bold text-stone-900 leading-snug max-w-sm m-0"
            style={{ fontSize: '1.35rem' }}
          >
            {product.name}
          </h2>

          {/* 2. Price & Stock Status: font-size 1.5rem / 0.85rem */}
          <div className="flex items-center gap-2.5 flex-wrap m-0">
            <span
              className="font-bold text-[var(--pink-deep)] leading-none"
              style={{ fontSize: '1.5rem' }}
            >
              {product.priceFormatted || formatPrice(product.price)}
            </span>
            {product.inStock ? (
              <span
                className="text-emerald-600 font-medium flex items-center gap-1.5 leading-none"
                style={{ fontSize: '0.85rem' }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                En stock
              </span>
            ) : (
              <span
                className="text-rose-500 font-medium leading-none"
                style={{ fontSize: '0.85rem' }}
              >
                Épuisé
              </span>
            )}
          </div>

          {/* 3. Product Description: margin 0; font-size 0.95rem; line-height 1.6; color text-soft; overflow-wrap anywhere */}
          <p
            className="m-0"
            style={{
              margin: 0,
              fontSize: '0.95rem',
              lineHeight: 1.6,
              color: 'var(--text-soft, #6E6272)',
              overflowWrap: 'anywhere',
            }}
          >
            {product.description || "Soin d'exception sélectionné pour votre routine quotidienne."}
          </p>

          {/* 4. Color Selector (if present) */}
          {Array.isArray(product.colors) && product.colors.length > 0 && (
            <div className="w-full">
              <div className="flex items-center justify-start gap-2 mb-2 text-xs">
                <span className="text-stone-400 uppercase tracking-wider text-[10px] font-bold">Teinte :</span>
                <span className="font-semibold text-stone-800">{selectedColor?.name || 'Choisir'}</span>
              </div>
              <div className="flex flex-wrap gap-2 items-center justify-start">
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

          {/* 5. Actions Row: Stepper (height: 52px, min-width: 36px) & Button (height: 56px, font-size: 0.95rem) */}
          <div
            className="w-full flex items-center justify-start gap-2.5 sm:gap-3 md:sticky md:bottom-0 bg-white shrink-0 z-10"
            style={{ paddingTop: '12px' }}
          >
            {/* Quantity Stepper */}
            <div
              className="flex items-center bg-stone-100 rounded-full px-1.5 shrink-0"
              style={{ height: '52px' }}
            >
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                aria-label="Diminuer la quantité"
                className="flex items-center justify-center font-bold text-base text-stone-600 hover:text-stone-900 cursor-pointer transition-colors"
                style={{ minWidth: '36px', height: '100%' }}
              >
                −
              </button>
              <span className="w-7 text-center font-bold text-sm text-stone-800">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                aria-label="Augmenter la quantité"
                className="flex items-center justify-center font-bold text-base text-stone-600 hover:text-stone-900 cursor-pointer transition-colors"
                style={{ minWidth: '36px', height: '100%' }}
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              style={{ height: '56px', fontSize: '0.95rem' }}
              className={`flex-1 rounded-full font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap px-3 ${
                product.inStock
                  ? 'bg-[var(--pink)] hover:bg-[var(--pink-deep)] text-white shadow-xs hover:shadow'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
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
