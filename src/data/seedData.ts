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

export const SEED_PRODUCTS: Product[] = [
  {"id":"prod_1","name":"Rituel Corps Import","description":"Duo Dove & Vaseline, gommage et brosse corporelle.","price":7500,"priceFormatted":"7 500 FCFA","image":"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80","categorySlug":"corps","inStock":true,"updatedAt":"2026-09-24T15:39:03.373Z"},
  {"id":"prod_2","name":"Trio Tree Hut Sugar Scrub","description":"Cotton Candy, Pink Champagne & Watermelon.","price":9000,"priceFormatted":"9 000 FCFA","image":"https://images.unsplash.com/photo-1608248597261-8131d24c08c9?w=500&auto=format&fit=crop&q=80","categorySlug":"corps","inStock":true,"updatedAt":"2026-09-24T15:39:03.373Z"},
  {"id":"prod_3","name":"Collection Beurre de Cacao","description":"Dove, Nivea & Palmer's, routine cacao nourrissante.","price":12000,"priceFormatted":"12 000 FCFA","image":"https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&auto=format&fit=crop&q=80","categorySlug":"corps","inStock":true,"updatedAt":"2026-09-24T15:39:03.373Z"},
  {"id":"prod_4","name":"Dove Nourishing Care + Gants","description":"Gel douche Dove + gants exfoliants.","price":6000,"priceFormatted":"6 000 FCFA","image":"https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=80","categorySlug":"corps","inStock":true,"updatedAt":"2026-09-24T15:39:03.373Z"},
  {"id":"prod_5","name":"EOS 24H Moisture Lotion","description":"Lotion corps parfumée, longue hydratation.","price":4500,"priceFormatted":"4 500 FCFA","image":"https://images.unsplash.com/photo-1617897903246-719242758050?w=500&auto=format&fit=crop&q=80","categorySlug":"corps","inStock":true,"updatedAt":"2026-09-24T15:39:03.373Z"},
  {"id":"prod_6","name":"Olay Super Serum + Glow Duo","description":"Duo body wash & lotion illuminateurs.","price":11000,"priceFormatted":"11 000 FCFA","image":"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80","categorySlug":"corps","inStock":true,"updatedAt":"2026-09-24T15:39:03.373Z"},
  {"id":"prod_7","name":"Garnier Vitamine C Sorbet","description":"Booster d'éclat hydratant pour le corps.","price":3500,"priceFormatted":"3 500 FCFA","image":"https://images.unsplash.com/photo-1608248545293-4c93d5847240?w=500&auto=format&fit=crop&q=80","categorySlug":"corps","inStock":true,"updatedAt":"2026-09-24T15:39:03.373Z"},
  {"id":"prod_8","name":"Gamme Olay Tone Brightening","description":"Body wash, lotion, gommage & soin nuit.","price":22000,"priceFormatted":"22 000 FCFA","image":"https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&auto=format&fit=crop&q=80","categorySlug":"corps","inStock":true,"updatedAt":"2026-09-24T15:39:03.373Z"},
  {"id":"prod_9","name":"Trio Erha1 Body Exfoliation","description":"Fraise, coco & framboise au collagène.","price":10500,"priceFormatted":"10 500 FCFA","image":"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80","categorySlug":"corps","inStock":true,"updatedAt":"2026-09-24T15:39:03.373Z"},
  {"id":"prod_10","name":"Tree Hut Watermelon Scrub","description":"Gommage sucré à la pastèque.","price":5000,"priceFormatted":"5 000 FCFA","image":"https://images.unsplash.com/photo-1567928269937-ae146e45b428?w=500&auto=format&fit=crop&q=80","categorySlug":"corps","inStock":true,"updatedAt":"2026-09-24T15:39:03.374Z"},
  {"id":"prod_11","name":"Honey Almond Sherbet Scrub","description":"Gommage sorbet miel & amande.","price":6500,"priceFormatted":"6 500 FCFA","image":"https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=500&auto=format&fit=crop&q=80","categorySlug":"corps","inStock":true,"updatedAt":"2026-09-24T15:39:03.374Z"},
  {"id":"prod_12","name":"Laneige Lip Sleeping Mask","description":"Masque de nuit lèvres, parfum Berry.","price":8500,"priceFormatted":"8 500 FCFA","image":"https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=80","categorySlug":"visage","inStock":true,"updatedAt":"2026-09-24T15:39:03.374Z"},
  {"id":"prod_13","name":"Duo Laneige Lip Care","description":"Baume + sérum lèvres, jour et nuit.","price":15000,"priceFormatted":"15 000 FCFA","image":"https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=500&auto=format&fit=crop&q=80","categorySlug":"visage","inStock":true,"updatedAt":"2026-09-24T15:39:03.374Z"},
  {"id":"prod_14","name":"Ruby Kiss Lip Oil","description":"Trio d'huiles lèvres, effet glossy.","price":5000,"priceFormatted":"5 000 FCFA","image":"https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500&auto=format&fit=crop&q=80","categorySlug":"visage","inStock":true,"updatedAt":"2026-09-24T15:39:03.374Z"},
  {"id":"prod_15","name":"Medix 5.5 Vitamine C + Curcuma","description":"Crème illuminatrice et raffermissante.","price":13500,"priceFormatted":"13 500 FCFA","image":"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80","categorySlug":"visage","inStock":true,"updatedAt":"2026-09-24T15:39:03.374Z"},
  {"id":"prod_16","name":"Garnier Vitamin C+ Booster","description":"Sérum éclat niacinamide & vitamine C.","price":9500,"priceFormatted":"9 500 FCFA","image":"https://images.unsplash.com/photo-1608248545293-4c93d5847240?w=500&auto=format&fit=crop&q=80","categorySlug":"visage","inStock":true,"updatedAt":"2026-09-24T15:39:03.374Z"},
  {"id":"prod_17","name":"L'Oréal Hydrogel Glow Mask","description":"Masque hydrogel effet peau de verre.","price":4000,"priceFormatted":"4 000 FCFA","image":"https://images.unsplash.com/photo-1512290900673-700200411b93?w=500&auto=format&fit=crop&q=80","categorySlug":"visage","inStock":true,"updatedAt":"2026-09-24T15:39:03.374Z"},
  {"id":"prod_18","name":"Skin1004 Centella Duo","description":"Mousse ampoule + huile démaquillante.","price":13000,"priceFormatted":"13 000 FCFA","image":"https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&auto=format&fit=crop&q=80","categorySlug":"visage","inStock":true,"updatedAt":"2026-09-24T15:39:03.374Z"},
  {"id":"prod_19","name":"NYX Buttermelt Blush","description":"Blush fondant, fini naturel & lumineux.","price":6000,"priceFormatted":"6 000 FCFA","image":"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=80","categorySlug":"maquillage","inStock":true,"updatedAt":"2026-09-24T15:39:03.374Z"},
  {"id":"prod_20","name":"Éponges Exfoliantes","description":"Loofahs doux multicolores, effet exfoliant.","price":2500,"priceFormatted":"2 500 FCFA","image":"https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=80","categorySlug":"accessoires","inStock":true,"updatedAt":"2026-09-24T15:39:03.374Z"},
  {"id":"prod_21","name":"Brosse de Massage Sèche","description":"Fibres naturelles, pour le brossage à sec.","price":4000,"priceFormatted":"4 000 FCFA","image":"https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&auto=format&fit=crop&q=80","categorySlug":"accessoires","inStock":true,"updatedAt":"2026-09-24T15:39:03.375Z"},
  {"id":"prod_22","name":"Gants Exfoliants","description":"Paire de gants doux pour le gommage.","price":2000,"priceFormatted":"2 000 FCFA","image":"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80","categorySlug":"accessoires","inStock":true,"updatedAt":"2026-09-24T15:39:03.375Z"},
  {"id":"prod_23","name":"Collagen30 — Peau Magnifique","description":"Complément collagène, élasticité & fermeté.","price":17500,"priceFormatted":"17 500 FCFA","image":"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80","categorySlug":"bienetre","inStock":true,"updatedAt":"2026-09-24T15:39:03.375Z"},
  {"id":"prod_24","name":"TheraBreath Oral Rinse","description":"Fraîcheur intense, formulé par un dentiste.","price":6500,"priceFormatted":"6 500 FCFA","image":"https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=500&auto=format&fit=crop&q=80","categorySlug":"bienetre","inStock":true,"updatedAt":"2026-09-24T15:39:03.375Z"},
  {"id":"prod_25","name":"Savon Dove Pampering","description":"Beurre de karité & vanille, 3-en-1.","price":1500,"priceFormatted":"1 500 FCFA","image":"https://images.unsplash.com/photo-1607006482172-132d72111c8a?w=500&auto=format&fit=crop&q=80","categorySlug":"bienetre","inStock":true,"updatedAt":"2026-09-24T15:39:03.375Z"},
  {"id":"prod_26","name":"Oral-B Vitality Pro","description":"Brosse électrique, tête ronde Protect X Clean.","price":18000,"priceFormatted":"18 000 FCFA","image":"https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=500&auto=format&fit=crop&q=80","categorySlug":"bienetre","inStock":true,"updatedAt":"2026-09-24T15:39:03.375Z"},
  {"id":"prod_27","name":"Dr. Pen M8S Microneedle","description":"Stylo de micro-needling auto, kit complet.","price":25000,"priceFormatted":"25 000 FCFA","image":"https://images.unsplash.com/photo-1608248597261-8131d24c08c9?w=500&auto=format&fit=crop&q=80","categorySlug":"bienetre","inStock":true,"updatedAt":"2026-09-24T15:39:03.375Z"},
  {"id":"prod_28","name":"Listerine Cool Mint 1.5L","description":"Bain de bouche antiseptique, grand format.","price":7000,"priceFormatted":"7 000 FCFA","image":"https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=500&auto=format&fit=crop&q=80","categorySlug":"bienetre","inStock":true,"updatedAt":"2026-09-24T15:39:03.375Z"},
  {"id":"prod_29","name":"Marvis Whitening Mint","description":"Dentifrice blancheur, menthe italienne.","price":8000,"priceFormatted":"8 000 FCFA","image":"https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=500&auto=format&fit=crop&q=80","categorySlug":"bienetre","inStock":true,"updatedAt":"2026-09-24T15:39:03.375Z"},
  {"id":"prod_30","name":"Gratte-langue Inox","description":"Racle-langue en acier, hygiène quotidienne.","price":2000,"priceFormatted":"2 000 FCFA","image":"https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&auto=format&fit=crop&q=80","categorySlug":"bienetre","inStock":true,"updatedAt":"2026-09-24T15:39:03.375Z"}
];
