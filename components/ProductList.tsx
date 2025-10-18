import React, { useState, useEffect, useMemo } from 'react';
import { CATEGORIES, SORT_OPTIONS } from '../constants';
import ProductCard from './ProductCard';
import { Product } from '../types';
import ProductFilters from './ProductFilters';
import { useProducts } from '../context/ProductContext';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import AnimateOnScroll from './AnimateOnScroll';

interface ProductListProps {
  searchQuery: string;
  onProductClick: (product: Product) => void;
  onAddProductClick: () => void;
  onQuickViewClick: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ searchQuery, onProductClick, onAddProductClick, onQuickViewClick }) => {
  const { products } = useProducts();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortOption, setSortOption] = useState(SORT_OPTIONS[0].value);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

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
    const query = searchQuery.toLowerCase().trim();
    
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
  
  const handleResetFilters = () => {
    setSelectedCategory('All');
    setPriceRange({ min: 0, max: maxProductPrice });
    setSortOption(SORT_OPTIONS[0].value);
    setSelectedColors([]);
  };

  return (
    <section id="products" className="py-24 bg-[--color-bg-subtle]">
      <div className="container mx-auto px-6">
        <AnimateOnScroll className="fade-in-up">
            <div className="text-center mb-4 relative">
                <h2 className="text-4xl font-bold text-[--color-text] tracking-tight">Our Collection</h2>
                <div className="absolute top-1/2 -translate-y-1/2 right-0 hidden sm:block">
                     <button 
                        onClick={onAddProductClick}
                        className="flex items-center gap-2 bg-[--color-primary] text-white py-2 px-4 rounded-lg hover:bg-[--color-primary-hover] transition-colors text-sm font-semibold"
                        title="Add a new product to the catalog"
                      >
                        <PlusCircleIcon />
                        <span>Add Product</span>
                     </button>
                </div>
            </div>

            <p className="text-center text-[--color-text-muted] mb-12">
              Find the perfect case that matches your style.
            </p>

            <div className="sm:hidden mb-8 text-center">
                 <button 
                    onClick={onAddProductClick}
                    className="inline-flex items-center gap-2 bg-[--color-primary] text-white py-2 px-4 rounded-lg hover:bg-[--color-primary-hover] transition-colors font-semibold"
                    title="Add a new product to the catalog"
                  >
                    <PlusCircleIcon />
                    <span>Add New Product</span>
                 </button>
            </div>


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
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProducts.map((product, index) => (
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
      </div>
    </section>
  );
};

export default ProductList;