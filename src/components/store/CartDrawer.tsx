import { Link } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import { formatPrice } from '../../utils/format';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPriceFormatted,
    buildCartWhatsAppLink,
  } = useCart();

  return (
    <>
      <div
        className={`menu-scrim ${isCartOpen ? 'is-open' : ''}`}
        onClick={closeCart}
        style={{ zIndex: 60 }}
      />

      <div
        className={`mobile-menu ${isCartOpen ? 'is-open' : ''}`}
        style={{
          width: '90%',
          maxWidth: '420px',
          zIndex: 65,
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--line)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'Fraunces, serif',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: '1.3rem',
                color: 'var(--text)',
              }}
            >
              Mon Panier
            </span>
            <span
              style={{
                background: 'var(--blush)',
                color: 'var(--pink-deep)',
                fontWeight: 700,
                fontSize: '0.8rem',
                padding: '2px 8px',
                borderRadius: '100px',
              }}
            >
              {totalItems}
            </span>
          </div>

          <button
            onClick={closeCart}
            aria-label="Fermer le panier"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: 'var(--text)',
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
          {cart.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--text-soft)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>Votre panier est vide</p>
              <p style={{ fontSize: '0.85rem' }}>Découvrez nos produits et ajoutez vos préférés !</p>
              <button
                className="btn-primary"
                onClick={closeCart}
                style={{ marginTop: '12px', padding: '10px 20px', fontSize: '0.85rem' }}
              >
                Explorer la boutique
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(cart || []).filter(item => item && item.product).map(({ product, quantity }) => (
                <div
                  key={product.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--line)',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '64px',
                      height: '64px',
                      objectFit: 'cover',
                      borderRadius: '5px',
                      background: 'var(--blush-soft)',
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4
                      style={{
                        fontFamily: 'Fraunces, serif',
                        fontStyle: 'italic',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: 'var(--text)',
                        marginBottom: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {product.name}
                    </h4>
                    <div style={{ fontSize: '0.82rem', color: 'var(--pink-deep)', fontWeight: 700 }}>
                      {formatPrice(product.price * quantity)}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid var(--line)',
                          borderRadius: '100px',
                          overflow: 'hidden',
                          background: 'var(--bg)',
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          style={{
                            border: 'none',
                            background: 'none',
                            padding: '2px 8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: 'var(--text)',
                          }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '0.82rem', padding: '0 4px', fontWeight: 600 }}>
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          style={{
                            border: 'none',
                            background: 'none',
                            padding: '2px 8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: 'var(--text)',
                          }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        title="Supprimer"
                        aria-label="Supprimer l'article"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-soft)',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div
            style={{
              paddingTop: '16px',
              borderTop: '1px solid var(--line)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-soft)' }}>Sous-total</span>
              <span
                style={{
                  fontFamily: 'Fraunces, serif',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: 'var(--text)',
                }}
              >
                {totalPriceFormatted}
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', margin: 0 }}>
              💡 La commande s'envoie directement par message sur WhatsApp.
            </p>

            <Link
              to="/checkout"
              onClick={closeCart}
              className="btn-primary"
              style={{
                width: '100%',
                textDecoration: 'none',
                textAlign: 'center',
                padding: '14px 20px',
                borderRadius: '100px',
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              Procéder au paiement
            </Link>

            <a
              href={buildCartWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '100%',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                background: '#25D366',
                color: '#fff',
                fontWeight: 700,
                padding: '12px 20px',
                borderRadius: '100px',
                fontSize: '0.88rem',
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)',
                transition: 'transform 0.15s ease, background 0.2s',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.105 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              Commander directement via WhatsApp
            </a>

            <button
              onClick={clearCart}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-soft)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                textAlign: 'center',
                textDecoration: 'underline',
              }}
            >
              Vider le panier
            </button>
          </div>
        )}
      </div>
    </>
  );
}
