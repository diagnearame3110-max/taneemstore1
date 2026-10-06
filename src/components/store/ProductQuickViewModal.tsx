import React, { useState, useEffect } from 'react';
import type { Product } from '../../data/types';
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

  useEffect(() => {
    setQuantity(1);
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

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product, quantity);
    showToast(`"${product.name}" (${quantity}) ajouté au panier !`, 'success');
    onClose();
    openCart();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        background: 'rgba(15, 8, 12, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg)',
          width: '100%',
          maxWidth: '780px',
          borderRadius: '16px',
          border: '1px solid var(--line)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: 'var(--blush-soft)',
            border: '1px solid var(--line)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text)',
            cursor: 'pointer',
            zIndex: 10,
            fontSize: '0.9rem',
          }}
        >
          ✕
        </button>

        {/* Product Image */}
        <div style={{ background: '#f5f2ec', minHeight: '320px', position: 'relative' }}>
          <img
            src={product.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&auto=format'}
            alt={product.name}
            onError={e => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&auto=format';
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Product Details */}
        <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--pink-deep)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>
            {product.categorySlug}
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 10px', color: 'var(--text)', lineHeight: 1.25 }}>
            {product.name}
          </h2>

          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--pink-deep)', marginBottom: '16px' }}>
            {product.priceFormatted || formatPrice(product.price)}
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-soft)', lineHeight: 1.6, marginBottom: '24px' }}>
            {product.description || 'Soin d\'exception sélectionné pour votre routine quotidienne.'}
          </p>

          <div style={{ marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>Quantité :</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line)', borderRadius: '100px', overflow: 'hidden', background: 'var(--card)' }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ background: 'none', border: 'none', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 700 }}
                >
                  -
                </button>
                <span style={{ width: '32px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  style={{ background: 'none', border: 'none', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 700 }}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              style={{
                width: '100%',
                background: product.inStock ? 'var(--pink)' : '#ccc',
                color: '#fff',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '100px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: product.inStock ? 'pointer' : 'not-allowed',
                boxShadow: product.inStock ? '0 6px 20px rgba(209, 17, 110, 0.3)' : 'none',
                transition: 'background 0.2s',
              }}
            >
              {product.inStock ? 'Ajouter au panier' : 'Rupture de stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
