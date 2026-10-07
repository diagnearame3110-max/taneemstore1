import type { Category, Product } from '../../data/types';
import ProductCard from './ProductCard';
import { normalizeCategorySlug, formatCategoryTitle } from '../../utils/format';

interface Props {
  category: Category;
  products: Product[];
  onOpenQuickView?: (product: Product) => void;
}

export default function CategorySection({ category, products, onOpenQuickView }: Props) {
  if (!category || !category.slug) return null;
  const targetSlug = normalizeCategorySlug(category.slug);
  const active = (products || []).filter(p => p && normalizeCategorySlug(p.categorySlug || (p as any).category_slug) === targetSlug);
  const displayTitle = formatCategoryTitle(category.title, category.slug);

  return (
    <section id={category.slug} className="cat" style={{ position: 'relative' }}>
      {category.slug === 'bienetre' && <div id="boutique" style={{ position: 'absolute', top: '-90px' }} />}
      <div className="wrap">
        <div className="cat-head">
          <div>
            <h2>
              {String(category.number || '01').replace(/^0+/, '').padStart(2, '0')}. {displayTitle}
            </h2>
          </div>
        </div>

        {active.length > 0 ? (
          <div className="grid grid-4">
            {active.map(product => (
              <ProductCard key={product.id} product={product} onOpenQuickView={onOpenQuickView} />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '36px 24px',
              textAlign: 'center',
              background: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid var(--line)',
              color: 'var(--text-soft)',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          >
            Aucun produit disponible dans la catégorie {category.title || ''} pour le moment.
          </div>
        )}
      </div>
    </section>
  );
}
