import { useState } from 'react';
import { Icon } from '@iconify/react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useProducts } from '../../store/ProductsContext';
import { useToast } from '../../store/ToastContext';
import type { Category, CategorySlug } from '../../data/types';

const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  skincare: { bg: '#F0F9FF', text: '#0369A1', border: '#BAE6FD' },
  corps: { bg: '#FAF5F2', text: '#8F776C', border: '#EFE8E3' },
  dentaire: { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
  levres: { bg: '#FFF1F2', text: '#E11D48', border: '#FECDD3' },
  bienetre: { bg: '#F5F3FF', text: '#5B21B6', border: '#DDD6FE' },
  visage: { bg: '#F0F9FF', text: '#0369A1', border: '#BAE6FD' },
  accessoires: { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
};

export default function CategoriesPage() {
  const { categories, products, updateCategory } = useProducts();
  const { showToast } = useToast();
  const sorted = [...categories].sort((a, b) => a.order - b.order);
  const [editing, setEditing] = useState<CategorySlug | null>(null);
  const [editData, setEditData] = useState<Partial<Category>>({});

  function startEdit(cat: Category) {
    setEditing(cat.slug);
    setEditData({ title: cat.title, description: cat.description });
  }

  async function saveEdit(slug: CategorySlug) {
    await updateCategory(slug, editData);
    showToast('Catégorie mise à jour avec succès.');
    setEditing(null);
  }

  const totalAssignedProducts = products.length;

  return (
    <AdminLayout title="Gestion des Catégories">
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {/* Total Categories */}
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
              Catégories Principales
            </p>
            <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)' }}>
              {categories.length}
            </p>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#F5EFEA', color: 'var(--pink-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon icon="lucide:tags" style={{ fontSize: '1.3rem' }} />
          </div>
        </div>

        {/* Total Products Assigned */}
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
              Produits Répartis
            </p>
            <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--pink-deep)' }}>
              {totalAssignedProducts}
            </p>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#FAF7F5', color: 'var(--pink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon icon="lucide:package" style={{ fontSize: '1.3rem' }} />
          </div>
        </div>
      </div>

      {/* Categories Table Card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid var(--line)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--line)', background: '#FAF7F5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>
            Liste des Catégories du Catalogue
          </h3>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-soft)' }}>
            {categories.length} catégories répertoriées
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {sorted.map((cat, idx) => {
            const count = products.filter(p => p.categorySlug === cat.slug).length;
            const isEditing = editing === cat.slug;
            const badge = CAT_COLORS[cat.slug] ?? CAT_COLORS.corps;

            return (
              <div
                key={cat.slug}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px 24px',
                  borderBottom: idx < sorted.length - 1 ? '1px solid var(--line)' : 'none',
                  transition: 'background 0.15s ease',
                  background: isEditing ? '#FAF8F4' : '#FFFFFF',
                }}
              >
                {/* Number Badge */}
                <div
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: badge.text,
                    background: badge.bg,
                    border: `1px solid ${badge.border}`,
                    padding: '6px 12px',
                    borderRadius: '6px',
                    flexShrink: 0,
                  }}
                >
                  {cat.number}
                </div>

                {/* Content Area */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.title ?? ''}
                        onChange={e => setEditData(d => ({ ...d, title: e.target.value }))}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '10px',
                          border: '1.5px solid var(--pink)',
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          outline: 'none',
                          color: 'var(--text)',
                          background: '#FFFFFF',
                          width: '260px',
                        }}
                      />
                    ) : (
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                        {cat.title}
                      </h4>
                    )}

                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: badge.bg,
                        color: badge.text,
                        border: `1px solid ${badge.border}`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Icon icon="lucide:package" style={{ fontSize: '0.8rem' }} /> {count} produit{count > 1 ? 's' : ''}
                    </span>
                  </div>

                  {isEditing ? (
                    <textarea
                      value={editData.description ?? ''}
                      onChange={e => setEditData(d => ({ ...d, description: e.target.value }))}
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid var(--line)',
                        fontSize: '0.85rem',
                        outline: 'none',
                        color: 'var(--text)',
                        background: '#FFFFFF',
                        resize: 'vertical',
                        marginTop: '6px',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit',
                      }}
                    />
                  ) : (
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-soft)', margin: 0, lineHeight: 1.4 }}>
                      {cat.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setEditing(null)}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '10px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          border: '1px solid var(--line)',
                          background: '#FFFFFF',
                          color: 'var(--text)',
                          cursor: 'pointer',
                        }}
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => saveEdit(cat.slug)}
                        style={{
                          padding: '7px 16px',
                          borderRadius: '10px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          background: 'linear-gradient(90deg, #A99084 0%, #8F776C 100%)',
                          color: '#FFFFFF',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Sauvegarder
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(cat)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '10px',
                        fontSize: '0.8rem',
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
                      <Icon icon="lucide:edit-3" /> Modifier
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
