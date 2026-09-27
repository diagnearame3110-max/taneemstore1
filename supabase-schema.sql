-- ================================================
-- TANEEM'STORE SUPABASE DATABASE SCHEMA
-- ================================================

-- 1. Create CATEGORIES Table
CREATE TABLE IF NOT EXISTS categories (
  slug TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "order" INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create PRODUCTS Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT NOT NULL,
  category_slug TEXT REFERENCES categories(slug) ON DELETE CASCADE,
  in_stock BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create ORDERS Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  items JSONB NOT NULL,
  total_price NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'En attente',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access for Products & Categories
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Orders" ON orders FOR SELECT USING (true);

-- Allow Public Write for Demo / Admin Management (Or configure Supabase Auth for restricted write)
CREATE POLICY "Public Write Categories" ON categories FOR ALL USING (true);
CREATE POLICY "Public Write Products" ON products FOR ALL USING (true);
CREATE POLICY "Public Update Orders" ON orders FOR UPDATE USING (true);

-- ================================================
-- INITIAL SEED DATA FOR CATEGORIES
-- ================================================
INSERT INTO categories (slug, number, title, description, "order") VALUES
  ('corps', '01', 'Soins du Corps', 'Nourrissez, sublimez et enveloppez votre peau de douceur au quotidien.', 1),
  ('visage', '02', 'Soins du Visage', 'Sérums, nettoyants et crèmes pour un teint radieux et éclatant.', 2),
  ('maquillage', '03', 'Maquillage & Eclat', 'Sublimez votre beauté naturelle avec nos essentiels teint et lèvres.', 3),
  ('accessoires', '04', 'Accessoires & Rituals', 'Pinceaux, outils de massage et accessoires pour perfectionner votre routine.', 4),
  ('bienetre', '05', 'Bien-être & Wellness', 'Brumes d ambiance, bougies et soins relaxants pour l esprit.', 5)
ON CONFLICT (slug) DO NOTHING;
