Crée un site vitrine e-commerce React (React + TypeScript + Tailwind CSS) pour "Taneem'Store", une marque de produits cosmétiques basée à Dakar, Sénégal. C'est un site "vitrine" : pas de panier ni paiement en ligne — chaque produit a un bouton "Commander" qui ouvre WhatsApp avec un message pré-rempli. Le site inclut aussi une interface d'administration protégée permettant de gérer les produits (CRUD complet), avec persistance en localStorage (pas de vrai backend, mais l'architecture doit être prête à brancher une API plus tard).

## IDENTITÉ DE MARQUE
- Nom : Taneem'Store — tagline "Beauty and Wellness" / "The Clean Girl Era"
- Logo : texte cursive/script rose magenta (à remplacer par un asset logo.png fourni séparément)
- WhatsApp business : +221 78 173 49 94 → tous les liens de commande utilisent
  https://wa.me/221781734994?text=<message URL-encodé>
- Ton : élégant, dynamique, pro, orienté "clean girl aesthetic" — pas kitsch/bébé rose.

## DESIGN SYSTEM

Couleurs (variables CSS / thème Tailwind) :
- --pink: #D1116E (couleur signature, boutons, liens actifs)
- --pink-deep: #9A0C52 (hover)
- --blush: #FBE1EC (accents doux)
- --blush-soft: #FDF1F5 (fonds de vignette image)
- --ink: #1B1420 (texte principal / fond bandeau CTA sombre)
- --ink-soft / text-soft: #5B4C58 (texte secondaire)
- --white / --bg: #FFFFFF (fond principal)
- --line: #EDE2E7 (bordures fines)
Mode sombre (prefers-color-scheme: dark, ou data-theme="dark") :
- --bg:#170E14, --card:#231622, --text:#F6EEF2, --text-soft:#C9B7C3, --line:#3A2A34, --blush-soft:#2A1922

Typographie (Google Fonts) :
- Titres : "Fraunces" (variable font), italique, weight 600 — donne un côté éditorial haut de gamme, écho discret au logo script sans le copier
- Texte courant : "Inter", weights 400/500/600/700/800
- Les h1/h2/h3 de titres de section et de cartes produits sont TOUS en italique Fraunces
- L'interface admin utilise la même police Inter mais SANS l'italique Fraunces sur les titres (registre plus neutre/opérationnel, pour bien distinguer visuellement "boutique publique" et "back-office")

Formes / rythme visuel (boutique publique uniquement) :
Chaque catégorie de produits a un border-radius de carte DIFFÉRENT pour créer un rythme visuel :
- Corps : border-radius 20px classique
- Visage : border-radius 2px (angles nets, éditorial)
- Maquillage : border-radius 20px 2px 20px 2px (asymétrique)
- Accessoires : border-radius 100px 20px 20px 20px (un coin très arrondi type "pilule")
- Bien-être : border-radius 20px 20px 20px 2px

Cartes produit : hover = translateY(-5px) + ombre douce + léger zoom (scale 1.06) de l'image à l'intérieur (overflow hidden).

## STRUCTURE DE LA PAGE PUBLIQUE (dans l'ordre)

### 1. Header (sticky, fond blanc translucide + blur au scroll)
- Gauche : logo + "Taneem'Store" en Fraunces italique rose foncé
- Centre/droite (desktop) : liens ancre → Corps / Visage / Maquillage / Accessoires / Bien-être
- Bouton CTA rose pilule "Commander" → wa.me avec message générique "Bonjour Taneem'Store, je voudrais passer commande."
- Mobile (<880px) : liens desktop cachés, bouton burger (3 traits qui se transforment en croix) ouvre un drawer plein-hauteur glissant depuis la droite (largeur 78%, max 320px) avec overlay sombre (scrim) cliquable pour fermer. Le drawer contient les mêmes liens + CTA WhatsApp, en Fraunces italique.

### 2. Hero
- Eyebrow (petit label) : "BEAUTY AND WELLNESS · DAKAR"
- H1 (Fraunces italique, grande taille) : "The clean girl era commence ici."
- Paragraphe : "Taneem'Store sélectionne pour vous les essentiels beauté et bien-être importés — soins du corps, du visage, accessoires et compléments — à commander en un message."
- 2 CTA : bouton plein rose "Commander sur WhatsApp" (wa.me) + bouton outline "Voir les produits" (scroll vers #corps)
- Collage photo à droite : 3 images produits en superposition asymétrique, légèrement pivotées (rotate 3°, -4°, -8°), tailles différentes, avec une petite bordure blanche sur l'image du milieu. Un badge pilule "Beauty and Wellness" flotte en bas à droite du collage.
- ANIMATION (~5s en boucle, respecter prefers-reduced-motion) : chaque image du collage flotte doucement — translateY oscillant + légère rotation qui varie — avec une durée et un décalage légèrement différents par image (ex: 5s / 5.4s / 4.8s) pour un effet organique, pas mécanique/synchronisé.

### 3. Bandeau de confiance (3 colonnes, séparées par une bordure verticale fine)
- "Produits importés — sélection authentique"
- "Livraison à Dakar — et environs"
- "Commande simple — tout se passe sur WhatsApp"
(chaque item précédé d'un petit point rose)

### 4. Sections catégories (composant réutilisable `<CategorySection>` alimenté par le store produits — voir plus bas)
Chaque section a : un numéro (ex "01 — Corps"), un titre H2 italique, une description courte, puis une grille de `<ProductCard>` (grid-cols-2 mobile / 3 ou 4 desktop selon le nombre d'items).
Si une catégorie n'a aucun produit actif (ex : tout a été désactivé/supprimé depuis l'admin), la section entière ne s'affiche pas.

`<ProductCard>` affiche : image (aspect carré, object-cover), nom du produit (Fraunces italique), description courte (1 ligne), prix en FCFA à gauche, bouton "Commander" (fond ink, hover rose) à droite qui ouvre wa.me avec le message "Bonjour, je suis intéressé(e) par {nom du produit}."
Un produit avec `inStock: false` affiche un badge "Rupture de stock" superposé sur l'image (grisée) et le bouton Commander devient désactivé.

### 5. Bandeau CTA sombre (fond --ink, texte blanc, centré)
- H2 : "Un coup de cœur sur nos stories ?"
- Texte : "Écrivez-nous directement sur WhatsApp avec une capture du produit — on vous répond en quelques minutes."
- Bouton rose "Écrire sur WhatsApp"

### 6. Footer
- Bloc marque : "Taneem'Store" + "Beauty and Wellness — sélection de produits importés, à commander directement sur WhatsApp. Basé à Dakar, Sénégal."
- Colonne "Boutique" : liens ancre vers les catégories actives
- Colonne "Contact" : lien WhatsApp "78 173 49 94", lien Instagram "@taneemstore", "Dakar, Sénégal"
- Ligne de copyright : "© 2026 Taneem'Store. Tous droits réservés." + "The Clean Girl Era."
- Lien discret tout en bas, petit texte gris : "Administration" → mène à /admin/login (pas mis en avant visuellement, juste accessible)

### 7. Bouton WhatsApp flottant
Position fixed bottom-right, cercle vert (#1EBE5A), icône WhatsApp SVG, toujours visible même en scrollant, ouvre wa.me avec le message générique de commande.

## RESPONSIVE (boutique publique)
- < 880px : nav desktop cachée → burger + drawer ; hero passe en 1 colonne (collage sous le texte)
- < 640px : grilles produits en 2 colonnes ; CTA du hero empilés pleine largeur ; footer en colonne
- < 420px : grilles produits en 1 colonne ; ratio image carte passe en 4:3 ; hauteur du collage hero réduite

---

## INTERFACE ADMIN (back-office)

### Routing
- `/admin/login` — écran de connexion
- `/admin` — dashboard (redirige vers login si non authentifié)
- `/admin/products` — liste + CRUD produits
- `/admin/products/new` — création
- `/admin/products/:id/edit` — édition
- `/admin/categories` — gestion des catégories (liste simple, réordonnable)

### Authentification (simulée, front-only)
- Formulaire login : email + mot de passe, contre un identifiant mock codé en dur dans `data/adminUser.ts` (ex: admin@taneemstore.sn / un mot de passe défini en variable d'env ou constante clairement commentée "À REMPLACER EN PRODUCTION")
- Session simulée via localStorage (token factice) + Context React `AuthContext` avec `isAuthenticated`, `login()`, `logout()`
- Route guard `<ProtectedRoute>` qui redirige vers /admin/login si non connecté
- Bouton "Déconnexion" visible dans le header admin

### Layout admin
- Sidebar gauche fixe (fond --ink, texte clair) : logo Taneem'Store réduit, liens "Tableau de bord", "Produits", "Catégories", en bas bouton "Voir le site" (ouvre la boutique publique dans un nouvel onglet) et "Déconnexion"
- Header admin en haut : titre de la page courante + nom de l'admin connecté
- Design neutre, dense, orienté productivité (pas le style éditorial de la boutique) : fond gris très clair (#F7F6F8), cartes blanches, bordures fines, boutons rectangulaires arrondis 8px, accent rose (--pink) uniquement sur les actions principales (bouton "Ajouter un produit", liens actifs de la sidebar)

### Dashboard (/admin)
Cartes de stats en haut : nombre total de produits, nombre de catégories, nombre de produits en rupture de stock, produit le plus cher / moins cher (calculés dynamiquement depuis le store).
Tableau "Derniers produits modifiés" (5 lignes).

### Liste produits (/admin/products)
- Tableau avec colonnes : miniature image, nom, catégorie (badge coloré selon la catégorie), prix (FCFA), statut stock (toggle rapide En stock / Rupture), actions (Modifier / Dupliquer / Supprimer)
- Barre au-dessus : champ de recherche (filtre par nom), filtre dropdown par catégorie, bouton principal rose "+ Ajouter un produit" (va vers /admin/products/new)
- Suppression : modale de confirmation ("Supprimer {nom} ? Cette action est irréversible.") avant suppression effective
- Tri par colonne (nom, prix) au clic sur l'en-tête

### Formulaire produit (/admin/products/new et /admin/products/:id/edit — même composant `<ProductForm>` réutilisé)
Champs :
- Nom du produit (texte, requis)
- Catégorie (select parmi Corps / Visage / Maquillage / Accessoires / Bien-être & hygiène)
- Description courte (textarea, requis, compteur de caractères, limite suggérée ~60 caractères pour matcher le style des cartes)
- Prix (nombre, requis, affiché formaté en FCFA en aperçu live)
- Image produit : zone de drop / sélection de fichier avec aperçu immédiat (stocker en base64 dans le mock store, ou une simple URL si l'utilisateur préfère coller un lien)
- Statut : toggle "En stock" / "Rupture de stock"
- Panneau d'aperçu live à droite du formulaire : affiche la `<ProductCard>` exactement comme elle apparaîtra sur le site public, avec le border-radius de la catégorie sélectionnée, mise à jour en temps réel à chaque frappe
- Boutons : "Enregistrer" (rose, plein) / "Annuler" (retour à la liste sans sauvegarder)
- Validation : messages d'erreur inline si champs requis vides ou prix invalide

### Gestion catégories (/admin/categories)
- Liste des 5 catégories avec leur nombre de produits associés, leur numéro d'ordre, et le texte de description affiché sur le site public
- Édition du titre / de la description / de l'ordre d'affichage (drag-to-reorder ou boutons monter/descendre)
- Pas de suppression de catégorie si elle contient encore des produits (message d'avertissement)

### Notifications
Toasts discrets (coin haut-droit) pour confirmer : "Produit ajouté", "Produit modifié", "Produit supprimé", "Catégorie mise à jour" — auto-dismiss après 3s.

---

## ARCHITECTURE DE DONNÉES (partagée entre boutique publique et admin)

```ts
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;        // valeur numérique brute, ex 7500
  priceFormatted: string; // dérivé automatiquement, ex "7 500 FCFA"
  image: string;        // base64 ou URL
  categorySlug: "corps" | "visage" | "maquillage" | "accessoires" | "bienetre";
  inStock: boolean;
  updatedAt: string;     // ISO date, pour trier "derniers modifiés"
}

interface Category {
  slug: "corps" | "visage" | "maquillage" | "accessoires" | "bienetre";
  number: string;   // "01".."05"
  title: string;
  description: string;
  order: number;
}
```

- Un store global (Context + useReducer, ou Zustand si disponible) `ProductsProvider` expose : `products`, `categories`, `addProduct`, `updateProduct`, `deleteProduct`, `toggleStock`, `updateCategory`, `reorderCategories`
- Persistance : lecture/écriture automatique dans `localStorage` à chaque mutation, avec un seed initial (les mock data ci-dessous) chargé si localStorage est vide
- La boutique publique et l'admin consomment TOUS LES DEUX ce même store — toute modification faite dans l'admin doit se refléter immédiatement sur la page publique (même onglet ou après refresh)
- Fonction utilitaire `buildWhatsAppLink(productName?: string)` génère les URL wa.me avec le bon message encodé

## SEED DATA INITIAL (mock data de départ, à charger dans le store au premier lancement)

**01 — Corps** ("Lotions, gommages et rituels hydratation — les marques qu'on retrouve dans toutes les routines clean girl.")
1. Rituel Corps Import — "Duo Dove & Vaseline, gommage et brosse corporelle." — 7500
2. Trio Tree Hut Sugar Scrub — "Cotton Candy, Pink Champagne & Watermelon." — 9000
3. Collection Beurre de Cacao — "Dove, Nivea & Palmer's, routine cacao nourrissante." — 12000
4. Dove Nourishing Care + Gants — "Gel douche Dove + gants exfoliants." — 6000
5. EOS 24H Moisture Lotion — "Lotion corps parfumée, longue hydratation." — 4500
6. Olay Super Serum + Glow Duo — "Duo body wash & lotion illuminateurs." — 11000
7. Garnier Vitamine C Sorbet — "Booster d'éclat hydratant pour le corps." — 3500
8. Gamme Olay Tone Brightening — "Body wash, lotion, gommage & soin nuit." — 22000
9. Trio Erha1 Body Exfoliation — "Fraise, coco & framboise au collagène." — 10500
10. Tree Hut Watermelon Scrub — "Gommage sucré à la pastèque." — 5000
11. Honey Almond Sherbet Scrub — "Gommage sorbet miel & amande." — 6500

**02 — Visage** ("Sérums, masques et soins ciblés pour un teint lumineux.")
1. Laneige Lip Sleeping Mask — "Masque de nuit lèvres, parfum Berry." — 8500
2. Duo Laneige Lip Care — "Baume + sérum lèvres, jour et nuit." — 15000
3. Ruby Kiss Lip Oil — "Trio d'huiles lèvres, effet glossy." — 5000
4. Medix 5.5 Vitamine C + Curcuma — "Crème illuminatrice et raffermissante." — 13500
5. Garnier Vitamin C+ Booster — "Sérum éclat niacinamide & vitamine C." — 9500
6. L'Oréal Hydrogel Glow Mask — "Masque hydrogel effet peau de verre." — 4000
7. Skin1004 Centella Duo — "Mousse ampoule + huile démaquillante." — 13000

**03 — Maquillage** ("Quelques essentiels maquillage pour twister la routine du jour.")
1. NYX Buttermelt Blush — "Blush fondant, fini naturel & lumineux." — 6000

**04 — Accessoires** ("Les petits outils qui font la différence dans une routine bien-être.")
1. Éponges Exfoliantes — "Loofahs doux multicolores, effet exfoliant." — 2500
2. Brosse de Massage Sèche — "Fibres naturelles, pour le brossage à sec." — 4000
3. Gants Exfoliants Roses — "Paire de gants doux pour le gommage." — 2000

**05 — Bien-être & hygiène** ("Pour prendre soin de vous de l'intérieur comme de l'extérieur.")
1. Collagen30 — "Complément collagène, élasticité & fermeté." — 17500
2. TheraBreath Oral Rinse — "Fraîcheur intense, formulé par un dentiste." — 6500
3. Savon Dove Pampering — "Beurre de karité & vanille, 3-en-1." — 1500
4. Oral-B Vitality Pro — "Brosse électrique, tête ronde Protect X Clean." — 18000
5. Dr. Pen M8S Microneedle — "Stylo de micro-needling auto, kit complet." — 25000
6. Listerine Cool Mint 1.5L — "Bain de bouche antiseptique, grand format." — 7000
7. Marvis Whitening Mint — "Dentifrice blancheur, menthe italienne." — 8000
8. Gratte-langue Inox — "Racle-langue en acier, hygiène quotidienne." — 2000

Tous ces produits sont initialisés avec `inStock: true`.

## CONTRAINTES TECHNIQUES
- Composants boutique publique : Header, MobileMenu, Hero, TrustStrip, CategorySection, ProductCard, CTABand, Footer, WhatsAppFloatButton
- Composants admin : AdminLayout, Sidebar, LoginForm, ProtectedRoute, DashboardStats, ProductsTable, ProductForm, CategoriesList, Toast
- Aucun texte produit/catégorie en dur dans les composants — tout passe par le store partagé
- Images : prévoir des placeholders de la bonne couleur/ratio (carré) pour le seed data ; l'upload réel se fait via le formulaire admin (base64 en localStorage)
- Respecter fidèlement le rendu de référence taneem-store.html pour toute la partie boutique publique (déjà validé) : mêmes proportions, mêmes couleurs, même typographie, même rythme de formes par section, même animation hero. L'admin, lui, a un style volontairement différent (neutre, dense, orienté back-office) tout en réutilisant les mêmes couleurs de marque en accent.