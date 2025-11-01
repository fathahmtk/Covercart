
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { DEFAULT_CATEGORIES } from '../constants';

const CATEGORIES_STORAGE_KEY = 'covercove-categories';

interface CategoryContextType {
  categories: string[];
  addCategory: (categoryName: string) => boolean; // return false if exists
  updateCategory: (oldName: string, newName: string) => boolean;
  deleteCategory: (categoryName: string) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

const loadCategoriesFromStorage = (): string[] => {
  try {
    const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (storedCategories) {
      return JSON.parse(storedCategories);
    }
    const categoriesWithoutAll = DEFAULT_CATEGORIES.filter(c => c !== 'All');
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categoriesWithoutAll));
    return categoriesWithoutAll;
  } catch (error) {
    console.error("Failed to access categories from localStorage", error);
    return DEFAULT_CATEGORIES.filter(c => c !== 'All');
  }
};

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<string[]>(loadCategoriesFromStorage);

  useEffect(() => {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const addCategory = (categoryName: string): boolean => {
    if (categories.find(c => c.toLowerCase() === categoryName.toLowerCase())) {
      return false; // Already exists
    }
    setCategories(prev => [...prev, categoryName].sort());
    return true;
  };
  
  const updateCategory = (oldName: string, newName: string): boolean => {
    if (categories.find(c => c.toLowerCase() === newName.toLowerCase() && c.toLowerCase() !== oldName.toLowerCase())) {
        return false; // New name already exists
    }
    setCategories(prev => prev.map(c => c === oldName ? newName : c).sort());
    // Note: This does not update products that have the old category name.
    // That's a bigger task involving product updates. For now, this is fine for the admin panel UI.
    return true;
  };

  const deleteCategory = (categoryName: string) => {
    setCategories(prev => prev.filter(c => c !== categoryName));
    // Note: This does not handle products that are in this category.
  };
  
  const value = { categories, addCategory, updateCategory, deleteCategory };

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};
