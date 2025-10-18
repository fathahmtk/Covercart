import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';

const PRODUCTS_STORAGE_KEY = 'covercart-products';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Helper to get products from localStorage safely
const loadProductsFromStorage = (): Product[] => {
  try {
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (storedProducts) {
      return JSON.parse(storedProducts);
    }
    // If nothing is stored, seed with mock data and save it
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(MOCK_PRODUCTS));
    return MOCK_PRODUCTS;
  } catch (error) {
    console.error("Failed to access products from localStorage", error);
    return MOCK_PRODUCTS; // Fallback to mock data
  }
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(loadProductsFromStorage);

  const addProduct = (product: Product) => {
    // Add new product to the beginning of the list for visibility
    const newProducts = [product, ...products];
    setProducts(newProducts);
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(newProducts));
    } catch (error) {
      console.error("Failed to save new product to localStorage", error);
    }
  };

  const value = {
    products,
    addProduct,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};