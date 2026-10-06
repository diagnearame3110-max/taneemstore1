import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useProducts } from '../../store/ProductsContext';
import { useToast } from '../../store/ToastContext';
import type { Product } from '../../data/types';

const CAT_LABELS: Record<string, string> = {
  corps: 'Soins du Corps',
  visage: 'Soins du Visage',
  maquillage: 'Maquillage & Éclat',
  accessoires: 'Accessoires',
  bienetre: 'Bien-être & Hygiène',
};

const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  corps: { bg: '#FDF8F5', text: '#8F776C', border: '#EFE8E3' },
  visage: { bg: '#F0F9FF', text: '#0369A1', border: '#BAE6FD' },
  maquillage: { bg: '#FEFCE8', text: '#854D0E', border: '#FEF08A' },
  accessoires: { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
  bienetre: { bg: '#F5F3FF', text: '#5B21B6', border: '#DDD6FE' },
};

export default function ProductsPage() {
  const { products, deleteProduct, toggleStock, addProduct } = useProducts();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'instock' | 'outstock'>('all');
  const [sortKey, setSortKey] = useState<'name' | 'price'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Modals state
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  // Statistics
  const totalCount = products.length;
  const inStockCount = products.filter(p => p.inStock).length;
  const outStockCount = products.filter(p => !p.inStock).length;
  const categoriesCount = new Set(products.map(p => p.categorySlug)).size;

  const filtered = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.id.toLowerCase().includes(search.toLowerCase()) ||
                          p.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = !catFilter || p.categorySlug === catFilter;
      const matchStock = stockFilter === 'all'
        ? true
        : stockFilter === 'instock' ? p.inStock : !p.inStock;
      return matchSearch && matchCat && matchStock;
    })
    .sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      return sortKey === 'name'
        ? a.name.localeCompare(b.name) * mul
        : (a.price - b.price) * mul;
    });

  function toggleSort(key: 'name' | 'price') {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  async function handleDelete(p: Product) {
    await deleteProduct(p.id);
    showToast(`Produit "${p.name}" supprimé.`);
    setConfirmDelete(null);
  }

  async function handleDuplicate(p: Product) {
    await addProduct({
      name: p.name + ' (copie)',
      description: p.description,
      price: p.price,
      image: p.image,
      categorySlug: p.categorySlug,
      inStock: p.inStock,
    });
    showToast(`Produit "${p.name}" dupliqué avec succès.`);
  }

  return (
    <AdminLayout title="Catalogue Produits">
      {/* Top Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {/* Card 1: Total */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px 24px',
            border: '1px solid var(--line)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)', marginBottom: '4px' }}>
              Total Produits
            </p>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', fontFamily: "'Cormorant Garamond', serif" }}>
              {totalCount}
            </p>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#F5EFEA', color: 'var(--pink-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon icon="lucide:package" style={{ fontSize: '1.3rem' }} />
          </div>
        </div>

        {/* Card 2: En Stock */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px 24px',
            border: '1px solid var(--line)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)', marginBottom: '4px' }}>
              En Stock
            </p>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#166534', fontFamily: "'Cormorant Garamond', serif" }}>
              {inStockCount}
            </p>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon icon="lucide:check-circle-2" style={{ fontSize: '1.3rem' }} />
          </div>
        </div>

        {/* Card 3: Rupture */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px 24px',
            border: '1px solid var(--line)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)', marginBottom: '4px' }}>
              Rupture de Stock
            </p>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#991B1B', fontFamily: "'Cormorant Garamond', serif" }}>
              {outStockCount}
            </p>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon icon="lucide:alert-triangle" style={{ fontSize: '1.3rem' }} />
          </div>
        </div>

        {/* Card 4: Catégories */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px 24px',
            border: '1px solid var(--line)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)', marginBottom: '4px' }}>
              Catégories Actives
            </p>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--pink-deep)', fontFamily: "'Cormorant Garamond', serif" }}>
              {categoriesCount}
            </p>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#FAF7F5', color: 'var(--pink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon icon="lucide:tags" style={{ fontSize: '1.3rem' }} />
          </div>
        </div>
      </div>

      {/* Action & Filter Bar */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid var(--line)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)', display: 'flex', alignItems: 'center' }}>
              <Icon icon="lucide:search" style={{ fontSize: '1.1rem' }} />
            </span>
            <input
              type="text"
              placeholder="Rechercher un produit par nom, ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 40px 12px 44px',
                borderRadius: '10px',
                border: '1.5px solid var(--line)',
                fontSize: '0.88rem',
                outline: 'none',
                background: '#FAF8F4',
                color: 'var(--text)',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--pink)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--line)')}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-soft)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Icon icon="lucide:x" style={{ fontSize: '1rem' }} />
              </button>
            )}
          </div>

          {/* Category Select Filter */}
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            style={{
              padding: '12px 18px',
              borderRadius: '10px',
              border: '1.5px solid var(--line)',
              fontSize: '0.88rem',
              outline: 'none',
              background: '#FAF8F4',
              color: 'var(--text)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--pink)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--line)')}
          >
            <option value="">Toutes les catégories ({products.length})</option>
            {Object.entries(CAT_LABELS).map(([k, v]) => {
              const count = products.filter(p => p.categorySlug === k).length;
              return <option key={k} value={k}>{v} ({count})</option>;
            })}
          </select>

          {/* New Product CTA */}
          <button
            onClick={() => navigate('/admin/products/new')}
            style={{
              padding: '12px 24px',
              borderRadius: '100px',
              fontWeight: 700,
              fontSize: '0.88rem',
              color: '#FFFFFF',
              background: 'linear-gradient(90deg, #A99084 0%, #8F776C 100%)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(169, 144, 132, 0.35)',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.92')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <Icon icon="lucide:plus" style={{ fontSize: '1.1rem' }} /> Ajouter un Produit
          </button>
        </div>

        {/* Stock Status Pills Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--line)', paddingTop: '14px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '8px' }}>
            Filtre Stock:
          </span>
          <button
            onClick={() => setStockFilter('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: '1px solid',
              borderColor: stockFilter === 'all' ? 'var(--pink)' : 'var(--line)',
              background: stockFilter === 'all' ? 'var(--pink)' : '#FFFFFF',
              color: stockFilter === 'all' ? '#FFFFFF' : 'var(--text)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Tous ({totalCount})
          </button>
          <button
            onClick={() => setStockFilter('instock')}
            style={{
              padding: '6px 14px',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: '1px solid',
              borderColor: stockFilter === 'instock' ? '#166534' : 'var(--line)',
              background: stockFilter === 'instock' ? '#DCFCE7' : '#FFFFFF',
              color: stockFilter === 'instock' ? '#166534' : 'var(--text)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            ● En Stock ({inStockCount})
          </button>
          <button
            onClick={() => setStockFilter('outstock')}
            style={{
              padding: '6px 14px',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: '1px solid',
              borderColor: stockFilter === 'outstock' ? '#991B1B' : 'var(--line)',
              background: stockFilter === 'outstock' ? '#FEE2E2' : '#FFFFFF',
              color: stockFilter === 'outstock' ? '#991B1B' : 'var(--text)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            ○ Rupture ({outStockCount})
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid var(--line)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#FAF7F5', borderBottom: '1px solid var(--line)' }}>
                <th style={{ width: '70px', padding: '16px 20px' }}>Visuel</th>
                <th
                  onClick={() => toggleSort('name')}
                  style={{
                    padding: '16px 20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--text-soft)',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  Produit {sortKey === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)' }}>
                  Catégorie
                </th>
                <th
                  onClick={() => toggleSort('price')}
                  style={{
                    padding: '16px 20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--text-soft)',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  Prix {sortKey === 'price' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)' }}>
                  Statut Stock
                </th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const cat = CAT_COLORS[p.categorySlug] ?? CAT_COLORS.corps;
                return (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid var(--line)',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#FAF8F4')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Thumbnail */}
                    <td style={{ padding: '14px 20px' }}>
                      <div
                        onClick={() => setPreviewProduct(p)}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          border: '1px solid var(--line)',
                          background: '#FAF8F4',
                          cursor: 'pointer',
                        }}
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => {
                            e.currentTarget.onerror = null;
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=200';
                          }}
                        />
                      </div>
                    </td>

                    {/* Title & Info */}
                    <td style={{ padding: '14px 20px' }}>
                      <div
                        onClick={() => setPreviewProduct(p)}
                        style={{ fontWeight: 700, color: 'var(--text)', cursor: 'pointer' }}
                      >
                        {p.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-soft)', background: '#F5EFEA', padding: '2px 8px', borderRadius: '6px', fontFamily: 'monospace' }}>
                          ID: {p.id}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '14px 20px' }}>
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
                        }}
                      >
                        {CAT_LABELS[p.categorySlug] || p.categorySlug}
                      </span>
                    </td>

                    {/* Price */}
                    <td style={{ padding: '14px 20px', fontWeight: 800, color: 'var(--pink-deep)', fontSize: '0.95rem' }}>
                      {p.priceFormatted}
                    </td>

                    {/* Stock Status Switch Badge */}
                    <td style={{ padding: '14px 20px' }}>
                      <button
                        onClick={() => {
                          toggleStock(p.id);
                          showToast(p.inStock ? `Produit "${p.name}" passé en rupture.` : `Produit "${p.name}" remis en stock.`);
                        }}
                        style={{
                          padding: '3px 10px',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          background: p.inStock ? '#DCFCE7' : '#FEE2E2',
                          color: p.inStock ? '#166534' : '#991B1B',
                          border: `1px solid ${p.inStock ? '#BBF7D0' : '#FCA5A5'}`,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <span style={{ fontSize: '0.45rem', lineHeight: 1 }}>●</span>
                        {p.inStock ? 'En stock' : 'Rupture'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        {/* Preview */}
                        <button
                          onClick={() => setPreviewProduct(p)}
                          title="Aperçu rapide"
                          style={{
                            padding: '7px 12px',
                            borderRadius: '10px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: 'var(--text-soft)',
                            background: '#FFFFFF',
                            border: '1px solid var(--line)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--pink)')}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
                        >
                          <Icon icon="lucide:eye" /> Voir
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                          title="Modifier le produit"
                          style={{
                            padding: '7px 12px',
                            borderRadius: '10px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: 'var(--text)',
                            background: '#FFFFFF',
                            border: '1px solid var(--line)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'var(--pink)';
                            e.currentTarget.style.color = 'var(--pink-deep)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'var(--line)';
                            e.currentTarget.style.color = 'var(--text)';
                          }}
                        >
                          <Icon icon="lucide:edit-3" /> Edit
                        </button>

                        {/* Duplicate */}
                        <button
                          onClick={() => handleDuplicate(p)}
                          title="Dupliquer"
                          style={{
                            padding: '7px 12px',
                            borderRadius: '10px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: 'var(--text-soft)',
                            background: '#FFFFFF',
                            border: '1px solid var(--line)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#FAF7F5')}
                          onMouseLeave={e => (e.currentTarget.style.background = '#FFFFFF')}
                        >
                          <Icon icon="lucide:copy" /> Copier
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setConfirmDelete(p)}
                          title="Supprimer"
                          style={{
                            padding: '7px 10px',
                            borderRadius: '10px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#DC2626',
                            background: '#FEE2E2',
                            border: '1px solid #FCA5A5',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#FCA5A5')}
                          onMouseLeave={e => (e.currentTarget.style.background = '#FEE2E2')}
                        >
                          <Icon icon="lucide:trash-2" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '60px 24px', textAlign: 'center', background: '#FFFFFF' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
                      <Icon icon="lucide:package-open" style={{ color: 'var(--text-soft)' }} />
                    </div>
                    <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                      Aucun produit trouvé
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>
                      Essayez de modifier votre filtre ou votre mot-clé de recherche.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick View Modal */}
      {previewProduct && (
        <div
          onClick={() => setPreviewProduct(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 70,
            background: 'rgba(21, 15, 24, 0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
              border: '1px solid var(--line)',
            }}
          >
            <div style={{ position: 'relative', height: '240px', background: '#FAF8F4' }}>
              <img
                src={previewProduct.image}
                alt={previewProduct.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                onClick={() => setPreviewProduct(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon icon="lucide:x" />
              </button>
            </div>

            <div style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: previewProduct.inStock ? '#DCFCE7' : '#FEE2E2',
                    color: previewProduct.inStock ? '#166534' : '#991B1B',
                  }}
                >
                  {previewProduct.inStock ? '● En stock' : '○ Rupture de stock'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>
                  Catégorie: {CAT_LABELS[previewProduct.categorySlug]}
                </span>
              </div>

              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
                {previewProduct.name}
              </h2>

              <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--pink-deep)', marginBottom: '16px' }}>
                {previewProduct.priceFormatted}
              </p>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-soft)', lineHeight: 1.6, marginBottom: '24px' }}>
                {previewProduct.description || "Aucune description détaillée renseignée pour ce produit."}
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setPreviewProduct(null)}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '100px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    border: '1.5px solid var(--line)',
                    background: 'transparent',
                    color: 'var(--text)',
                    cursor: 'pointer',
                  }}
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    const pid = previewProduct.id;
                    setPreviewProduct(null);
                    navigate(`/admin/products/${pid}/edit`);
                  }}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '100px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    background: 'linear-gradient(90deg, #A99084 0%, #8F776C 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(169, 144, 132, 0.35)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Icon icon="lucide:edit-3" /> Modifier ce Produit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div
          onClick={() => setConfirmDelete(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 80,
            background: 'rgba(21, 15, 24, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '32px 36px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
              border: '1px solid var(--line)',
              textAlign: 'center',
            }}
          >
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 16px auto' }}>
              <Icon icon="lucide:alert-triangle" />
            </div>

            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.7rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
              Supprimer le produit ?
            </h3>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-soft)', marginBottom: '24px', lineHeight: 1.5 }}>
              Êtes-vous sûr de vouloir supprimer définitivement <strong>"{confirmDelete.name}"</strong> ? Cette opération est immédiate et irréversible.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{
                  padding: '11px 24px',
                  borderRadius: '100px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: '1.5px solid var(--line)',
                  background: '#FFFFFF',
                  color: 'var(--text)',
                  cursor: 'pointer',
                }}
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                style={{
                  padding: '11px 26px',
                  borderRadius: '100px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  background: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
                }}
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
