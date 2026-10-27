import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Product } from '../data/types';
import { formatPrice } from '../utils/format';

export interface CartItem {
  id?: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedImage?: string;
}

interface CartContextValue {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedImage?: string) => void;
  removeFromCart: (cartItemIdOrProductId: string) => void;
  updateQuantity: (cartItemIdOrProductId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalPriceFormatted: string;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  buildCartWhatsAppLink: () => string;
}

const CartContext = createContext<CartContextValue | null>(null);

const LS_KEY = 'taneem_store_cart_v1';
const WHATSAPP_PHONE = '221781734994';

function getItemKey(item: { product: { id: string }; selectedColor?: string; id?: string }): string {
  if (item.id) return item.id;
  return `${item.product.id}__${item.selectedColor || ''}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => item && item.product && typeof item.product === 'object' && item.product.id);
        }
      }
    } catch {}
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(cart));
    } catch (err) {
      console.warn('Could not save cart to localStorage:', err);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1, selectedColor?: string, selectedImage?: string) => {
    if (!product || !product.inStock) return;
    const key = `${product.id}__${selectedColor || ''}`;
    setCart(prev => {
      const validPrev = Array.isArray(prev) ? prev.filter(i => i && i.product) : [];
      const existingIndex = validPrev.findIndex(item => getItemKey(item) === key);
      if (existingIndex > -1) {
        const updated = [...validPrev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 0) + quantity,
        };
        return updated;
      }
      return [
        ...validPrev,
        {
          id: key,
          product,
          quantity,
          selectedColor,
          selectedImage: selectedImage || product.image,
        },
      ];
    });
  };

  const removeFromCart = (cartKeyOrProductId: string) => {
    setCart(prev =>
      (Array.isArray(prev) ? prev : []).filter(item => {
        if (!item || !item.product) return false;
        const key = getItemKey(item);
        return key !== cartKeyOrProductId && item.product.id !== cartKeyOrProductId;
      })
    );
  };

  const updateQuantity = (cartKeyOrProductId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartKeyOrProductId);
      return;
    }
    setCart(prev =>
      (Array.isArray(prev) ? prev : [])
        .map(item => {
          if (!item || !item.product) return item;
          const key = getItemKey(item);
          if (key === cartKeyOrProductId || item.product.id === cartKeyOrProductId) {
            return { ...item, quantity };
          }
          return item;
        })
        .filter(item => item && item.product)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const totalItems = useMemo(
    () => (Array.isArray(cart) ? cart : []).reduce((acc, item) => acc + (item?.quantity || 0), 0),
    [cart]
  );

  const totalPrice = useMemo(
    () =>
      (Array.isArray(cart) ? cart : []).reduce((acc, item) => {
        if (!item || !item.product) return acc;
        const priceNum = typeof item.product.price === 'number' && !isNaN(item.product.price)
          ? item.product.price
          : Number(item.product.price) || 0;
        return acc + priceNum * (item.quantity || 1);
      }, 0),
    [cart]
  );

  const totalPriceFormatted = useMemo(() => formatPrice(totalPrice), [totalPrice]);

  const buildCartWhatsAppLink = () => {
    if (cart.length === 0) {
      return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Bonjour Taneem'Store ✨,\n\nJe souhaite passer une commande.")}`;
    }

    let text = "Bonjour Taneem'Store ✨,\n\n";
    text += "Je souhaite valider ma commande avec les articles suivants :\n\n";
    cart.forEach((item, idx) => {
      const linePrice = formatPrice(item.product.price * item.quantity);
      text += `📦 *ARTICLE ${idx + 1} :*\n`;
      text += `• Produit : ${item.quantity > 1 ? item.quantity + 'x ' : ''}${item.product.name}\n`;
      if (item.selectedColor) {
        text += `• Couleur / Teinte : ${item.selectedColor}\n`;
      }
      text += `• Prix : ${linePrice}\n`;
      if (item.product.description) {
        text += `• Info : ${item.product.description}\n`;
      }
      const photoToUse = item.selectedImage || item.product.image;
      if (photoToUse && photoToUse.startsWith('http')) {
        text += `• Photo : ${photoToUse}\n`;
      }
      text += `\n`;
    });
    text += `📊 *TOTAL COMMANDE :* ${totalPriceFormatted}\n\n`;
    text += `Merci de me recontacter pour confirmer la commande et les modalités de livraison !`;

    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        totalPriceFormatted,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        toggleCart,
        buildCartWhatsAppLink,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
