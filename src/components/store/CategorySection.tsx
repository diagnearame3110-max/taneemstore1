import type { Category, Product } from '../../data/types';
import ProductCard from './ProductCard';
import { normalizeCategorySlug } from '../../utils/format';

interface Props {
  category: Category;
  products: Product[];
  onOpenQuickView?: (product: Product) => void;
}

export default function CategorySection({ category, products, onOpenQuickView }: Props) {
  if (!category || !category.slug) return null;
  const targetSlug = normalizeCategorySlug(category.slug);
  const active = (products || []).filter(p => p && normalizeCategorySlug(p.categorySlug || (p as any).category_slug) === targetSlug);
  if (active.length === 0) return null;

  return (
    <section id={category.slug} className="cat" style={{ position: 'relative' }}>
      {category.slug === 'bienetre' && <div id="boutique" style={{ position: 'absolute', top: '-90px' }} />}
      <div className="wrap">
        <div className="cat-head">
          <div>
            <div className="cat-num">{category.number || '01'} · {(category.title || '').toUpperCase()}</div>
            <h2>{category.title || ''}</h2>
          </div>
        </div>
        <div className="grid grid-4">
          {active.map(product => (
            <ProductCard key={product.id} product={product} onOpenQuickView={onOpenQuickView} />
          ))}
        </div>
      </div>
    </section>
  );
}
