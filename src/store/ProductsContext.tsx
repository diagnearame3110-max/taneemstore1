import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import type { Product, Category, CategorySlug } from '../data/types';
import { SEED_PRODUCTS, SEED_CATEGORIES } from '../data/seedData';
import { formatPrice, generateId, normalizeCategorySlug, formatCategoryTitle } from '../utils/format';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface State {
  products: Product[];
  categories: Category[];
}

type Action =
  | { type: 'SET_STATE'; payload: State }
  | { type: 'MERGE_SUPABASE_DATA'; payload: { categories: Category[]; products: Product[] } }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: { id: string; data: Partial<Omit<Product, 'id'>> } }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'DELETE_PRODUCTS'; payload: string[] }
  | { type: 'TOGGLE_STOCK'; payload: string }
  | { type: 'UPDATE_CATEGORY'; payload: { slug: CategorySlug; data: Partial<Category> } }
  | { type: 'REORDER_CATEGORIES'; payload: CategorySlug[] };

interface ProductsContextValue extends State {
  isSupabaseActive: boolean;
  isLoading: boolean;
  addProduct: (data: Omit<Product, 'id' | 'priceFormatted' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, data: Partial<Omit<Product, 'id'>>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  deleteProducts: (ids: string[]) => Promise<void>;
  toggleStock: (id: string) => Promise<void>;
  updateCategory: (slug: CategorySlug, data: Partial<Category>) => Promise<void>;
  reorderCategories: (slugs: CategorySlug[]) => Promise<void>;
  syncSeedToSupabase: () => Promise<void>;
}

const LS_KEY = 'taneem_store_data_v5';

function cleanText(str?: unknown): string {
  if (typeof str !== 'string' || !str) return '';
  return str.replace(/&amp;/g, '&');
}

export function extractProductMetadata(rawDesc?: unknown): { cleanDescription: string; gallery: string[]; colors: any[] } {
  if (typeof rawDesc !== 'string' || !rawDesc) return { cleanDescription: '', gallery: [], colors: [] };
  const metaMatch = rawDesc.match(/<!--taneem_meta:([\s\S]*?)-->/);
  if (!metaMatch) {
    return { cleanDescription: rawDesc.trim(), gallery: [], colors: [] };
  }
  const cleanDescription = rawDesc.replace(/<!--taneem_meta:[\s\S]*?-->/, '').trim();
  try {
    const parsed = JSON.parse(metaMatch[1]);
    return {
      cleanDescription,
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : [],
      colors: Array.isArray(parsed.colors) ? parsed.colors : [],
    };
  } catch (e) {
    return { cleanDescription, gallery: [], colors: [] };
  }
}

export function buildProductDescriptionWithMeta(cleanDesc: string, gallery?: string[], colors?: any[]): string {
  const clean = (cleanDesc || '').replace(/<!--taneem_meta:[\s\S]*?-->/, '').trim();
  const hasMeta = (Array.isArray(gallery) && gallery.length > 0) || (Array.isArray(colors) && colors.length > 0);
  if (!hasMeta) return clean;
  const meta = {
    gallery: gallery || [],
    colors: colors || [],
  };
  return `${clean} <!--taneem_meta:${JSON.stringify(meta)}-->`;
}

function mapProductFromDb(p: any): Product {
  const rawSlug = p.category_slug || p.categorySlug;
  const categorySlug: CategorySlug = normalizeCategorySlug(rawSlug);
  const priceNum = typeof p.price === 'number' && !isNaN(p.price) ? p.price : (Number(p.price) || 0);
  const { cleanDescription, gallery, colors } = extractProductMetadata(p.description);
  const productGallery = Array.isArray(p.gallery) ? p.gallery : gallery;
  const productColors = Array.isArray(p.colors) ? p.colors : colors;

  return {
    id: String(p.id || generateId()),
    name: cleanText(p.name) || 'Produit sans nom',
    description: cleanDescription,
    gallery: productGallery,
    colors: productColors,
    price: priceNum,
    priceFormatted: formatPrice(priceNum),
    image: p.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&auto=format',
    categorySlug,
    inStock: p.in_stock ?? p.inStock ?? true,
    updatedAt: p.updated_at || p.updatedAt || new Date().toISOString(),
  };
}


function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_STATE':
      return {
        products: Array.isArray(action.payload.products) && action.payload.products.length > 0
          ? action.payload.products
          : state.products,
        categories: Array.isArray(action.payload.categories) && action.payload.categories.length > 0
          ? action.payload.categories
          : state.categories,
      };
    case 'MERGE_SUPABASE_DATA': {
      const catMap = new Map<string, Category>();
      (action.payload.categories || []).forEach(c => catMap.set(c.slug, c));
      state.categories.forEach(c => {
        if (!catMap.has(c.slug)) catMap.set(c.slug, c);
      });
      const categories = Array.from(catMap.values()).sort((a, b) => (a.order || 0) - (b.order || 0));

      // Supabase is the source of truth for remote data:
      // Products returned from Supabase form the authoritative catalog.
      // We do NOT resurrect products from state.products that were deleted from Supabase.
      const products = (action.payload.products || [])
        .filter(p => p && p.id && !p.id.startsWith('prod_'))
        .sort((a, b) => {
          const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return timeB - timeA;
        });

      return { categories, products };
    }
    case 'ADD_PRODUCT': {
      const exists = state.products.some(p => p.id === action.payload.id);
      const updatedProducts = exists
        ? state.products.map(p => (p.id === action.payload.id ? action.payload : p))
        : [action.payload, ...state.products];
      return { ...state, products: updatedProducts };
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
    case 'DELETE_PRODUCTS': {
      const delSet = new Set(action.payload);
      return { ...state, products: state.products.filter(p => !delSet.has(p.id)) };
    }
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
        if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
          const hasLegacy = parsed.products.some(p => p && p.id && p.id.startsWith('prod_'));
          if (hasLegacy) {
            localStorage.removeItem(LS_KEY);
          } else {
            const rawCategories = Array.isArray(parsed.categories) && parsed.categories.length > 0
              ? parsed.categories
              : SEED_CATEGORIES;

            const catMap = new Map<string, Category>();
            SEED_CATEGORIES.forEach(c => catMap.set(c.slug, c));
            rawCategories.forEach(c => {
              if (c && c.slug) {
                const normSlug = normalizeCategorySlug(c.slug);
                if (catMap.has(normSlug)) {
                  const defaultCat = catMap.get(normSlug)!;
                  catMap.set(normSlug, {
                    ...defaultCat,
                    title: formatCategoryTitle(c.title, normSlug),
                    description: cleanText(c.description) || defaultCat.description,
                  });
                }
              }
            });
            const categories = Array.from(catMap.values())
              .sort((a, b) => (a.order || 0) - (b.order || 0));

            return {
              products: parsed.products
                .filter(p => p && !p.id.startsWith('prod_'))
                .map(p => {
                  const { cleanDescription, gallery, colors } = extractProductMetadata(p.description);
                  return {
                    ...p,
                    name: cleanText(p.name) || 'Produit',
                    description: cleanDescription || cleanText(p.description),
                    gallery: Array.isArray(p.gallery) ? p.gallery : gallery,
                    colors: Array.isArray(p.colors) ? p.colors : colors,
                    price: typeof p.price === 'number' && !isNaN(p.price) ? p.price : Number(p.price) || 0,
                    priceFormatted: formatPrice(p.price),
                    categorySlug: normalizeCategorySlug(p.categorySlug || (p as any).category_slug)
                  };
                }),
              categories: categories.map(c => ({
                ...c,
                title: formatCategoryTitle(c.title, c.slug),
                description: cleanText(c.description)
              }))
            };
          }
        }
      }
    } catch (err) {
      console.warn('LocalStorage load error, using seeds fallback:', err);
      try { localStorage.removeItem(LS_KEY); } catch { }
    }
    return {
      products: SEED_PRODUCTS.map(p => ({
        ...p,
        name: cleanText(p.name),
        description: cleanText(p.description),
        priceFormatted: formatPrice(p.price),
        categorySlug: normalizeCategorySlug(p.categorySlug)
      })),
      categories: SEED_CATEGORIES.map(c => ({
        ...c,
        title: formatCategoryTitle(c.title, c.slug),
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
        const [catRes, prodRes] = await Promise.all([
          supabase.from('categories').select('*').order('order', { ascending: true }),
          supabase.from('products').select('*').order('created_at', { ascending: false }),
        ]);

        const dbCategories = catRes.data;
        const dbProducts = prodRes.data;

        // Build categories seeded with default 5 categories
        const catMap = new Map<string, Category>();
        SEED_CATEGORIES.forEach(c => catMap.set(c.slug, c));

        if (dbCategories && dbCategories.length > 0) {
          dbCategories.forEach(c => {
            if (c && c.slug) {
              const normSlug = normalizeCategorySlug(c.slug);
              if (catMap.has(normSlug)) {
                const defaultCat = catMap.get(normSlug)!;
                catMap.set(normSlug, {
                  ...defaultCat,
                  title: formatCategoryTitle(c.title, normSlug),
                  description: cleanText(c.description) || defaultCat.description,
                  order: Number(c.order) || defaultCat.order,
                });
              }
            }
          });
        }

        const categoriesToUse = Array.from(catMap.values())
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        // Build authoritative products list strictly from Supabase
        const dbMapped: Product[] = (dbProducts || [])
          .filter(p => p && p.id && !String(p.id).startsWith('prod_'))
          .map(mapProductFromDb);

        // DISPATCH IMMEDIATELY - Do not block UI rendering!
        dispatch({
          type: 'MERGE_SUPABASE_DATA',
          payload: {
            categories: categoriesToUse,
            products: dbMapped,
          },
        });

        // Immediately update localStorage so a deleted product never revives on refresh
        try {
          localStorage.setItem(LS_KEY, JSON.stringify({
            categories: categoriesToUse,
            products: dbMapped,
          }));
        } catch (e) {
          console.warn('LocalStorage immediate sync warning:', e);
        }

        // Background non-blocking maintenance for categories & legacy data
        (async () => {
          try {
            const categoriesPayload = categoriesToUse.map((c, i) => ({
              slug: c.slug,
              number: String(i + 1).padStart(2, '0'),
              title: c.title,
              description: c.description,
              order: i + 1,
            }));
            await supabase.from('categories').upsert(categoriesPayload, { onConflict: 'slug' });

            const validSlugs = new Set(['skincare', 'corps', 'dentaire', 'levres', 'bienetre']);
            if (dbCategories && dbCategories.length > 0) {
              for (const cat of dbCategories) {
                if (cat && cat.slug && !validSlugs.has(cat.slug)) {
                  await supabase.from('categories').delete().eq('slug', cat.slug);
                }
              }
            }

            if (dbProducts && dbProducts.length > 0) {
              for (const prod of dbProducts) {
                if (prod && prod.id && String(prod.id).startsWith('prod_')) {
                  await supabase.from('products').delete().eq('id', prod.id);
                }
              }
            }
          } catch (e) {
            console.warn('Background cleanup warning:', e);
          }
        })();
      } catch (err) {
        console.warn('Supabase fetch warning, using local state fallback:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadFromSupabase();
  }, []);

  // Supabase Realtime synchronization for instant database deletions & updates
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const channel = supabase
      .channel('products-realtime-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            const deletedId = payload.old?.id;
            if (deletedId) {
              const strId = String(deletedId);
              dispatch({ type: 'DELETE_PRODUCT', payload: strId });
              try {
                const saved = localStorage.getItem(LS_KEY);
                if (saved) {
                  const parsed = JSON.parse(saved);
                  if (parsed && Array.isArray(parsed.products)) {
                    parsed.products = parsed.products.filter((p: any) => p && p.id !== strId);
                    localStorage.setItem(LS_KEY, JSON.stringify(parsed));
                  }
                }
              } catch {}
            }
          } else if (payload.eventType === 'INSERT') {
            const p = payload.new as any;
            if (p && p.id && !String(p.id).startsWith('prod_')) {
              const mapped = mapProductFromDb(p);
              dispatch({ type: 'ADD_PRODUCT', payload: mapped });
            }
          } else if (payload.eventType === 'UPDATE') {
            const p = payload.new as any;
            if (p && p.id) {
              const mapped = mapProductFromDb(p);
              dispatch({ type: 'UPDATE_PRODUCT', payload: { id: String(p.id), data: mapped } });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Save to local storage backup
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('LocalStorage backup quota exceeded:', err);
    }
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
    const normalizedSlug = normalizeCategorySlug(data.categorySlug);
    const { cleanDescription, gallery, colors } = extractProductMetadata(data.description);
    const finalGallery = Array.isArray(data.gallery) && data.gallery.length > 0 ? data.gallery : gallery;
    const finalColors = Array.isArray(data.colors) && data.colors.length > 0 ? data.colors : colors;
    const packedDescription = buildProductDescriptionWithMeta(data.description || cleanDescription, finalGallery, finalColors);

    const product: Product = {
      ...data,
      id,
      description: cleanDescription || data.description || '',
      gallery: finalGallery,
      colors: finalColors,
      categorySlug: normalizedSlug,
      priceFormatted: formatPrice(data.price),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_PRODUCT', payload: product });

    if (supabase) {
      try {
        const { error } = await supabase.from('products').insert({
          id,
          name: data.name,
          description: packedDescription,
          price: data.price,
          image: data.image,
          category_slug: normalizedSlug,
          in_stock: data.inStock,
        });

        if (error) {
          console.warn('Supabase insert warning:', error.message || error);
        }
      } catch (err) {
        console.warn('Supabase insert exception:', err);
      }
    }
  };

  const updateProduct = async (id: string, data: Partial<Omit<Product, 'id'>>) => {
    const existing = state.products.find(p => p.id === id);
    const updatedData = { ...data };
    if (updatedData.categorySlug) {
      updatedData.categorySlug = normalizeCategorySlug(updatedData.categorySlug);
    }

    const cleanDesc = updatedData.description !== undefined
      ? extractProductMetadata(updatedData.description).cleanDescription
      : (existing?.description || '');
    const currentGallery = updatedData.gallery !== undefined
      ? (updatedData.gallery || [])
      : (existing?.gallery || []);
    const currentColors = updatedData.colors !== undefined
      ? (updatedData.colors || [])
      : (existing?.colors || []);

    const packedDescription = buildProductDescriptionWithMeta(cleanDesc, currentGallery, currentColors);

    const productPayload = {
      ...updatedData,
      description: cleanDesc,
      gallery: currentGallery,
      colors: currentColors,
    };

    dispatch({ type: 'UPDATE_PRODUCT', payload: { id, data: productPayload } });

    if (supabase) {
      try {
        const dbPayload: Record<string, any> = {};
        if (updatedData.name !== undefined) dbPayload.name = updatedData.name;
        dbPayload.description = packedDescription;
        if (updatedData.price !== undefined) dbPayload.price = updatedData.price;
        if (updatedData.image !== undefined) dbPayload.image = updatedData.image;
        if (updatedData.categorySlug !== undefined) dbPayload.category_slug = updatedData.categorySlug;
        if (updatedData.inStock !== undefined) dbPayload.in_stock = updatedData.inStock;
        dbPayload.updated_at = new Date().toISOString();

        const { error } = await supabase.from('products').update(dbPayload).eq('id', id);
        if (error) {
          console.warn('Supabase update warning:', error.message || error);
        }
      } catch (err) {
        console.warn('Supabase update exception:', err);
      }
    }
  };

  const deleteProduct = async (id: string) => {
    // 1. Delete from Supabase FIRST and await database confirmation
    if (supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
          console.error('Supabase delete error:', error);
          throw new Error(error.message || 'Impossible de supprimer le produit dans la base de données');
        }
      } catch (err) {
        console.error('Supabase delete exception:', err);
        throw err;
      }
    }

    // 2. Once Supabase confirmed deletion, update React state
    dispatch({ type: 'DELETE_PRODUCT', payload: id });

    // 3. Proactively clean localStorage so it never lingers
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.products)) {
          parsed.products = parsed.products.filter((p: Product) => p && p.id !== id);
          localStorage.setItem(LS_KEY, JSON.stringify(parsed));
        }
      }
    } catch (e) {
      console.warn('LocalStorage delete cleanup error:', e);
    }
  };

  const deleteProducts = async (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    const idSet = new Set(ids);

    // 1. Delete from Supabase FIRST and await database confirmation
    if (supabase) {
      try {
        const { error } = await supabase.from('products').delete().in('id', ids);
        if (error) {
          console.error('Supabase batch delete error:', error);
          throw new Error(error.message || 'Impossible de supprimer les produits sélectionnés dans la base de données');
        }
      } catch (err) {
        console.error('Supabase batch delete exception:', err);
        throw err;
      }
    }

    // 2. Once Supabase confirmed batch deletion, update React state
    dispatch({ type: 'DELETE_PRODUCTS', payload: ids });

    // 3. Proactively clean localStorage
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.products)) {
          parsed.products = parsed.products.filter((p: Product) => p && !idSet.has(p.id));
          localStorage.setItem(LS_KEY, JSON.stringify(parsed));
        }
      }
    } catch (e) {
      console.warn('LocalStorage bulk delete cleanup error:', e);
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
    deleteProducts,
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
