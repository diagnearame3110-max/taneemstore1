export type CategorySlug = 'skincare' | 'corps' | 'dentaire' | 'levres' | 'bienetre';

export interface ProductColor {
  id: string;
  name: string;
  hex?: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  priceFormatted: string;
  image: string;
  gallery?: string[];
  colors?: ProductColor[];
  categorySlug: CategorySlug;
  inStock: boolean;
  updatedAt: string;
}

export interface Category {
  slug: CategorySlug;
  number: string;
  title: string;
  description: string;
  order: number;
}

