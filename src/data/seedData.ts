import type { Product, Category } from './types';

export const SEED_CATEGORIES: Category[] = [
  {
    "slug": "skincare",
    "number": "01",
    "title": "SKINCARE",
    "description": "Sérums, nettoyants, crèmes et soins ciblés du visage pour une peau éclatante.",
    "order": 1
  },
  {
    "slug": "corps",
    "number": "02",
    "title": "SOIN CORPS",
    "description": "Lotions, gommages, huiles et rituels hydratation pour le corps.",
    "order": 2
  },
  {
    "slug": "dentaire",
    "number": "03",
    "title": "SOIN DENTAIRE",
    "description": "Dentifrices, bains de bouche et accessoires d'hygiène bucco-dentaire.",
    "order": 3
  },
  {
    "slug": "levres",
    "number": "04",
    "title": "SOIN DES LEVRES",
    "description": "Baumes, masques, exfoliants et soins nourrissants pour les lèvres.",
    "order": 4
  },
  {
    "slug": "bienetre",
    "number": "05",
    "title": "SOIN ET BIEN ETRE",
    "description": "Soins et produits pour votre bien-être au quotidien.",
    "order": 5
  }
];

export const SEED_PRODUCTS: Product[] = [];
