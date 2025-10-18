import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback, useEffect } from 'react';
import { Product } from '../types';
import { useToast } from '../components/ToastProvider';

const WISHLIST_STORAGE_KEY = 'covercove-wishlist';

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isItemInWishlist: (productId: number) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const loadWishlistFromStorage = (): Product[] => {
    try {
        const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
        return storedWishlist ? JSON.parse(storedWishlist) : [];
    } catch (error) {
        console.error("Failed to parse wishlist from localStorage", error);
        return [];
    }
};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>(loadWishlistFromStorage);
  const { showToast } = useToast();
  
  useEffect(() => {
    try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch (error) {
        console.error("Failed to save wishlist to localStorage", error);
    }
  }, [wishlistItems]);

  const isItemInWishlist = useCallback((productId: number) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  const addToWishlist = (product: Product) => {
    setWishlistItems(prevItems => {
      if (!isItemInWishlist(product.id)) {
        showToast(`${product.name} added to wishlist!`, 'success');
        return [...prevItems, product];
      }
      return prevItems;
    });
  };

  const removeFromWishlist = (productId: number) => {
    const item = wishlistItems.find(item => item.id === productId);
    if(item) {
        showToast(`${item.name} removed from wishlist.`, 'info');
    }
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const wishlistCount = useMemo(() => {
    return wishlistItems.length;
  }, [wishlistItems]);

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isItemInWishlist,
    wishlistCount,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};