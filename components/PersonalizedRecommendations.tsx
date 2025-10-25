import React from 'react';
import { Product } from '../types';
import { useRecommendations } from '../hooks/useRecommendations';
import ProductCarousel from './ProductCarousel';

interface PersonalizedRecommendationsProps {
  title: string;
  onProductClick: (product: Product) => void;
  onQuickViewClick: (product: Product) => void;
  currentProductId?: number;
  bgColor?: string;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({ title, onProductClick, onQuickViewClick, currentProductId, bgColor }) => {
  const recommendations = useRecommendations({ currentProductId });

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <ProductCarousel
      title={title}
      products={recommendations}
      onProductClick={onProductClick}
      onQuickViewClick={onQuickViewClick}
      bgColor={bgColor}
    />
  );
};

export default PersonalizedRecommendations;
