import React from 'react';
import Hero from './Hero';
import ProductList from './ProductList';
import AiDesigner from './AiDesigner';
import About from './About';
import Contact from './Contact';
import { Product } from '../types';

interface HomePageProps {
  searchQuery: string;
  onProductClick: (product: Product) => void;
  onQuickViewClick: (product: Product) => void;
}

const HomePage: React.FC<HomePageProps> = ({ searchQuery, onProductClick, onQuickViewClick }) => {
  return (
    <>
      <Hero />
      <ProductList 
        searchQuery={searchQuery} 
        onProductClick={onProductClick} 
        onQuickViewClick={onQuickViewClick}
      />
      <AiDesigner />
      <About />
      <Contact />
    </>
  );
};

export default HomePage;
