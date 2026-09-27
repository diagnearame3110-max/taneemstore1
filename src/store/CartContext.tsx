import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Product } from '../data/types';
import { formatPrice } from '../utils/format';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    if (!product.inStock) return;
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const totalItems = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const totalPrice = useMemo(
    () => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
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
      text += `• Prix : ${linePrice}\n`;
      if (item.product.description) {
        text += `• Info : ${item.product.description}\n`;
      }
      if (item.product.image && item.product.image.startsWith('http')) {
        text += `• Photo : ${item.product.image}\n`;
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
