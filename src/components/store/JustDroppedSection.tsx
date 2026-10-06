import React from 'react';
import type { Product } from '../../data/types';
import ProductCard from './ProductCard';

interface JustDroppedSectionProps {
  products: Product[];
  onOpenQuickView: (product: Product) => void;
}

export default function JustDroppedSection({ products, onOpenQuickView }: JustDroppedSectionProps) {
  if (!products || products.length === 0) return null;

  // Newest products sorted by updatedAt or insertion order
  const newArrivals = [...products]
    .sort((a, b) => {
      const tA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const tB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return tB - tA;
    })
    .slice(0, 4);

  if (newArrivals.length === 0) return null;

  return (
    <section className="cat" style={{ position: 'relative', paddingTop: '40px', paddingBottom: '30px' }}>
      <div className="wrap">
        <div className="cat-head" style={{ marginBottom: '28px' }}>
          <div>
            <div className="cat-num">NOUVEAUTÉS · DERNIERS PRODUITS</div>
            <h2>Dernières Nouveautés</h2>
          </div>
        </div>

        <div className="grid grid-4">
          {newArrivals.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenQuickView={onOpenQuickView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

