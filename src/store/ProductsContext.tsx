import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Product, Category, CategorySlug } from '../data/types';
import { SEED_PRODUCTS, SEED_CATEGORIES } from '../data/seedData';
import { formatPrice, generateId } from '../utils/format';

interface State {
  products: Product[];
  categories: Category[];
}

type Action =
  | { type: 'SET_STATE'; payload: State }
  | { type: 'ADD_PRODUCT'; payload: Omit<Product, 'id' | 'priceFormatted' | 'updatedAt'> }
  | { type: 'UPDATE_PRODUCT'; payload: { id: string; data: Partial<Omit<Product, 'id'>> } }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'TOGGLE_STOCK'; payload: string }
  | { type: 'UPDATE_CATEGORY'; payload: { slug: CategorySlug; data: Partial<Category> } }
  | { type: 'REORDER_CATEGORIES'; payload: CategorySlug[] };

interface ProductsContextValue extends State {
  addProduct: (data: Omit<Product, 'id' | 'priceFormatted' | 'updatedAt'>) => void;
  updateProduct: (id: string, data: Partial<Omit<Product, 'id'>>) => void;
  deleteProduct: (id: string) => void;
  toggleStock: (id: string) => void;
  updateCategory: (slug: CategorySlug, data: Partial<Category>) => void;
  reorderCategories: (slugs: CategorySlug[]) => void;
}

const LS_KEY = 'taneem_store_data_v3';

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'ADD_PRODUCT': {
      const product: Product = {
        ...action.payload,
        id: generateId(),
        priceFormatted: formatPrice(action.payload.price),
        updatedAt: new Date().toISOString(),
      };
      return { ...state, products: [...state.products, product] };
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
        categories: action.payload.map((slug, i) => {
          const cat = state.categories.find(c => c.slug === slug)!;
          return { ...cat, order: i + 1 };
        }),
      };
    default:
      return state;
  }
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

function cleanText(str?: string): string {
  if (!str) return '';
  return str.replace(/&amp;/g, '&');
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, () => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as State;
        if (parsed.products && parsed.products.length === 30) {
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

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [state]);

  const value: ProductsContextValue = {
    ...state,
    addProduct: data => dispatch({ type: 'ADD_PRODUCT', payload: data }),
    updateProduct: (id, data) => dispatch({ type: 'UPDATE_PRODUCT', payload: { id, data } }),
    deleteProduct: id => dispatch({ type: 'DELETE_PRODUCT', payload: id }),
    toggleStock: id => dispatch({ type: 'TOGGLE_STOCK', payload: id }),
    updateCategory: (slug, data) => dispatch({ type: 'UPDATE_CATEGORY', payload: { slug, data } }),
    reorderCategories: slugs => dispatch({ type: 'REORDER_CATEGORIES', payload: slugs }),
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
