import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useProducts } from '../../store/ProductsContext';
import { useToast } from '../../store/ToastContext';
import type { Product } from '../../data/types';

const CAT_LABELS: Record<string, string> = {
  corps: 'Corps', visage: 'Visage', maquillage: 'Maquillage',
  accessoires: 'Accessoires', bienetre: 'Bien-être',
};
const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  corps: { bg: '#FBE1EC', text: '#9A0C52' },
  visage: { bg: '#E0F2FE', text: '#0369A1' },
  maquillage: { bg: '#FEF3C7', text: '#92400E' },
  accessoires: { bg: '#DCFCE7', text: '#166534' },
  bienetre: { bg: '#EDE9FE', text: '#5B21B6' },
};

export default function ProductsPage() {
  const { products, deleteProduct, toggleStock, addProduct } = useProducts();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'price'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);

  const filtered = products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => !catFilter || p.categorySlug === catFilter)
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

  function handleDelete(p: Product) {
    deleteProduct(p.id);
    showToast(`Produit "${p.name}" supprimé.`);
    setConfirmDelete(null);
  }

  function handleDuplicate(p: Product) {
    addProduct({
      name: p.name + ' (copie)',
      description: p.description,
      price: p.price,
      image: p.image,
      categorySlug: p.categorySlug,
      inStock: p.inStock,
    });
    showToast('Produit dupliqué.');
  }

  return (
    <AdminLayout title="Produits">
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', marginBottom: '28px', background: '#FFFFFF', padding: '20px 24px', borderRadius: '16px', border: '1px solid var(--line)' }}>
        <input
          type="text"
          placeholder="Rechercher un produit…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: '240px',
            padding: '12px 18px',
            borderRadius: '12px',
            border: '1px solid var(--line)',
            fontSize: '0.9rem',
            outline: 'none',
            background: 'var(--bg)',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--pink)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--line)')}
        />
        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          style={{
            padding: '12px 18px',
            borderRadius: '12px',
            border: '1px solid var(--line)',
            fontSize: '0.9rem',
            outline: 'none',
            background: 'var(--bg)',
            cursor: 'pointer',
          }}
        >
          <option value="">Toutes les catégories</option>
          {Object.entries(CAT_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button
          onClick={() => navigate('/admin/products/new')}
          style={{
            padding: '12px 24px',
            borderRadius: '100px',
            fontWeight: 700,
            fontSize: '0.88rem',
            color: '#FFFFFF',
            background: 'var(--pink)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(196, 122, 143, 0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--pink-deep)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--pink)')}
        >
          + Ajouter un produit
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#E5E3E8' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E3E8', background: '#FAFAF9' }}>
              <th className="w-16 px-4 py-3" />
              <th
                className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide cursor-pointer select-none"
                style={{ color: 'var(--ink-soft)' }}
                onClick={() => toggleSort('name')}
              >
                Nom {sortKey === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                Catégorie
              </th>
              <th
                className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide cursor-pointer select-none"
                style={{ color: 'var(--ink-soft)' }}
                onClick={() => toggleSort('price')}
              >
                Prix {sortKey === 'price' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                Stock
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const cat = CAT_COLORS[p.categorySlug] ?? CAT_COLORS.corps;
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid #F0EEF2' }}>
                  <td className="px-4 py-2">
                    <div
                      className="w-10 h-10 rounded-lg overflow-hidden"
                      style={{ background: 'var(--blush-soft)' }}
                    >
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium max-w-48 truncate" style={{ color: 'var(--ink)' }}>
                    {p.name}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: cat.bg, color: cat.text }}
                    >
                      {CAT_LABELS[p.categorySlug]}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{p.priceFormatted}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { toggleStock(p.id); showToast(p.inStock ? 'Marqué rupture de stock.' : 'Produit en stock.'); }}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors cursor-pointer"
                      style={{
                        background: p.inStock ? '#dcfce7' : '#fee2e2',
                        color: p.inStock ? '#166534' : '#991b1b',
                      }}
                    >
                      {p.inStock ? 'En stock' : 'Rupture'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                        style={{ borderColor: '#E5E3E8', color: 'var(--ink)' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--pink)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = '#E5E3E8')}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDuplicate(p)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                        style={{ borderColor: '#E5E3E8', color: 'var(--ink-soft)' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = '#E5E3E8')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = '#E5E3E8')}
                      >
                        Dupliquer
                      </button>
                      <button
                        onClick={() => setConfirmDelete(p)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                        style={{ borderColor: '#fee2e2', color: '#991b1b', background: '#fff1f1' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#fee2e2')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#fff1f1')}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm" style={{ color: 'var(--ink-soft)' }}>
                  Aucun produit trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(27,20,32,0.4)' }}
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--ink)' }}>
              Supprimer "{confirmDelete.name}" ?
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--ink-soft)' }}>
              Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium border"
                style={{ borderColor: '#E5E3E8', color: 'var(--ink)' }}
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: '#dc2626' }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
