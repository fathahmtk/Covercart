import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useReviews } from '../context/ReviewsContext';
import StarRating from './StarRating';
import { HeartIcon } from './icons/HeartIcon';
import { EyeIcon } from './icons/EyeIcon';
import LazyImage from './LazyImage';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  onQuickViewClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, onQuickViewClick }) => {
  const { addToCart } = useCart();
  const { isItemInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { getAverageRating } = useReviews();

  const { average, count } = getAverageRating(product.id);
  const isInWishlist = isItemInWishlist(product.id);
  
  const totalStock = product.variants && product.variants.length > 0 
    ? product.variants.reduce((sum, v) => sum + v.stock, 0)
    : product.stock ?? 0;
  
  const isOutOfStock = totalStock === 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      // If product has variants, add the first one by default.
      // The quick view or product page will let them choose a specific one.
      const variantToAdd = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
      addToCart(product, variantToAdd, 1);
      // Optional: Add some user feedback like a toast notification
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickViewClick(product);
  };

  return (
    <div 
      className="bg-[--color-bg] rounded-xl shadow-lg hover:shadow-2xl overflow-hidden border border-[--color-border] h-full flex flex-col transition-all duration-300 group"
    >
      <div className="relative overflow-hidden">
        <button onClick={() => onProductClick(product)} className="w-full block">
          <LazyImage 
            src={product.imageUrl} 
            alt={`${product.name} - ${product.category} Case`} 
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </button>
        {isOutOfStock && (
          <div className="absolute top-3 left-3 bg-gray-800/80 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
            Out of Stock
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleWishlistToggle} 
            className={`p-2.5 rounded-full backdrop-blur-sm transition-colors ${isInWishlist ? 'bg-red-500/80 text-white' : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:bg-red-500 hover:text-white'}`}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <HeartIcon filled={isInWishlist} />
          </button>
          <button 
            onClick={handleQuickView} 
            className="p-2.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 hover:bg-teal-500 hover:text-white transition-colors"
            aria-label="Quick view"
          >
            <EyeIcon />
          </button>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{product.category}</span>
        <h3 className="text-lg font-bold my-1 text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            <button onClick={() => onProductClick(product)} className="text-left w-full">
                {product.name}
            </button>
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            {count > 0 ? (
                <>
                    <StarRating rating={average} />
                    <span>({count})</span>
                </>
            ) : (
                <span className="italic">No reviews yet</span>
            )}
        </div>
        <div className="mt-auto pt-4 flex justify-between items-center">
          <p className="text-xl font-extrabold text-teal-600 dark:text-teal-400">₹{product.price}</p>
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex items-center gap-2 bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-black dark:bg-teal-600 dark:hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCartIcon className="w-5 h-5"/>
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;