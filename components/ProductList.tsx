import React, { useState, useEffect, useMemo } from 'react';
import { CATEGORIES, SORT_OPTIONS } from '../constants';
import ProductCard from './ProductCard';
import { Product } from '../types';
import ProductFilters from './ProductFilters';
import { useProducts } from '../context/ProductContext';
import AnimateOnScroll from './AnimateOnScroll';

interface ProductListProps {
  searchQuery: string;
  onProductClick: (product: Product) => void;
  onQuickViewClick: (product: Product) => void;
}

const ITEMS_PER_PAGE = 9; // Using 9 for a balanced 3-column grid layout

const ProductList: React.FC<ProductListProps> = ({ searchQuery, onProductClick, onQuickViewClick }) => {
  const { products } = useProducts();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortOption, setSortOption] = useState(SORT_OPTIONS[0].value);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { maxProductPrice, availableColors } = useMemo(() => {
    if (products.length === 0) return { maxProductPrice: 1000, availableColors: [] };
    
    const colorSet = new Set<string>();
    let maxPrice = 0;

    products.forEach(p => {
      if (p.price > maxPrice) maxPrice = p.price;
      p.variants?.forEach(v => colorSet.add(v.colorCode));
    });

    return {
      maxProductPrice: Math.ceil(maxPrice / 100) * 100,
      availableColors: Array.from(colorSet),
    };
  }, [products]);

  useEffect(() => {
    setPriceRange({ min: 0, max: maxProductPrice });
  }, [maxProductPrice]);

  const filteredProducts = useMemo(() => {
    // Refine query processing: trim, lowercase, and replace multiple spaces with a single one.
    const query = searchQuery.toLowerCase().trim().replace(/\s+/g, ' ');
    
    const filtered = products.filter(product => {
      const matchesSearch = query ? 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) : 
        true;
      
      const matchesCategory = selectedCategory === 'All' ? 
        true : 
        product.category === selectedCategory;

      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      
      const matchesColors = selectedColors.length === 0 ? 
        true : 
        product.variants?.some(variant => selectedColors.includes(variant.colorCode)) ?? false;

      return matchesSearch && matchesCategory && matchesPrice && matchesColors;
    });

    const sorted = [...filtered];
    switch(sortOption) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Keep original order for "Featured"
        break;
    }
    
    return sorted;
  }, [products, searchQuery, selectedCategory, priceRange, sortOption, selectedColors]);

  // Reset to page 1 when filters or search query change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, priceRange, sortOption, selectedColors]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);
  
  const handleResetFilters = () => {
    setSelectedCategory('All');
    setPriceRange({ min: 0, max: maxProductPrice });
    setSortOption(SORT_OPTIONS[0].value);
    setSelectedColors([]);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <section id="products" className="py-24 bg-[--color-bg-subtle]">
      <div className="container mx-auto px-6">
        <AnimateOnScroll className="fade-in-up">
            <div className="text-center mb-4 relative">
                <h2 className="text-4xl font-bold text-[--color-text] tracking-tight">Our Collection</h2>
            </div>

            <p className="text-center text-[--color-text-muted] mb-12">
              Find the perfect case that matches your style.
            </p>

            <ProductFilters
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              maxPrice={maxProductPrice}
              sortOptions={SORT_OPTIONS}
              selectedSort={sortOption}
              onSortChange={setSortOption}
              availableColors={availableColors}
              selectedColors={selectedColors}
              onColorChange={setSelectedColors}
              onReset={handleResetFilters}
              resultCount={filteredProducts.length}
            />
        </AnimateOnScroll>
        
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {paginatedProducts.map((product, index) => (
              <AnimateOnScroll key={product.id} delay={index * 100} className="fade-in-up h-full">
                <ProductCard 
                  product={product} 
                  onProductClick={onProductClick} 
                  onQuickViewClick={onQuickViewClick}
                />
              </AnimateOnScroll>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 col-span-full">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-200">No Products Found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <AnimateOnScroll className="fade-in-up mt-16 flex justify-center items-center gap-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[--color-bg] border border-[--color-border] rounded-md shadow-sm text-sm font-medium text-[--color-text] hover:bg-[--color-bg-subtle] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              &larr; Previous
            </button>
            <span className="text-sm text-[--color-text-muted]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 bg-[--color-bg] border border-[--color-border] rounded-md shadow-sm text-sm font-medium text-[--color-text] hover:bg-[--color-bg-subtle] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next &rarr;
            </button>
          </AnimateOnScroll>
        )}
      </div>
    </section>
  );
};

export default ProductList;