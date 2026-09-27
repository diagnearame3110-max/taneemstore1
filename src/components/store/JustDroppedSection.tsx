import React from 'react';
import type { Product } from '../../data/types';
import ProductCard from './ProductCard';

interface JustDroppedSectionProps {
  products: Product[];
  onOpenQuickView: (product: Product) => void;
}

export default function JustDroppedSection({ products, onOpenQuickView }: JustDroppedSectionProps) {
  const newArrivals = products.slice(0, 4);

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-[var(--line)]">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-sans font-semibold tracking-[0.25em] text-[var(--rose-vieilli)] uppercase block mb-1">
            NEW ARRIVALS
          </span>
          <h2 className="text-3xl font-serif text-[var(--espresso)] tracking-tight">
            JUST DROPPED
          </h2>
          <p className="text-xs text-[var(--text-soft)] mt-1">
            Meet the newest additions to your everyday ritual.
          </p>
        </div>

        <a
          href="#the-taneem-edit"
          className="btn-outline text-xs py-2.5 px-6 whitespace-nowrap"
        >
          SHOP NEW IN
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {newArrivals.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onOpenQuickView={onOpenQuickView}
          />
        ))}
      </div>
    </section>
  );
}
