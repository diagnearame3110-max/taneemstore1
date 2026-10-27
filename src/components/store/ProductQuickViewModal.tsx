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
      className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[var(--bg)] w-full max-w-[360px] md:max-w-[680px] rounded-2xl border border-[var(--line)] shadow-2xl overflow-hidden relative transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[var(--text)] border border-[var(--line)] shadow-xs flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* ============================================================== */}
        {/* MOBILE VIEW (< md): Ultra-compact & anti-fatigue side-by-side */}
        {/* ============================================================== */}
        <div className="md:hidden flex flex-col p-3.5">
          {/* Top Row: Product Thumbnail (Contained) + Info */}
          <div className="flex gap-3 items-start">
            {/* Square Contained Thumbnail (Handles all product shapes uniformly) */}
            <div className="relative w-24 h-24 rounded-xl bg-[#FAF7F5] border border-[var(--line)] overflow-hidden shrink-0 flex items-center justify-center p-1.5">
              <img
                src={selectedImage || product.image || allImages[0]}
                alt={product.name}
                onError={e => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&auto=format';
                }}
                className="w-full h-full object-contain"
              />
              {allImages.length > 1 && (
                <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.2 rounded-full font-semibold">
                  {allImages.indexOf(selectedImage) + 1}/{allImages.length}
                </span>
              )}
            </div>

            {/* Right Info: Category, Title, Price, Stock */}
            <div className="flex-1 min-w-0 pr-6">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--pink-deep)] mb-0.5">
                {product.categorySlug}
              </div>
              <h2 className="text-sm font-serif font-bold text-[var(--text)] line-clamp-2 leading-snug">
                {product.name}
              </h2>
              <div className="text-sm font-bold text-[var(--pink-deep)] mt-1">
                {product.priceFormatted || formatPrice(product.price)}
              </div>
              <div className="mt-1">
                <span className={`inline-flex items-center text-[10px] font-semibold ${product.inStock ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {product.inStock ? '● En stock' : '○ Rupture'}
                </span>
              </div>
            </div>
          </div>

          {/* Multiple Images thumbnails if available */}
          {allImages.length > 1 && (
            <div className="flex gap-1.5 mt-2 overflow-x-auto py-0.5">
              {allImages.map((img, idx) => {
                const isActive = img === selectedImage;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-8 h-8 rounded-lg overflow-hidden border p-0.5 bg-[#FAF7F5] shrink-0 transition-all cursor-pointer ${
                      isActive ? 'border-[var(--pink-deep)] ring-1 ring-[var(--pink-deep)]' : 'border-[var(--line)] opacity-60'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Short Description */}
          <p className="text-[11px] text-[var(--text-soft)] line-clamp-2 mt-2 leading-relaxed">
            {product.description || "Soin d'exception sélectionné pour votre routine quotidienne."}
          </p>

          {/* Color / Teinte Selection if available */}
          {Array.isArray(product.colors) && product.colors.length > 0 && (
            <div className="mt-2 p-1.5 rounded-lg bg-[#FAF7F5] border border-[var(--line)]">
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="font-bold text-[var(--text)] uppercase text-[9px]">Teinte :</span>
                <span className="font-semibold text-[var(--pink-deep)] text-[10px]">
                  {selectedColor?.name || 'Choisir'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {product.colors.map(c => {
                  const isSelected = selectedColor?.id === c.id || (!selectedColor && product.colors?.[0]?.id === c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectColor(c)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--pink-deep)] bg-white font-bold text-[var(--text)] shadow-xs'
                          : 'border-[var(--line)] bg-[#FAF8F4] text-[var(--text-soft)]'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0" style={{ background: c.hex || '#E8A598' }} />
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Action Row: Stepper + Add to Cart */}
          <div className="mt-2.5 pt-2 border-t border-[var(--line)] flex items-center gap-2">
            <div className="flex items-center border border-[var(--line)] rounded-full bg-white h-9 px-1 shrink-0 shadow-xs">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                aria-label="Diminuer"
                className="w-6 h-6 flex items-center justify-center font-bold text-xs text-[var(--text)] hover:text-[var(--pink-deep)] cursor-pointer"
              >
                -
              </button>
              <span className="w-5 text-center font-bold text-xs text-[var(--text)]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                aria-label="Augmenter"
                className="w-6 h-6 flex items-center justify-center font-bold text-xs text-[var(--text)] hover:text-[var(--pink-deep)] cursor-pointer"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 h-9 px-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                product.inStock
                  ? 'bg-[var(--pink)] hover:bg-[var(--pink-deep)] text-white shadow-xs cursor-pointer'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>{product.inStock ? 'Ajouter au panier' : 'Rupture'}</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* DESKTOP VIEW (md:): Elegant & spacious 2-column layout */}
        {/* ============================================================== */}
        <div className="hidden md:flex flex-row">
          {/* Media Column (Contained image preserving true product proportions) */}
          <div className="w-[280px] shrink-0 bg-[#FAF7F5] flex flex-col border-r border-[var(--line)]">
            <div className="relative w-full h-[280px] flex items-center justify-center p-4 overflow-hidden bg-white/40">
              <img
                src={selectedImage || product.image || allImages[0]}
                alt={product.name}
                onError={e => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&auto=format';
                }}
                className="w-full h-full object-contain transition-opacity duration-200"
              />

              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    title="Photo précédente"
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 hover:bg-white backdrop-blur-xs border border-[var(--line)] flex items-center justify-center text-[var(--text)] shadow-xs cursor-pointer"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    title="Photo suivante"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 hover:bg-white backdrop-blur-xs border border-[var(--line)] flex items-center justify-center text-[var(--text)] shadow-xs cursor-pointer"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </>
              )}

              {allImages.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/65 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {allImages.indexOf(selectedImage) + 1} / {allImages.length}
                </div>
              )}
            </div>

            {/* Desktop Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 p-2.5 overflow-x-auto border-t border-[var(--line)] bg-white/70">
                {allImages.map((img, idx) => {
                  const isActive = img === selectedImage;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`w-10 h-10 rounded-lg overflow-hidden p-1 shrink-0 border bg-[#FAF7F5] transition-all cursor-pointer ${
                        isActive ? 'border-[var(--pink-deep)] ring-1 ring-[var(--pink-deep)]' : 'border-[var(--line)] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--pink-deep)] mb-1">
              {product.categorySlug}
            </div>

            <h2 className="text-xl font-serif font-bold text-[var(--text)] leading-snug mb-1 line-clamp-2">
              {product.name}
            </h2>

            <div className="text-base font-extrabold text-[var(--pink-deep)] mb-2">
              {product.priceFormatted || formatPrice(product.price)}
            </div>

            <p className="text-xs text-[var(--text-soft)] leading-relaxed mb-4 line-clamp-3">
              {product.description || "Soin d'exception sélectionné pour votre routine quotidienne."}
            </p>

            {/* Color Selector */}
            {Array.isArray(product.colors) && product.colors.length > 0 && (
              <div className="mb-4 p-2.5 rounded-xl bg-[#FAF7F5] border border-[var(--line)]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-[var(--text)] uppercase tracking-wider text-[10px]">
                    Teinte :
                  </span>
                  <span className="font-semibold text-[var(--pink-deep)]">
                    {selectedColor?.name || 'Choisir'}
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
                        <span className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0" style={{ background: c.hex || '#E8A598' }} />
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Desktop Action Row */}
            <div className="mt-auto pt-3 border-t border-[var(--line)] flex items-center gap-3">
              <div className="flex items-center border border-[var(--line)] rounded-full bg-white h-10 px-1 shrink-0 shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  aria-label="Diminuer la quantité"
                  className="w-7 h-7 flex items-center justify-center font-bold text-sm text-[var(--text)] hover:text-[var(--pink-deep)] cursor-pointer"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold text-xs text-[var(--text)]">
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

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 h-10 px-4 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  product.inStock
                    ? 'bg-[var(--pink)] hover:bg-[var(--pink-deep)] text-white shadow-sm hover:shadow cursor-pointer'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
    </div>
  );
}
