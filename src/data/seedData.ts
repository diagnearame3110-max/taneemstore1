import type { Product, Category } from './types';

export const SEED_CATEGORIES: Category[] = [
  {
    "slug": "corps",
    "number": "01 — Corps",
    "title": "Soins du corps",
    "description": "Lotions, gommages et rituels hydratation pour le corps.",
    "order": 1
  },
  {
    "slug": "visage",
    "number": "02 — Visage",
    "title": "Visage & lèvres",
    "description": "Sérums, masques et soins ciblés pour un teint lumineux.",
    "order": 2
  },
  {
    "slug": "maquillage",
    "number": "03 — Maquillage",
    "title": "Maquillage",
    "description": "Quelques essentiels maquillage au quotidien.",
    "order": 3
  },
  {
    "slug": "accessoires",
    "number": "04 — Accessoires",
    "title": "Accessoires beauté",
    "description": "Les outils indispensables pour votre routine.",
    "order": 4
  },
  {
    "slug": "bienetre",
    "number": "05 — Bien-être",
    "title": "Bien-être & hygiène",
    "description": "Soins et produits pour votre bien-être au quotidien.",
    "order": 5
  }
];

export const SEED_PRODUCTS: Product[] = [];

