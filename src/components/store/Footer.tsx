import { useProducts } from '../../store/ProductsContext';

export default function Footer() {
  const { categories, products } = useProducts();
  const sorted = [...categories].sort((a, b) => a.order - b.order);
  const activeCategories = sorted.filter(c => products.some(p => p.categorySlug === c.slug));

  return (
    <footer>
      <div className="wrap foot-grid">
        <div>
          <div className="foot-brand">Taneem'Store</div>
          <div className="foot-sub" style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--pink-deep)', marginTop: '4px', marginBottom: '8px' }}>
            "Prenez soin de ce qui vous rend unique"
          </div>
          <div className="foot-sub">
            Beauty & Wellness — sélection de produits importés, livrés à Dakar et dans toute la région.
          </div>
        </div>
        <div className="foot-cols">
          <div className="foot-col">
            <h4>Boutique</h4>
            {activeCategories.map(cat => (
              <a key={cat.slug} href={`#${cat.slug}`}>
                {cat.title}
              </a>
            ))}
          </div>
          <div className="foot-col">
            <h4>Contact</h4>
            <a href="https://wa.me/221781734994" target="_blank" rel="noopener noreferrer">
              WhatsApp · 78 173 49 94
            </a>
            <a href="https://www.instagram.com/taneemstore/" target="_blank" rel="noopener noreferrer">
              Instagram · @taneemstore
            </a>
            <div>Dakar, Sénégal</div>
          </div>
        </div>
      </div>
      <div className="wrap copyline">
        <div>© 2026 Taneem'Store. Tous droits réservés. · The Clean Girl Era</div>
        <div>
          <a href="/admin/login" style={{ opacity: 0.5, fontSize: '0.75rem', textDecoration: 'none' }}>
            Administration
          </a>
        </div>
      </div>
    </footer>
  );
}
