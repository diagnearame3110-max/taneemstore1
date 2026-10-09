import React, { useState } from 'react';
import { useProducts } from '../store/ProductsContext';
import { SEED_CATEGORIES } from '../data/seedData';
import Header from '../components/store/Header';
import Hero from '../components/store/Hero';
import BeautyManifesto from '../components/store/BeautyManifesto';
import EditorialDualBanner from '../components/store/EditorialDualBanner';
import ExploreCategories from '../components/store/ExploreCategories';
import TrustStrip from '../components/store/TrustStrip';
import CategorySection from '../components/store/CategorySection';
import CTABand from '../components/store/CTABand';
import Footer from '../components/store/Footer';
import WhatsAppFloatButton from '../components/store/WhatsAppFloatButton';
import CartDrawer from '../components/store/CartDrawer';
import ToastContainer from '../components/store/ToastContainer';
import ProductQuickViewModal from '../components/store/ProductQuickViewModal';
import type { Product } from '../data/types';

export default function StorePage() {
  const { products = [], categories = [] } = useProducts() || {};
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const validCategories = Array.isArray(categories) && categories.length > 0 ? categories : SEED_CATEGORIES;
  const sorted = [...validCategories].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div style={{ background: 'var(--bg)' }}>
      <div style={{ position: 'relative' }}>
        <Header />
        <Hero />
      </div>
      <main>
        <BeautyManifesto />
        <TrustStrip />
        <ExploreCategories />
        {sorted.map((cat, idx) => (
          <React.Fragment key={cat.slug}>
            <CategorySection
              category={{
                ...cat,
                number: String(idx + 1).padStart(2, '0')
              }}
              products={products}
              onOpenQuickView={prod => setQuickViewProduct(prod)}
            />
          </React.Fragment>
        ))}
        <EditorialDualBanner />
        <CTABand />
      </main>
      <Footer />
      <WhatsAppFloatButton />
      <CartDrawer />
      <ToastContainer />
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
