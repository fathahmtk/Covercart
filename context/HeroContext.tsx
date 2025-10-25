
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

const HERO_IMAGES_STORAGE_KEY = 'covercove-hero-images';

export interface HeroImage {
  id: string;
  url: string;
  alt: string;
}

interface HeroContextType {
  heroImages: HeroImage[];
  setHeroImages: (images: HeroImage[]) => void;
  addImage: (image: Omit<HeroImage, 'id'>) => void;
  removeImage: (id: string) => void;
}

const HeroContext = createContext<HeroContextType | undefined>(undefined);

const DEFAULT_HERO_IMAGES: HeroImage[] = [
  {
    id: '1603715454235-5026f12204a1',
    url: 'https://images.unsplash.com/photo-1603715454235-5026f12204a1?q=80&w=1920&auto=format&fit=crop',
    alt: 'A stylish phone with an elegant white and gold marble case.'
  },
  {
    id: '1512499617640-b74ae3e7db25',
    url: 'https://images.unsplash.com/photo-1512499617640-b74ae3e7db25?q=80&w=1920&auto=format&fit=crop',
    alt: 'A stylish flat lay with a phone in a case, sunglasses, and notebook on a pink background.'
  },
  {
    id: '1574281591321-4f68a2d1e1c9',
    url: 'https://images.unsplash.com/photo-1574281591321-4f68a2d1e1c9?q=80&w=1920&auto=format&fit=crop',
    alt: 'A phone with a vibrant synthwave retro sunset case.'
  },
  {
    id: '1610792516307-ea5acd9c3b00',
    url: 'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?q=80&w=1920&auto=format&fit=crop',
    alt: 'A person holding a phone with a modern, artistic case against a textured wall.'
  },
  {
    id: '1599582301353-53303c621122',
    url: 'https://images.unsplash.com/photo-1599582301353-53303c621122?q=80&w=1920&auto=format&fit=crop',
    alt: 'A close-up of a sleek and modern carbon fiber phone case.'
  }
];

const loadHeroImagesFromStorage = (): HeroImage[] => {
  try {
    const storedImages = localStorage.getItem(HERO_IMAGES_STORAGE_KEY);
    if (storedImages) {
      return JSON.parse(storedImages);
    }
    // Seed with default images if nothing is stored
    localStorage.setItem(HERO_IMAGES_STORAGE_KEY, JSON.stringify(DEFAULT_HERO_IMAGES));
    return DEFAULT_HERO_IMAGES;
  } catch (error) {
    console.error("Failed to access hero images from localStorage", error);
    return DEFAULT_HERO_IMAGES;
  }
};

export const HeroProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>(loadHeroImagesFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(HERO_IMAGES_STORAGE_KEY, JSON.stringify(heroImages));
    } catch (error) {
      console.error("Failed to save hero images to localStorage", error);
    }
  }, [heroImages]);

  const addImage = (image: Omit<HeroImage, 'id'>) => {
    const newImage = { ...image, id: Date.now().toString() };
    setHeroImages(prev => [...prev, newImage]);
  };

  const removeImage = (id: string) => {
    setHeroImages(prev => prev.filter(img => img.id !== id));
  };
  
  const value = {
    heroImages,
    setHeroImages, // Exposing setHeroImages for drag-and-drop reordering if needed later
    addImage,
    removeImage,
  };

  return <HeroContext.Provider value={value}>{children}</HeroContext.Provider>;
};

export const useHero = () => {
  const context = useContext(HeroContext);
  if (context === undefined) {
    throw new Error('useHero must be used within a HeroProvider');
  }
  return context;
};
