import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { Product, CartItem, ProductVariant } from '../types';
import { useProducts } from './ProductContext';
import { useToast } from '../components/ToastProvider';

const CART_STORAGE_KEY = 'covercove-cart';

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

const loadCartFromStorage = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Failed to parse cart from localStorage", error);
    return [];
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCartFromStorage);
  const { products } = useProducts();
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cartItems]);

  const getStockForProduct = (productId: number, variantId?: number): number => {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;

    if (variantId && product.variants) {
        const variant = product.variants.find(v => v.id === variantId);
        return variant ? variant.stock : 0;
    }
    return product.stock ?? 0;
  };

  const addToCart = (product: Product, variant?: ProductVariant, quantity = 1) => {
    const cartItemId = variant ? `${product.id}-${variant.id}` : `${product.id}-0`;
    const availableStock = getStockForProduct(product.id, variant?.id);
    let itemAdded = false;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.cartItemId === cartItemId);
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

      if (availableStock === 0) {
        showToast('Sorry, this item is out of stock.', 'error');
        return prevItems;
      }
      
      if (currentQuantityInCart + quantity > availableStock) {
        showToast(`Only ${availableStock} left in stock.`, 'error');
        return prevItems;
      }

      itemAdded = true;

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

    if (itemAdded) {
      showToast(`${product.name} added to cart!`, 'success');
    }
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    setCartItems(prevItems => {
      const itemToUpdate = prevItems.find(item => item.cartItemId === cartItemId);
      if (!itemToUpdate) return prevItems;
      
      const availableStock = getStockForProduct(itemToUpdate.productId, itemToUpdate.variantId);

      if (quantity <= 0) {
        return prevItems.filter(item => item.cartItemId !== cartItemId);
      }
      
      if (quantity > availableStock) {
        showToast(`Only ${availableStock} items in stock.`, 'error');
        return prevItems.map(item =>
            item.cartItemId === cartItemId ? { ...item, quantity: availableStock } : item
        );
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