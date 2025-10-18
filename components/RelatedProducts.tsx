import React, { useMemo, useRef } from 'react';
import { Product } from '../types';
import { useProducts } from '../context/ProductContext';
import ProductCard from './ProductCard';
import AnimateOnScroll from './AnimateOnScroll';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface RelatedProductsProps {
  currentProduct: Product;
  onProductClick: (product: Product) => void;
  onQuickViewClick: (product: Product) => void;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProduct, onProductClick, onQuickViewClick }) => {
  const { products } = useProducts();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const relatedProducts = useMemo(() => {
    // Filter out the current product
    const otherProducts = products.filter(p => p.id !== currentProduct.id);
    
    // Find products in the same category
    const sameCategoryProducts = otherProducts.filter(p => p.category === currentProduct.category);
    
    // Get other products to fill if needed
    const otherCategoryProducts = otherProducts.filter(p => p.category !== currentProduct.category);
    
    // Shuffle the other category products for variety
    for (let i = otherCategoryProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherCategoryProducts[i], otherCategoryProducts[j]] = [otherCategoryProducts[j], otherCategoryProducts[i]];
    }

    // Combine them, prioritizing same category, and take up to 8
    return [...sameCategoryProducts, ...otherCategoryProducts].slice(0, 8);
  }, [products, currentProduct]);

  if (relatedProducts.length === 0) {
    return null;
  }
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
        const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
        scrollContainerRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    }
  };
  
  const isCarousel = relatedProducts.length > 4;

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-6">
        <AnimateOnScroll className="fade-in-up">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">Customers Also Viewed</h2>
        
            {isCarousel ? (
              <div className="relative group">
                  <button 
                      onClick={() => scroll('left')}
                      className="absolute top-1/2 -left-4 -translate-y-1/2 z-10 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 disabled:opacity-0"
                      aria-label="Scroll left"
                  >
                      <ChevronLeftIcon className="w-6 h-6 text-gray-800 dark:text-white" />
                  </button>

                  <div 
                      ref={scrollContainerRef}
                      className="flex gap-6 overflow-x-auto pb-4 scroll-smooth scroll-p-6 snap-x snap-mandatory"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                      {relatedProducts.map(product => (
                          <div key={product.id} className="flex-shrink-0 w-72 sm:w-80 snap-start">
                              <ProductCard 
                                  product={product} 
                                  onProductClick={onProductClick} 
                                  onQuickViewClick={onQuickViewClick}
                              />
                          </div>
                      ))}
                  </div>
                  
                  <button 
                      onClick={() => scroll('right')}
                      className="absolute top-1/2 -right-4 -translate-y-1/2 z-10 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 disabled:opacity-0"
                      aria-label="Scroll right"
                  >
                      <ChevronRightIcon className="w-6 h-6 text-gray-800 dark:text-white" />
                  </button>
              </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
                  {relatedProducts.map(product => (
                      <ProductCard 
                          key={product.id}
                          product={product} 
                          onProductClick={onProductClick} 
                          onQuickViewClick={onQuickViewClick}
                      />
                  ))}
              </div>
            )}
        </AnimateOnScroll>
      </div>
       <style>{`
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }
        `}</style>
    </section>
  );
};

export default RelatedProducts;