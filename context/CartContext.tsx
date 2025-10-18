import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Product, CartItem, ProductVariant } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, variant?: ProductVariant, quantity = 1) => {
    const cartItemId = variant ? `${product.id}-${variant.id}` : `${product.id}-0`;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.cartItemId === cartItemId);

      if (existingItem) {
        return prevItems.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      const newItem: CartItem = {
        cartItemId,
        productId: product.id,
        productName: product.name,
        variantId: variant?.id,
        variantName: variant?.name,
        price: product.price,
        imageUrl: variant ? variant.imageUrl : product.imageUrl,
        quantity,
      };
      return [...prevItems, newItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    setCartItems(prevItems => {
      if (quantity <= 0) {
        return prevItems.filter(item => item.cartItemId !== cartItemId);
      }
      return prevItems.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      );
    });
  };
  
  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};