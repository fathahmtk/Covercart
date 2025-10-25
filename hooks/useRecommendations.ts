import { useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';

interface RecommendationsOptions {
  currentProductId?: number;
  count?: number;
}

export const useRecommendations = ({ currentProductId, count = 8 }: RecommendationsOptions = {}) => {
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { products } = useProducts();

  const recommendations = useMemo(() => {
    if (cartItems.length === 0 && wishlistItems.length === 0) {
      return [];
    }

    const interestProfile: {
      categories: Record<string, number>;
      brands: Record<string, number>;
    } = {
      categories: {},
      brands: {},
    };

    const interestItems = [
        ...cartItems.map(item => products.find(p => p.id === item.productId)),
        ...wishlistItems,
    ].filter(Boolean) as Product[];

    interestItems.forEach(item => {
        interestProfile.categories[item.category] = (interestProfile.categories[item.category] || 0) + 1;
        interestProfile.brands[item.brand] = (interestProfile.brands[item.brand] || 0) + 1;
    });

    const exclusionIds = new Set([
      ...(currentProductId ? [currentProductId] : []),
      ...cartItems.map(item => item.productId),
      ...wishlistItems.map(item => item.id),
    ]);

    const scoredProducts = products
      .filter(p => !exclusionIds.has(p.id))
      .map(product => {
        let score = 0;
        if (interestProfile.categories[product.category]) {
          score += interestProfile.categories[product.category] * 2; // Category match is more important
        }
        if (interestProfile.brands[product.brand]) {
          score += interestProfile.brands[product.brand] * 1;
        }
        // Add a small random factor to shuffle items with the same score
        if (score > 0) {
            score += Math.random() * 0.1; 
        }

        return { product, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    return scoredProducts.slice(0, count).map(item => item.product);
  }, [cartItems, wishlistItems, products, currentProductId, count]);

  return recommendations;
};
