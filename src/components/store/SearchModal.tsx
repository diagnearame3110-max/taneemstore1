import React, { useState, useEffect, useRef } from 'react';
import { useProducts } from '../../store/ProductsContext';
import { useCart } from '../../store/CartContext';
import { useToast } from '../../store/ToastContext';
import type { Product } from '../../data/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: Props) {
  const { products } = useProducts();
  const { addToCart, openCart } = useCart();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.categorySlug.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    showToast(`"${product.name}" ajouté au panier !`, 'success');
    onClose();
    openCart();
  };

  const popularTags = ['Dove', 'Laneige', 'Gommage', 'Sérum', 'Lèvres', 'Hydratation'];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(15, 8, 12, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '60px 16px 20px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg)',
          width: '100%',
          maxWidth: '680px',
          borderRadius: '16px',
          border: '1px solid var(--line)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid var(--line)',
            background: 'var(--card)',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--pink-deep)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher un soin, sérum, gommage, produit..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'none',
              fontSize: '1.05rem',
              outline: 'none',
              color: 'var(--text)',
              fontFamily: "'Inter', sans-serif",
            }}
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', color: 'var(--text-soft)', cursor: 'pointer', fontSize: '1rem', padding: '4px' }}
            >
              ✕
            </button>
          )}

          <button
            onClick={onClose}
            style={{
              background: 'var(--blush-soft)',
              color: 'var(--text)',
              border: '1px solid var(--line)',
              padding: '6px 12px',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Fermer
          </button>
        </div>

        {/* Results / Suggestions Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {!query.trim() ? (
            <div>
              <p style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-soft)', fontWeight: 700, marginBottom: '12px' }}>
                Recherches fréquentes
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {popularTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    style={{
                      background: 'var(--blush-soft)',
                      color: 'var(--pink-deep)',
                      border: '1px solid var(--line)',
                      padding: '8px 14px',
                      borderRadius: '100px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    🔍 {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-soft)' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>Aucun résultat pour "{query}"</p>
              <p style={{ fontSize: '0.85rem' }}>Essayez un autre mot clé comme Dove, Laneige, gommage...</p>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-soft)', fontWeight: 700, marginBottom: '14px' }}>
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid var(--line)',
                      background: 'var(--card)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px', background: 'var(--blush-soft)', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.name}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.description}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--pink-deep)', fontWeight: 700, marginBottom: '6px' }}>
                        {product.priceFormatted}
                      </div>
                      <button
                        onClick={e => handleAddToCart(product, e)}
                        disabled={!product.inStock}
                        style={{
                          background: product.inStock ? 'var(--pink)' : '#eee',
                          color: product.inStock ? '#fff' : '#aaa',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '100px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: product.inStock ? 'pointer' : 'not-allowed',
                        }}
                      >
                        Panier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
