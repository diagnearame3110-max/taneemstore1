import { useState } from 'react';
import { Icon } from '@iconify/react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useProducts } from '../../store/ProductsContext';
import { useToast } from '../../store/ToastContext';
import type { Category, CategorySlug } from '../../data/types';

const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  corps: { bg: '#FDF8F5', text: '#8F776C', border: '#EFE8E3' },
  visage: { bg: '#F0F9FF', text: '#0369A1', border: '#BAE6FD' },
  maquillage: { bg: '#FEFCE8', text: '#854D0E', border: '#FEF08A' },
  accessoires: { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
  bienetre: { bg: '#F5F3FF', text: '#5B21B6', border: '#DDD6FE' },
};

export default function CategoriesPage() {
  const { categories, products, updateCategory, reorderCategories } = useProducts();
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

  async function move(slug: CategorySlug, dir: -1 | 1) {
    const slugs = sorted.map(c => c.slug);
    const i = slugs.indexOf(slug);
    const j = i + dir;
    if (j < 0 || j >= slugs.length) return;
    [slugs[i], slugs[j]] = [slugs[j], slugs[i]];
    await reorderCategories(slugs);
    showToast('Ordre des catégories mis à jour.');
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
            borderRadius: '18px',
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
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', fontFamily: "'Cormorant Garamond', serif" }}>
              {categories.length}
            </p>
          </div>
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#F5EFEA', color: 'var(--pink-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon icon="lucide:tags" style={{ fontSize: '1.4rem' }} />
          </div>
        </div>

        {/* Total Products Assigned */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '18px',
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
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--pink-deep)', fontFamily: "'Cormorant Garamond', serif" }}>
              {totalAssignedProducts}
            </p>
          </div>
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#FAF7F5', color: 'var(--pink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon icon="lucide:package" style={{ fontSize: '1.4rem' }} />
          </div>
        </div>

        {/* Order Info */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '18px',
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
              Ordre d'Affichage
            </p>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>
              Utilisez les flèches pour réorganiser
            </p>
          </div>
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#E0F2FE', color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon icon="lucide:arrow-up-down" style={{ fontSize: '1.4rem' }} />
          </div>
        </div>
      </div>

      {/* Main Categories List Container */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid var(--line)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)', background: '#FAF7F5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' }}>
            Ordre et Réglages des Catégories
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>
            {categories.length} catégories configurées
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
                  alignItems: 'flex-start',
                  gap: '20px',
                  padding: '24px',
                  borderBottom: idx < sorted.length - 1 ? '1px solid var(--line)' : 'none',
                  transition: 'background 0.15s ease',
                  background: isEditing ? '#FAF8F4' : '#FFFFFF',
                }}
              >
                {/* Reorder Arrows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '4px' }}>
                  <button
                    onClick={() => move(cat.slug, -1)}
                    disabled={idx === 0}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                      background: idx === 0 ? '#F5F5F5' : '#FFFFFF',
                      color: idx === 0 ? '#CCCCCC' : 'var(--text)',
                      cursor: idx === 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      transition: 'all 0.15s ease',
                    }}
                    title="Monter dans l'ordre"
                  >
                    <Icon icon="lucide:arrow-up" />
                  </button>
                  <button
                    onClick={() => move(cat.slug, 1)}
                    disabled={idx === sorted.length - 1}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                      background: idx === sorted.length - 1 ? '#F5F5F5' : '#FFFFFF',
                      color: idx === sorted.length - 1 ? '#CCCCCC' : 'var(--text)',
                      cursor: idx === sorted.length - 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      transition: 'all 0.15s ease',
                    }}
                    title="Descendre dans l'ordre"
                  >
                    <Icon icon="lucide:arrow-down" />
                  </button>
                </div>

                {/* Number Pill Badge */}
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: badge.text,
                    background: badge.bg,
                    border: `1px solid ${badge.border}`,
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {cat.number}
                </div>

                {/* Category Information / Edit Inputs */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.title ?? ''}
                        onChange={e => setEditData(d => ({ ...d, title: e.target.value }))}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid var(--pink)',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          outline: 'none',
                          color: 'var(--text)',
                          background: '#FFFFFF',
                          minWidth: '240px',
                        }}
                      />
                    ) : (
                      <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', fontWeight: 700, color: 'var(--text)' }}>
                        {cat.title}
                      </h4>
                    )}

                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '100px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        background: badge.bg,
                        color: badge.text,
                        border: `1px solid ${badge.border}`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Icon icon="lucide:package" /> {count} produit{count > 1 ? 's' : ''}
                    </span>
                  </div>

                  {isEditing ? (
                    <textarea
                      value={editData.description ?? ''}
                      onChange={e => setEditData(d => ({ ...d, description: e.target.value }))}
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '100px',
                        border: '1.5px solid var(--line)',
                        fontSize: '0.88rem',
                        outline: 'none',
                        color: 'var(--text-soft)',
                        background: '#FFFFFF',
                        resize: 'vertical',
                        marginTop: '6px',
                        boxSizing: 'border-box',
                      }}
                    />
                  ) : (
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-soft)', lineHeight: 1.5 }}>
                      {cat.description}
                    </p>
                  )}
                </div>

                {/* Actions Button */}
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0, paddingTop: '4px' }}>
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setEditing(null)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '100px',
                          fontSize: '0.82rem',
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
                          padding: '8px 18px',
                          borderRadius: '100px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          background: 'linear-gradient(90deg, #A99084 0%, #8F776C 100%)',
                          color: '#FFFFFF',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 3px 10px rgba(169, 144, 132, 0.3)',
                        }}
                      >
                        Sauvegarder
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(cat)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '100px',
                        fontSize: '0.82rem',
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
