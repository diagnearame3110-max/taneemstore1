import type { Product } from '../../data/types';
import { useCart } from '../../store/CartContext';
import { useToast } from '../../store/ToastContext';

interface Props {
  product: Product;
  preview?: boolean;
  onOpenQuickView?: (product: Product) => void;
}

// Select list of Best Seller product IDs
const BEST_SELLER_IDS = new Set(['prod_1', 'prod_3', 'prod_6', 'prod_12', 'prod_15', 'prod_23']);

export default function ProductCard({ product, preview = false, onOpenQuickView }: Props) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const isBestSeller = BEST_SELLER_IDS.has(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (preview || !product.inStock) return;
    addToCart(product);
    showToast(`"${product.name}" ajouté au panier !`, 'success');
  };

  const handleCardClick = () => {
    if (!preview && onOpenQuickView) {
      onOpenQuickView(product);
    }
  };

  return (
    <div
      className="card"
      style={{ borderRadius: '0px', overflow: 'hidden', cursor: onOpenQuickView ? 'pointer' : 'default', height: '100%', display: 'flex', flexDirection: 'column' }}
      onClick={handleCardClick}
    >
      <div className="ph" style={{ borderRadius: '0px', position: 'relative' }}>
        {/* Best-Seller Star Badge for Select Products Only */}
        {isBestSeller && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(4px)',
              color: 'var(--pink)',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: '100px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              zIndex: 2,
            }}
          >
            <span>★ Best-Seller</span>
          </div>
        )}

        <img
          src={product.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&auto=format'}
          alt={product.name}
          onError={e => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&auto=format';
          }}
          style={!product.inStock ? { filter: 'grayscale(0.6) brightness(0.85)' } : {}}
        />
        {!product.inStock && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(27,20,32,0.6)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.8rem',
              borderRadius: 'inherit',
              zIndex: 3,
            }}
          >
            Rupture de stock
          </div>
        )}
      </div>

      <div className="body" style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Star Rating Line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '4px', fontSize: '0.75rem', color: '#FFB800' }}>
          <span>★★★★★</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-soft)', fontWeight: 600, marginLeft: '3px' }}>5.0</span>
        </div>

        <h3 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '12px', lineHeight: 1.3 }}>
          {product.name}
        </h3>
        
        <div 
          className="row" 
          style={{ 
            marginTop: 'auto', 
            paddingTop: '10px', 
            borderTop: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center', 
            justifyContent: 'space-between', 
            gap: '12px',
            flexWrap: 'nowrap'
          }}
        >
          <span className="price-note" style={{ fontSize: '0.95rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
            {product.priceFormatted.replace(/\s/g, '\u00A0')}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || preview}
            title="Ajouter au panier"
            aria-label="Ajouter au panier"
            style={{
              background: !product.inStock ? '#eee' : 'var(--pink)',
              color: !product.inStock ? '#aaa' : '#fff',
              border: 'none',
              padding: '7px 14px',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: !product.inStock || preview ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'transform 0.15s ease, background 0.2s',
              boxShadow: product.inStock && !preview ? '0 4px 12px rgba(209, 17, 110, 0.25)' : 'none',
            }}
            onMouseEnter={e => {
              if (product.inStock && !preview) {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--pink-deep)';
              }
            }}
            onMouseLeave={e => {
              if (product.inStock && !preview) {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--pink)';
              }
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span>Panier</span>
          </button>
        </div>
      </div>
    </div>
  );
}
