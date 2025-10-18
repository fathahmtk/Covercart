import React, { useRef } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import AnimateOnScroll from './AnimateOnScroll';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface ProductCarouselProps {
  title: string;
  products: Product[];
  onProductClick: (product: Product) => void;
  onQuickViewClick: (product: Product) => void;
  bgColor?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, products, onProductClick, onQuickViewClick, bgColor = 'bg-white dark:bg-gray-950' }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) {
    return null;
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className={`py-16 ${bgColor}`}>
      <div className="container mx-auto px-6">
        <AnimateOnScroll className="fade-in-up">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">{title}</h2>
        </AnimateOnScroll>
        
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
            {products.map((product, index) => (
              <AnimateOnScroll
                key={product.id}
                delay={index * 100}
                className="fade-in-up flex-shrink-0 w-72 sm:w-80 snap-start"
              >
                <ProductCard
                  product={product}
                  onProductClick={onProductClick}
                  onQuickViewClick={onQuickViewClick}
                />
              </AnimateOnScroll>
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
      </div>
      <style>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ProductCarousel;