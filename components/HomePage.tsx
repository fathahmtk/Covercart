

import React, { useMemo } from 'react';
import Hero from './Hero';
import ProductList from './ProductList';
import About from './About';
import Contact from './Contact';
import { Product } from '../types';
import { useProducts } from '../context/ProductContext';
import ProductCarousel from './ProductCarousel';
import PersonalizedRecommendations from './PersonalizedRecommendations';

interface HomePageProps {
  searchQuery: string;
  onProductClick: (product: Product) => void;
  onQuickViewClick: (product: Product) => void;
}

const HomePage: React.FC<HomePageProps> = ({ searchQuery, onProductClick, onQuickViewClick }) => {
  const { products } = useProducts();

  const newArrivals = useMemo(() => {
    return [...products].sort((a, b) => b.id - a.id).slice(0, 8);
  }, [products]);

  const topPicks = useMemo(() => {
    // Manually curated top picks, can be replaced with dynamic logic
    const topPickIds = [2, 7, 8, 12, 3, 5, 10, 1];
    return products.filter(p => topPickIds.includes(p.id))
                   .sort((a, b) => topPickIds.indexOf(a.id) - topPickIds.indexOf(b.id));
  }, [products]);

  // If there's a search query, we only show the main product list.
  // Otherwise, we show the curated home page layout.
  if (searchQuery) {
    return (
      <ProductList 
        searchQuery={searchQuery} 
        onProductClick={onProductClick} 
        onQuickViewClick={onQuickViewClick}
      />
    );
  }

  return (
    <>
      <Hero />
      <ProductCarousel
        title="Top Picks"
        products={topPicks}
        onProductClick={onProductClick}
        onQuickViewClick={onQuickViewClick}
      />
      <ProductCarousel
        title="New Arrivals"
        products={newArrivals}
        onProductClick={onProductClick}
        onQuickViewClick={onQuickViewClick}
        bgColor="bg-[--color-bg-subtle]"
      />
      <PersonalizedRecommendations
        title="Just For You"
        onProductClick={onProductClick}
        onQuickViewClick={onQuickViewClick}
        bgColor="bg-white dark:bg-gray-950"
      />
      <ProductList 
        searchQuery={searchQuery} 
        onProductClick={onProductClick} 
        onQuickViewClick={onQuickViewClick}
      />
      <About />
      <Contact />
    </>
  );
};

export default HomePage;