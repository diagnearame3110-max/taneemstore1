import { useState } from 'react';
import { Icon } from '@iconify/react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useProducts } from '../../store/ProductsContext';

export default function DashboardPage() {
  const { products, categories, isSupabaseActive, syncSeedToSupabase } = useProducts();
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    await syncSeedToSupabase();
    setSyncing(false);
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 4000);
  };

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const outOfStock = products.filter(p => !p.inStock).length;
  const mostExpensive = products.length ? Math.max(...products.map(p => p.price)) : 0;
  const cheapest = products.length ? Math.min(...products.map(p => p.price)) : 0;

  const recent = [...products]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const stats = [
    { label: 'Total Produits', value: totalProducts, icon: 'lucide:package' },
    { label: 'Catégories', value: totalCategories, icon: 'lucide:tags' },
    { label: 'Ruptures de Stock', value: outOfStock, icon: 'lucide:alert-triangle', alert: outOfStock > 0 },
    { label: 'Prix Élevé', value: mostExpensive.toLocaleString('fr-FR') + ' FCFA', icon: 'lucide:gem' },
    { label: 'Prix Bas', value: cheapest.toLocaleString('fr-FR') + ' FCFA', icon: 'lucide:sparkles' },
  ];

  const catLabel: Record<string, string> = {
    corps: 'Soins du Corps',
    visage: 'Soins du Visage',
    accessoires: 'Accessoires',
    bienetre: 'Bien-être',
  };

  const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    corps: { bg: '#FAF5F2', text: '#8F776C', border: '#EFE8E3' },
    visage: { bg: '#F0F9FF', text: '#0369A1', border: '#BAE6FD' },
    accessoires: { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
    bienetre: { bg: '#F5F3FF', text: '#5B21B6', border: '#DDD6FE' },
  };

  return (
    <AdminLayout title="Tableau de bord">
      {/* Supabase Status Banner */}
      <div
        style={{
          background: isSupabaseActive ? '#ECFDF5' : '#FFFBEB',
          border: `1px solid ${isSupabaseActive ? '#A7F3D0' : '#FDE68A'}`,
          borderRadius: '16px',
          padding: '16px 22px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: isSupabaseActive ? '#D1FAE5' : '#FEF3C7', color: isSupabaseActive ? '#059669' : '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon icon={isSupabaseActive ? "lucide:database-zap" : "lucide:database"} style={{ fontSize: '1.2rem' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isSupabaseActive ? '#065F46' : '#92400E' }}>
              {isSupabaseActive ? 'Supabase connecté & synchronisé' : 'Base de données Supabase non configurée (Mode Local)'}
            </div>
            <div style={{ fontSize: '0.8rem', color: isSupabaseActive ? '#047857' : '#B45309', marginTop: '2px' }}>
              {isSupabaseActive
                ? 'Les produits et catégories sont synchronisés en temps réel avec Supabase.'
                : 'Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans votre fichier .env pour activer la synchronisation.'}
            </div>
          </div>
        </div>

        {isSupabaseActive && (
          <button
            onClick={handleSync}
            disabled={syncing}
            style={{
              background: '#059669',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 16px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              opacity: syncing ? 0.7 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Icon icon={syncing ? "lucide:loader" : syncSuccess ? "lucide:check" : "lucide:refresh-cw"} />
            {syncing ? 'Synchronisation...' : syncSuccess ? 'Synchronisé !' : 'Push Seed vers Supabase'}
          </button>
        )}
      </div>

      {/* Top Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {stats.map(stat => (
          <div
            key={stat.label}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px 22px',
              border: '1px solid var(--line)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)' }}>
                {stat.label}
              </span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--blush-soft)', color: 'var(--pink-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon icon={stat.icon} style={{ fontSize: '1.15rem' }} />
              </div>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.alert ? '#DC2626' : 'var(--text)', lineHeight: 1.1 }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Products Table Container - Fixed Static Layout, No Overflow */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--line)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              Derniers produits ajoutés ou modifiés
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-soft)', marginTop: '2px', margin: 0 }}>
              Aperçu en temps réel du catalogue produit
            </p>
          </div>
          <a
            href="/admin/products"
            style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--pink-deep)',
              background: '#FAF5F2',
              padding: '7px 16px',
              borderRadius: '100px',
              textDecoration: 'none',
              border: '1px solid var(--line)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Voir tous les produits</span>
            <Icon icon="lucide:arrow-right" style={{ fontSize: '0.9rem' }} />
          </a>
        </div>

        <div style={{ width: '100%', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ background: '#FAF7F5', borderBottom: '1px solid var(--line)' }}>
                <th style={{ width: '36%', padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)' }}>
                  Produit
                </th>
                <th style={{ width: '20%', padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)' }}>
                  Catégorie
                </th>
                <th style={{ width: '16%', padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)' }}>
                  Prix
                </th>
                <th style={{ width: '14%', padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)' }}>
                  Statut Stock
                </th>
                <th style={{ width: '14%', padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)', textAlign: 'right' }}>
                  Dernière modif.
                </th>
              </tr>
            </thead>
            <tbody>
              {recent.map(p => {
                const cat = CAT_COLORS[p.categorySlug] ?? CAT_COLORS.corps;
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--line)', transition: 'background 0.15s ease' }}>
                    <td style={{ padding: '14px 20px', verticalAlign: 'middle', fontWeight: 600, color: 'var(--text)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--line)', flexShrink: 0 }}
                          onError={e => {
                            e.currentTarget.onerror = null;
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=200';
                          }}
                        />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          background: cat.bg,
                          color: cat.text,
                          border: `1px solid ${cat.border}`,
                          display: 'inline-block',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {catLabel[p.categorySlug] || p.categorySlug}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', verticalAlign: 'middle', fontWeight: 800, color: 'var(--pink-deep)', fontSize: '0.92rem' }}>
                      {p.priceFormatted}
                    </td>
                    <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          background: p.inStock ? '#DCFCE7' : '#FEE2E2',
                          color: p.inStock ? '#166534' : '#991B1B',
                          border: `1px solid ${p.inStock ? '#BBF7D0' : '#FCA5A5'}`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span style={{ fontSize: '0.45rem', lineHeight: 1 }}>●</span>
                        {p.inStock ? 'En stock' : 'Rupture'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', verticalAlign: 'middle', fontSize: '0.82rem', color: 'var(--text-soft)', textAlign: 'right' }}>
                      {new Date(p.updatedAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
