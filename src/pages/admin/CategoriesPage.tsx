import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useProducts } from '../../store/ProductsContext';
import { useToast } from '../../store/ToastContext';
import type { Category, CategorySlug } from '../../data/types';

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

  function saveEdit(slug: CategorySlug) {
    updateCategory(slug, editData);
    showToast('Catégorie mise à jour.');
    setEditing(null);
  }

  function move(slug: CategorySlug, dir: -1 | 1) {
    const slugs = sorted.map(c => c.slug);
    const i = slugs.indexOf(slug);
    const j = i + dir;
    if (j < 0 || j >= slugs.length) return;
    [slugs[i], slugs[j]] = [slugs[j], slugs[i]];
    reorderCategories(slugs);
    showToast('Ordre mis à jour.');
  }

  return (
    <AdminLayout title="Catégories">
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#E5E3E8' }}>
        {sorted.map((cat, idx) => {
          const count = products.filter(p => p.categorySlug === cat.slug).length;
          const isEditing = editing === cat.slug;
          return (
            <div
              key={cat.slug}
              className="flex items-start gap-4 p-5"
              style={{ borderBottom: idx < sorted.length - 1 ? '1px solid #F0EEF2' : 'none' }}
            >
              <div className="flex flex-col gap-1 mt-1">
                <button
                  onClick={() => move(cat.slug, -1)}
                  disabled={idx === 0}
                  className="w-7 h-7 rounded flex items-center justify-center text-xs disabled:opacity-30 transition-colors"
                  style={{ border: '1px solid #E5E3E8', color: 'var(--ink-soft)' }}
                  title="Monter"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(cat.slug, 1)}
                  disabled={idx === sorted.length - 1}
                  className="w-7 h-7 rounded flex items-center justify-center text-xs disabled:opacity-30 transition-colors"
                  style={{ border: '1px solid #E5E3E8', color: 'var(--ink-soft)' }}
                  title="Descendre"
                >
                  ↓
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold" style={{ color: 'var(--pink)' }}>{cat.number}</span>
                  {isEditing ? (
                    <input
                      value={editData.title ?? ''}
                      onChange={e => setEditData(d => ({ ...d, title: e.target.value }))}
                      className="text-sm font-semibold px-2 py-1 rounded border outline-none"
                      style={{ borderColor: 'var(--pink)', color: 'var(--ink)' }}
                    />
                  ) : (
                    <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{cat.title}</span>
                  )}
                  <span
                    className="ml-1 px-2 py-0.5 rounded-full text-xs"
                    style={{ background: 'var(--blush)', color: 'var(--ink-soft)' }}
                  >
                    {count} produit{count > 1 ? 's' : ''}
                  </span>
                </div>

                {isEditing ? (
                  <textarea
                    value={editData.description ?? ''}
                    onChange={e => setEditData(d => ({ ...d, description: e.target.value }))}
                    rows={2}
                    className="w-full text-sm px-3 py-2 rounded border outline-none resize-none"
                    style={{ borderColor: '#E5E3E8', color: 'var(--ink-soft)' }}
                  />
                ) : (
                  <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>{cat.description}</p>
                )}
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => saveEdit(cat.slug)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                      style={{ background: 'var(--pink)' }}
                    >
                      Sauvegarder
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border"
                      style={{ borderColor: '#E5E3E8', color: 'var(--ink-soft)' }}
                    >
                      Annuler
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(cat)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                      style={{ borderColor: '#E5E3E8', color: 'var(--ink)' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--pink)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = '#E5E3E8')}
                    >
                      Modifier
                    </button>
                    {count > 0 && (
                      <span className="px-3 py-1 text-xs text-center" style={{ color: '#d97706' }}>
                        {count} produit{count > 1 ? 's' : ''} associé{count > 1 ? 's' : ''}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
