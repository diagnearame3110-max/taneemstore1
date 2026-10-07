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
    "slug": "maquillage",
    "number": "03",
    "title": "Maquillage",
    "description": "Quelques essentiels maquillage au quotidien.",
    "order": 3
  },
  {
    "slug": "accessoires",
    "number": "04",
    "title": "Accessoires",
    "description": "Les outils indispensables pour votre routine.",
    "order": 4
  },
  {
    "slug": "bienetre",
    "number": "05",
    "title": "Bien-être",
    "description": "Soins et produits pour votre bien-être au quotidien.",
    "order": 5
  }
];

export const SEED_PRODUCTS: Product[] = [];

