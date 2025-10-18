import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { UserGalleryItem } from '../types';

const GALLERY_STORAGE_KEY = 'covercart-user-gallery';

interface UserGalleryContextType {
  galleryItems: Record<string, UserGalleryItem[]>;
  addImage: (productId: number, imageData: { imageUrl: string; caption?: string }) => void;
  getImagesForProduct: (productId: number) => UserGalleryItem[];
}

const UserGalleryContext = createContext<UserGalleryContextType | undefined>(undefined);

const loadImagesFromStorage = (): Record<string, UserGalleryItem[]> => {
  try {
    const storedImages = localStorage.getItem(GALLERY_STORAGE_KEY);
    return storedImages ? JSON.parse(storedImages) : {};
  } catch (error) {
    console.error("Failed to parse user gallery images from localStorage", error);
    return {};
  }
};

export const UserGalleryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [galleryItems, setGalleryItems] = useState<Record<string, UserGalleryItem[]>>(loadImagesFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(galleryItems));
    } catch (error) {
      console.error("Failed to save user gallery images to localStorage", error);
    }
  }, [galleryItems]);

  const addImage = (productId: number, imageData: { imageUrl: string; caption?: string }) => {
    const newItem: UserGalleryItem = {
      ...imageData,
      id: new Date().toISOString() + Math.random(),
      productId,
      date: new Date().toISOString(),
    };

    setGalleryItems(prevItems => {
      const productImages = prevItems[productId] ? [...prevItems[productId]] : [];
      productImages.unshift(newItem); // Add new image to the top
      return {
        ...prevItems,
        [productId]: productImages,
      };
    });
  };

  const getImagesForProduct = useCallback((productId: number): UserGalleryItem[] => {
    return galleryItems[productId] || [];
  }, [galleryItems]);

  const value = {
    galleryItems,
    addImage,
    getImagesForProduct,
  };

  return <UserGalleryContext.Provider value={value}>{children}</UserGalleryContext.Provider>;
};

export const useUserGallery = () => {
  const context = useContext(UserGalleryContext);
  if (context === undefined) {
    throw new Error('useUserGallery must be used within a UserGalleryProvider');
  }
  return context;
};
