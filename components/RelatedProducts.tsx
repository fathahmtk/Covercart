import React, { useMemo } from 'react';
import { Product } from '../types';
import { useProducts } from '../context/ProductContext';
import ProductCarousel from './ProductCarousel';

interface RelatedProductsProps {
  currentProduct: Product;
  onProductClick: (product: Product) => void;
  onQuickViewClick: (product: Product) => void;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProduct, onProductClick, onQuickViewClick }) => {
  const { products } = useProducts();

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
  
  return (
    <ProductCarousel
      title="Customers Also Viewed"
      products={relatedProducts}
      onProductClick={onProductClick}
      onQuickViewClick={onQuickViewClick}
      bgColor="bg-white dark:bg-gray-950"
    />
  );
};

export default RelatedProducts;