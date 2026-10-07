import type { Product, Category } from './types';

export const SEED_CATEGORIES: Category[] = [
  {
    "slug": "visage",
    "number": "01 — Skin",
    "title": "Skin — Visage & Lèvres",
    "description": "Sérums, masques et soins ciblés pour un teint lumineux.",
    "order": 1
  },
  {
    "slug": "corps",
    "number": "02 — Body",
    "title": "Body — Soins du Corps",
    "description": "Lotions, gommages et rituels hydratation pour le corps.",
    "order": 2
  },
  {
    "slug": "maquillage",
    "number": "03 — Beauty",
    "title": "Beauty — Maquillage & Éclat",
    "description": "Quelques essentiels maquillage au quotidien.",
    "order": 3
  },
  {
    "slug": "accessoires",
    "number": "04 — Accessories",
    "title": "Accessoires Beauté",
    "description": "Les outils indispensables pour votre routine.",
    "order": 4
  },
  {
    "slug": "bienetre",
    "number": "05 — Wellness",
    "title": "Wellness — Bien-être & Hygiène",
    "description": "Soins et produits pour votre bien-être au quotidien.",
    "order": 5
  }
];

export const SEED_PRODUCTS: Product[] = [];

