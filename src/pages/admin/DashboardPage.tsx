import AdminLayout from '../../components/admin/AdminLayout';
import { useProducts } from '../../store/ProductsContext';

export default function DashboardPage() {
  const { products, categories } = useProducts();

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const outOfStock = products.filter(p => !p.inStock).length;
  const mostExpensive = products.length ? Math.max(...products.map(p => p.price)) : 0;
  const cheapest = products.length ? Math.min(...products.map(p => p.price)) : 0;

  const recent = [...products]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const stats = [
    { label: 'Total Produits', value: totalProducts, icon: '🛍️' },
    { label: 'Catégories', value: totalCategories, icon: '🏷️' },
    { label: 'Ruptures de Stock', value: outOfStock, icon: '⚠️', alert: outOfStock > 0 },
    { label: 'Prix Élevé', value: mostExpensive.toLocaleString('fr-FR') + ' FCFA', icon: '💎' },
    { label: 'Prix Bas', value: cheapest.toLocaleString('fr-FR') + ' FCFA', icon: '✨' },
  ];

  const catLabel: Record<string, string> = {
    corps: 'Corps', visage: 'Visage', maquillage: 'Maquillage',
    accessoires: 'Accessoires', bienetre: 'Bien-être',
  };

  return (
    <AdminLayout title="Tableau de bord">
      {/* Top Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        {stats.map(stat => (
          <div
            key={stat.label}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px 24px',
              border: '1px solid var(--line)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)' }}>
                {stat.label}
              </span>
              <span style={{ fontSize: '1.2rem', padding: '6px', borderRadius: '10px', background: 'var(--blush-soft)' }}>
                {stat.icon}
              </span>
            </div>
            <p style={{ fontSize: '1.65rem', fontWeight: 700, color: stat.alert ? '#DC2626' : 'var(--text)', lineHeight: 1.1 }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Products Table Container */}
      <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--line)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' }}>
              Derniers produits ajoutés ou modifiés
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-soft)', marginTop: '2px' }}>
              Aperçu en temps réel du catalogue produit
            </p>
          </div>
          <a
            href="/admin/products"
            style={{
              fontSize: '0.84rem',
              fontWeight: 600,
              color: 'var(--pink-deep)',
              background: 'var(--blush-soft)',
              padding: '8px 18px',
              borderRadius: '100px',
              textDecoration: 'none',
              border: '1px solid var(--line)',
            }}
          >
            Voir tous les produits →
          </a>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--blush-soft)', borderBottom: '1px solid var(--line)' }}>
                {['Produit', 'Catégorie', 'Prix', 'Statut Stock', 'Dernière modif.'].map(h => (
                  <th key={h} style={{ padding: '16px 28px', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--line)', transition: 'background 0.15s ease' }}>
                  <td style={{ padding: '18px 28px', fontWeight: 600, color: 'var(--text)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--line)' }}
                      />
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '18px 28px' }}>
                    <span style={{ padding: '6px 14px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 600, background: 'var(--blush)', color: 'var(--pink-deep)' }}>
                      {catLabel[p.categorySlug] || p.categorySlug}
                    </span>
                  </td>
                  <td style={{ padding: '18px 28px', fontWeight: 600, color: 'var(--text)' }}>
                    {p.priceFormatted}
                  </td>
                  <td style={{ padding: '18px 28px' }}>
                    <span
                      style={{
                        padding: '6px 14px',
                        borderRadius: '100px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: p.inStock ? '#DCFCE7' : '#FEE2E2',
                        color: p.inStock ? '#166534' : '#991B1B',
                      }}
                    >
                      {p.inStock ? '● En stock' : '○ Rupture'}
                    </span>
                  </td>
                  <td style={{ padding: '18px 28px', fontSize: '0.84rem', color: 'var(--text-soft)' }}>
                    {new Date(p.updatedAt).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
