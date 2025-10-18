import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Review } from '../types';

const REVIEWS_STORAGE_KEY = 'covercart-reviews';

interface ReviewsContextType {
  reviews: Record<string, Review[]>;
  addReview: (productId: number, reviewData: { name: string; rating: number; comment: string }) => void;
  getReviewsForProduct: (productId: number) => Review[];
  getAverageRating: (productId: number) => { average: number; count: number };
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

// Helper to get reviews from localStorage safely
const loadReviewsFromStorage = (): Record<string, Review[]> => {
  try {
    const storedReviews = localStorage.getItem(REVIEWS_STORAGE_KEY);
    return storedReviews ? JSON.parse(storedReviews) : {};
  } catch (error) {
    console.error("Failed to parse reviews from localStorage", error);
    return {};
  }
};

export const ReviewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Record<string, Review[]>>(loadReviewsFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    } catch (error) {
      console.error("Failed to save reviews to localStorage", error);
    }
  }, [reviews]);

  const addReview = (productId: number, reviewData: { name: string; rating: number; comment: string }) => {
    const newReview: Review = {
      ...reviewData,
      id: new Date().toISOString() + Math.random(), // Simple unique ID
      productId,
      date: new Date().toISOString(),
    };

    setReviews(prevReviews => {
      const productReviews = prevReviews[productId] ? [...prevReviews[productId]] : [];
      productReviews.unshift(newReview); // Add new review to the top
      return {
        ...prevReviews,
        [productId]: productReviews,
      };
    });
  };

  const getReviewsForProduct = useCallback((productId: number): Review[] => {
    return reviews[productId] || [];
  }, [reviews]);

  const getAverageRating = useCallback((productId: number): { average: number; count: number } => {
    const productReviews = reviews[productId] || [];
    const count = productReviews.length;
    if (count === 0) {
      return { average: 0, count: 0 };
    }
    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / count;
    return { average, count };
  }, [reviews]);

  const value = {
    reviews,
    addReview,
    getReviewsForProduct,
    getAverageRating,
  };

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};
