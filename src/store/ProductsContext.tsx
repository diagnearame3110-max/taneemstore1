import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import type { Product, Category, CategorySlug } from '../data/types';
import { SEED_PRODUCTS, SEED_CATEGORIES } from '../data/seedData';
import { formatPrice, generateId } from '../utils/format';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface State {
  products: Product[];
  categories: Category[];
}

type Action =
  | { type: 'SET_STATE'; payload: State }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: { id: string; data: Partial<Omit<Product, 'id'>> } }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'TOGGLE_STOCK'; payload: string }
  | { type: 'UPDATE_CATEGORY'; payload: { slug: CategorySlug; data: Partial<Category> } }
  | { type: 'REORDER_CATEGORIES'; payload: CategorySlug[] };

interface ProductsContextValue extends State {
  isSupabaseActive: boolean;
  isLoading: boolean;
  addProduct: (data: Omit<Product, 'id' | 'priceFormatted' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, data: Partial<Omit<Product, 'id'>>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleStock: (id: string) => Promise<void>;
  updateCategory: (slug: CategorySlug, data: Partial<Category>) => Promise<void>;
  reorderCategories: (slugs: CategorySlug[]) => Promise<void>;
  syncSeedToSupabase: () => Promise<void>;
}

const LS_KEY = 'taneem_store_data_v3';

function cleanText(str?: string): string {
  if (!str) return '';
  return str.replace(/&amp;/g, '&');
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'ADD_PRODUCT': {
      return { ...state, products: [...state.products, action.payload] };
    }
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id
            ? {
                ...p,
                ...action.payload.data,
                priceFormatted: formatPrice(action.payload.data.price ?? p.price),
                updatedAt: new Date().toISOString(),
              }
            : p
        ),
      };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload) };
    case 'TOGGLE_STOCK':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload ? { ...p, inStock: !p.inStock, updatedAt: new Date().toISOString() } : p
        ),
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c =>
          c.slug === action.payload.slug ? { ...c, ...action.payload.data } : c
        ),
      };
    case 'REORDER_CATEGORIES':
      return {
        ...state,
        categories: action.payload
          .map((slug, i) => {
            const cat = state.categories.find(c => c.slug === slug);
            return cat ? { ...cat, order: i + 1 } : null;
          })
          .filter(Boolean) as Category[],
      };
    default:
      return state;
  }
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [state, dispatch] = useReducer(reducer, null, () => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as State;
        if (parsed.products && parsed.products.length > 0) {
          return {
            products: parsed.products.map(p => ({
              ...p,
              name: cleanText(p.name),
              description: cleanText(p.description),
              priceFormatted: formatPrice(p.price)
            })),
            categories: (parsed.categories || SEED_CATEGORIES).map(c => ({
              ...c,
              title: cleanText(c.title),
              description: cleanText(c.description)
            }))
          };
        }
      }
    } catch {}
    return {
      products: SEED_PRODUCTS.map(p => ({
        ...p,
        name: cleanText(p.name),
        description: cleanText(p.description),
        priceFormatted: formatPrice(p.price)
      })),
      categories: SEED_CATEGORIES.map(c => ({
        ...c,
        title: cleanText(c.title),
        description: cleanText(c.description)
      }))
    };
  });

  // Supabase initial load
  useEffect(() => {
    async function loadFromSupabase() {
      if (!isSupabaseConfigured || !supabase) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: dbCategories, error: catErr } = await supabase
          .from('categories')
          .select('*')
          .order('order', { ascending: true });

        const { data: dbProducts, error: prodErr } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: true });

        if (!catErr && !prodErr && dbCategories && dbProducts) {
          if (dbCategories.length > 0 || dbProducts.length > 0) {
            const categories: Category[] = dbCategories.map(c => ({
              slug: (c.slug || 'corps') as CategorySlug,
              number: c.number || '01',
              title: cleanText(c.title) || 'Catégorie',
              description: cleanText(c.description) || '',
              order: Number(c.order) || 1,
            }));

            const VALID_SLUGS: CategorySlug[] = ['corps', 'visage', 'maquillage', 'accessoires', 'bienetre'];

            const products: Product[] = dbProducts.map(p => {
              const rawSlug = p.category_slug || p.categorySlug;
              const categorySlug: CategorySlug = (typeof rawSlug === 'string' && VALID_SLUGS.includes(rawSlug as CategorySlug))
                ? (rawSlug as CategorySlug)
                : 'corps';
              const priceNum = typeof p.price === 'number' && !isNaN(p.price) ? p.price : (Number(p.price) || 0);

              return {
                id: String(p.id || generateId()),
                name: cleanText(p.name) || 'Produit sans nom',
                description: cleanText(p.description) || '',
                price: priceNum,
                priceFormatted: formatPrice(priceNum),
                image: p.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&auto=format',
                categorySlug,
                inStock: p.in_stock ?? p.inStock ?? true,
                updatedAt: p.updated_at || p.updatedAt || new Date().toISOString(),
              };
            });

            dispatch({
              type: 'SET_STATE',
              payload: {
                categories: categories.length > 0 ? categories : state.categories,
                products: products.length > 0 ? products : state.products,
              },
            });
          }
        }
      } catch (err) {
        console.warn('Supabase fetch warning, using local state fallback:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadFromSupabase();
  }, []);

  // Save to local storage backup
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [state]);

  // Sync initial seed products to Supabase
  const syncSeedToSupabase = async () => {
    if (!supabase) return;
    try {
      // Upsert Categories
      const categoriesPayload = SEED_CATEGORIES.map(c => ({
        slug: c.slug,
        number: c.number,
        title: c.title,
        description: c.description,
        order: c.order,
      }));
      await supabase.from('categories').upsert(categoriesPayload, { onConflict: 'slug' });

      // Upsert Products
      const productsPayload = SEED_PRODUCTS.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        category_slug: p.categorySlug,
        in_stock: p.inStock,
        updated_at: new Date().toISOString(),
      }));
      await supabase.from('products').upsert(productsPayload, { onConflict: 'id' });
    } catch (err) {
      console.error('Error syncing seed to Supabase:', err);
    }
  };

  const addProduct = async (data: Omit<Product, 'id' | 'priceFormatted' | 'updatedAt'>) => {
    const id = generateId();
    const product: Product = {
      ...data,
      id,
      priceFormatted: formatPrice(data.price),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_PRODUCT', payload: product });

    if (supabase) {
      await supabase.from('products').insert({
        id,
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        category_slug: data.categorySlug,
        in_stock: data.inStock,
      });
    }
  };

  const updateProduct = async (id: string, data: Partial<Omit<Product, 'id'>>) => {
    dispatch({ type: 'UPDATE_PRODUCT', payload: { id, data } });

    if (supabase) {
      const dbPayload: Record<string, any> = {};
      if (data.name !== undefined) dbPayload.name = data.name;
      if (data.description !== undefined) dbPayload.description = data.description;
      if (data.price !== undefined) dbPayload.price = data.price;
      if (data.image !== undefined) dbPayload.image = data.image;
      if (data.categorySlug !== undefined) dbPayload.category_slug = data.categorySlug;
      if (data.inStock !== undefined) dbPayload.in_stock = data.inStock;
      dbPayload.updated_at = new Date().toISOString();

      await supabase.from('products').update(dbPayload).eq('id', id);
    }
  };

  const deleteProduct = async (id: string) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: id });
    if (supabase) {
      await supabase.from('products').delete().eq('id', id);
    }
  };

  const toggleStock = async (id: string) => {
    const item = state.products.find(p => p.id === id);
    if (!item) return;
    const newStock = !item.inStock;

    dispatch({ type: 'TOGGLE_STOCK', payload: id });
    if (supabase) {
      await supabase.from('products').update({ in_stock: newStock }).eq('id', id);
    }
  };

  const updateCategory = async (slug: CategorySlug, data: Partial<Category>) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: { slug, data } });
    if (supabase) {
      await supabase.from('categories').update(data).eq('slug', slug);
    }
  };

  const reorderCategories = async (slugs: CategorySlug[]) => {
    dispatch({ type: 'REORDER_CATEGORIES', payload: slugs });
    if (supabase) {
      for (let i = 0; i < slugs.length; i++) {
        await supabase.from('categories').update({ order: i + 1 }).eq('slug', slugs[i]);
      }
    }
  };

  const value: ProductsContextValue = {
    ...state,
    isSupabaseActive: isSupabaseConfigured,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStock,
    updateCategory,
    reorderCategories,
    syncSeedToSupabase,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
