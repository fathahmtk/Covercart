

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { UserGalleryItem } from '../types';

const GALLERY_STORAGE_KEY = 'covercove-user-gallery';

const DEFAULT_USER_GALLERY_ITEMS: Record<string, UserGalleryItem[]> = {
  '1': [
    { id: 'ug5', productId: 1, imageUrl: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=800&auto=format&fit=crop', caption: 'Lost in the stars ✨', date: new Date(Date.now() - 86400000 * 3).toISOString() },
  ],
  '2': [
    { id: 'ug1', productId: 2, imageUrl: 'https://images.unsplash.com/photo-1618036730113-a26a27ab89b8?q=80&w=800&auto=format&fit=crop', caption: 'Matches my desk setup perfectly!', date: new Date(Date.now() - 86400000 * 2).toISOString() },
  ],
  '3': [
    { id: 'ug6', productId: 3, imageUrl: 'https://images.unsplash.com/photo-1581333100576-b73befdc71de?q=80&w=800&auto=format&fit=crop', caption: 'Retro vibes are the best.', date: new Date(Date.now() - 86400000 * 4).toISOString() },
  ],
  '4': [
    { id: 'ug7', productId: 4, imageUrl: 'https://images.unsplash.com/photo-1507294334573-4c6337583c8a?q=80&w=800&auto=format&fit=crop', caption: 'Brings nature inside!', date: new Date(Date.now() - 86400000 * 6).toISOString() },
  ],
  '5': [
    { id: 'ug8', productId: 5, imageUrl: 'https://images.unsplash.com/photo-1629196233219-cfa186a8779b?q=80&w=800&auto=format&fit=crop', caption: 'So modern and cool.', date: new Date(Date.now() - 86400000 * 8).toISOString() },
  ],
  '6': [
    { id: 'ug9', productId: 6, imageUrl: 'https://images.unsplash.com/photo-1611144186423-559e35985d88?q=80&w=800&auto=format&fit=crop', caption: 'Sleek design.', date: new Date(Date.now() - 86400000 * 1).toISOString() },
  ],
  '7': [
    { id: 'ug2', productId: 7, imageUrl: 'https://images.unsplash.com/photo-1542359649-31e03cdde435?q=80&w=800&auto=format&fit=crop', caption: 'Great for beach days 🌊', date: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: 'ug3', productId: 7, imageUrl: 'https://images.unsplash.com/photo-1549476464-3739221151a3?q=80&w=800&auto=format&fit=crop', caption: '', date: new Date(Date.now() - 86400000 * 10).toISOString() },
  ],
  '8': [
    { id: 'ug4', productId: 8, imageUrl: 'https://images.unsplash.com/photo-1555864324-345389664d04?q=80&w=800&auto=format&fit=crop', caption: 'Vibes for my gaming setup!', date: new Date(Date.now() - 86400000 * 1).toISOString() }
  ],
  '9': [
    { id: 'ug10', productId: 9, imageUrl: 'https://images.unsplash.com/photo-1579167728795-e1299e1d51e6?q=80&w=800&auto=format&fit=crop', caption: 'So dreamy!', date: new Date(Date.now() - 86400000 * 7).toISOString() },
  ],
  '10': [
    { id: 'ug11', productId: 10, imageUrl: 'https://images.unsplash.com/photo-1579401929312-43e7161b5d1e?q=80&w=800&auto=format&fit=crop', caption: 'Fierce!', date: new Date(Date.now() - 86400000 * 9).toISOString() },
  ],
  '11': [
    { id: 'ug12', productId: 11, imageUrl: 'https://images.unsplash.com/photo-1542228263-7d5032a321d2?q=80&w=800&auto=format&fit=crop', caption: 'Adventure awaits.', date: new Date(Date.now() - 86400000 * 11).toISOString() },
  ],
  '12': [
    { id: 'ug13', productId: 12, imageUrl: 'https://images.unsplash.com/photo-1594200388274-2798f6d33895?q=80&w=800&auto=format&fit=crop', caption: 'Perfectly minimal.', date: new Date(Date.now() - 86400000 * 12).toISOString() },
  ],
};

interface UserGalleryContextType {
  galleryItems: Record<string, UserGalleryItem[]>;
  addImage: (productId: number, imageData: { imageUrl: string; caption?: string }) => void;
  getImagesForProduct: (productId: number) => UserGalleryItem[];
}

const UserGalleryContext = createContext<UserGalleryContextType | undefined>(undefined);

const loadImagesFromStorage = (): Record<string, UserGalleryItem[]> => {
  try {
    const storedImages = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (storedImages) {
        return JSON.parse(storedImages);
    }
    // Seed with default images if nothing is stored
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(DEFAULT_USER_GALLERY_ITEMS));
    return DEFAULT_USER_GALLERY_ITEMS;
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