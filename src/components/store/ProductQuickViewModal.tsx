import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../data/types';
import { useCart } from '../../store/CartContext';
import { useToast } from '../../store/ToastContext';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductQuickViewModal({ product, onClose }: Props) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
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
  };

  const handleBuyNow = () => {
    if (!product.inStock) return;
    addToCart(product, quantity);
    onClose();
    navigate('/checkout');
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
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg)',
          width: '100%',
          maxWidth: '520px',
          borderRadius: '16px',
          border: '1px solid var(--line)',
          boxShadow: '0 20px 50px -10px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '85vh',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 10,
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.85)',
            color: '#1B1420',
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            transition: 'transform 0.15s ease',
          }}
        >
          ✕
        </button>

        <div style={{ background: 'var(--blush-soft)', height: '210px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          <img
            src={product.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&fit=crop&auto=format'}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          {!product.inStock && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(27, 20, 32, 0.65)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              Rupture de stock
            </div>
          )}
        </div>

        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
          <div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--pink-deep)',
              }}
            >
              {product.categorySlug.toUpperCase()}
            </span>
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontStyle: 'italic',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--text)',
                margin: '2px 0 6px 0',
                lineHeight: 1.25,
              }}
            >
              {product.name}
            </h2>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--pink-deep)' }}>
              {product.priceFormatted}
            </div>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-soft)', lineHeight: 1.5, margin: 0 }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>
              Quantité :
            </label>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid var(--line)',
                borderRadius: '6px',
                overflow: 'hidden',
                background: 'var(--card)',
              }}
            >
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{
                  border: 'none',
                  background: 'none',
                  padding: '5px 12px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--text)',
                }}
              >
                -
              </button>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, padding: '0 8px', minWidth: '20px', textAlign: 'center' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                style={{
                  border: 'none',
                  background: 'none',
                  padding: '5px 12px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--text)',
                }}
              >
                +
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px', paddingTop: '8px' }}>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              style={{
                width: '100%',
                padding: '11px 14px',
                background: 'var(--card)',
                color: 'var(--text)',
                border: '1.5px solid var(--text)',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: product.inStock ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              Ajouter au panier
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              style={{
                width: '100%',
                padding: '11px 14px',
                background: product.inStock ? 'var(--pink)' : '#ccc',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: product.inStock ? 'pointer' : 'not-allowed',
                boxShadow: product.inStock ? '0 3px 10px rgba(209, 17, 110, 0.25)' : 'none',
                transition: 'background 0.2s',
              }}
            >
              Acheter maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
