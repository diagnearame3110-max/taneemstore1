import type { Product, Category } from './types';

export const SEED_CATEGORIES: Category[] = [
  {
    "slug": "corps",
    "number": "01",
    "title": "Corps",
    "description": "Lotions, gommages et rituels hydratation pour le corps.",
    "order": 1
  },
  {
    "slug": "visage",
    "number": "02",
    "title": "Visage",
    "description": "Sérums, masques et soins ciblés pour un teint lumineux.",
    "order": 2
  },
  {
    "slug": "accessoires",
    "number": "03",
    "title": "Accessoires",
    "description": "Les outils indispensables pour votre routine.",
    "order": 3
  },
  {
    "slug": "bienetre",
    "number": "04",
    "title": "Bien-être",
    "description": "Soins et produits pour votre bien-être au quotidien.",
    "order": 4
  }
];

export const SEED_PRODUCTS: Product[] = [];
