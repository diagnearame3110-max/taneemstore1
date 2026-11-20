import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../store/ProductsContext';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../utils/format';
import { buildWhatsAppLink } from '../utils/whatsapp';
import type { Product } from '../data/types';

export default function ProductImageViewPage() {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts() || {};
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    // Check if product is in context
    const found = products?.find(p => p.id === id);
    if (found) {
      setProduct(found);
      setActiveImage(found.image || '');
      setLoading(false);
      document.title = `${found.name} — Taneem'Store`;
      return;
    }

    // Otherwise fetch directly from Supabase
    async function fetchFromDb() {
      try {
        if (!supabase) {
          setLoading(false);
          return;
        }
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          const mapped: Product = {
            id: String(data.id),
            name: data.name || 'Produit Taneem\'Store',
            description: data.description || '',
            price: Number(data.price) || 0,
            priceFormatted: formatPrice(Number(data.price) || 0),
            image: data.image || '',
            categorySlug: data.category_slug || data.categorySlug || 'skincare',
            inStock: data.in_stock ?? data.inStock ?? true,
            gallery: Array.isArray(data.gallery) ? data.gallery : [],
            colors: Array.isArray(data.colors) ? data.colors : [],
            updatedAt: data.updated_at || new Date().toISOString(),
          };
          setProduct(mapped);
          setActiveImage(mapped.image);
          document.title = `${mapped.name} — Taneem'Store`;
        }
      } catch (e) {
        console.error('Error fetching product details:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchFromDb();
  }, [id, products]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '1.2rem', fontFamily: "'Cormorant Garamond', serif", color: 'var(--text)' }}>
            Chargement du produit...
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '480px', textAlign: 'center', background: '#FFFFFF', padding: '48px 32px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', marginBottom: '12px', color: 'var(--text)' }}>
            Produit Introuvable
          </h1>
          <p style={{ color: 'var(--text-soft)', marginBottom: '24px', fontSize: '0.95rem' }}>
            Ce produit n'est plus disponible ou le lien est expiré.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              background: 'var(--pink)',
              color: '#FFFFFF',
              padding: '12px 28px',
              borderRadius: '100px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            Retourner à la boutique
          </Link>
        </div>
      </div>
    );
  }

  const images = [product.image, ...(product.gallery || [])].filter(Boolean);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <header
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid var(--line)',
          padding: '16px 24px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: '0.04em',
            }}
          >
            TANEEM'STORE
          </Link>
          <Link
            to={`/?product=${product.id}`}
            style={{
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--pink-deep)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ← Accéder à la boutique
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div
          style={{
            maxWidth: '960px',
            width: '100%',
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid var(--line)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          }}
        >
          {/* Image Column */}
          <div
            style={{
              background: '#FAF7F4',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: '1px solid var(--line)',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '420px',
                aspectRatio: '1 / 1',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#FFFFFF',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={activeImage || product.image}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>

            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '8px',
                      border: activeImage === img ? '2px solid var(--pink)' : '1px solid var(--line)',
                      overflow: 'hidden',
                      padding: 0,
                      cursor: 'pointer',
                      background: '#FFFFFF',
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '16px' }}>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--pink-deep)',
                  background: 'var(--blush)',
                  padding: '4px 12px',
                  borderRadius: '100px',
                }}
              >
                {product.categorySlug}
              </span>
            </div>

            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.2rem',
                fontWeight: 600,
                lineHeight: 1.2,
                color: 'var(--text)',
                marginBottom: '14px',
              }}
            >
              {product.name}
            </h1>

            <div
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: 'var(--pink-deep)',
                marginBottom: '16px',
              }}
            >
              {product.priceFormatted || formatPrice(product.price)}
            </div>

            <div style={{ marginBottom: '24px' }}>
              {product.inStock ? (
                <span style={{ fontSize: '0.82rem', color: '#16A34A', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A' }} />
                  En stock · Prêt pour expédition immédiate
                </span>
              ) : (
                <span style={{ fontSize: '0.82rem', color: '#DC2626', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#DC2626' }} />
                  Rupture de stock
                </span>
              )}
            </div>

            {product.description && (
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '0.92rem',
                  lineHeight: 1.7,
                  color: 'var(--text-soft)',
                  marginBottom: '32px',
                }}
              >
                {product.description}
              </p>
            )}

            {/* Actions */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={buildWhatsAppLink({
                  id: product.id,
                  name: product.name,
                  priceFormatted: product.priceFormatted || formatPrice(product.price),
                  description: product.description,
                  image: product.image,
                })}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: '#25D366',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  padding: '14px 24px',
                  borderRadius: '100px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  boxShadow: '0 6px 18px rgba(37, 211, 102, 0.3)',
                  transition: 'opacity 0.2s ease',
                }}
              >
                Commander ce produit sur WhatsApp
              </a>

              <Link
                to={`/?product=${product.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '14px 24px',
                  borderRadius: '100px',
                  border: '1.5px solid var(--text)',
                  color: 'var(--text)',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                }}
              >
                Voir sur la boutique Taneem'Store
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
