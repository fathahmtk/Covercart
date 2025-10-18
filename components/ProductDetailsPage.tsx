import React, { useState, useEffect } from 'react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useReviews } from '../context/ReviewsContext';
import StarRating from './StarRating';
import ProductReviews from './ProductReviews';
import { HeartIcon } from './icons/HeartIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { CheckIcon } from './icons/CheckIcon';
import ImageZoom from './ImageZoom';
import LazyImage from './LazyImage';
import UserGallery from './UserGallery';

interface ProductDetailsPageProps {
  product: Product;
  onBack: () => void;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ product, onBack }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isItemInWishlist } = useWishlist();
  const { getAverageRating } = useReviews();

  const allImages = product.variants ? [product.imageUrl, ...product.variants.map(v => v.imageUrl)] : [product.imageUrl];
  const uniqueImages = [...new Set(allImages)];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [mainImage, setMainImage] = useState(selectedVariant ? selectedVariant.imageUrl : product.imageUrl);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (selectedVariant) {
      setMainImage(selectedVariant.imageUrl);
    }
  }, [selectedVariant]);

  const isInWishlist = isItemInWishlist(product.id);
  const { average, count } = getAverageRating(product.id);

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setMainImage(variant.imageUrl);
  };
  
  const handleThumbnailClick = (imageUrl: string) => {
    setMainImage(imageUrl);
    const variant = product.variants?.find(v => v.imageUrl === imageUrl);
    if(variant) {
        setSelectedVariant(variant);
    }
  }

  const handleAddToCart = () => {
    addToCart(product, selectedVariant || undefined, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };
  
  const handleWishlistClick = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const isColorLight = (hexColor: string) => {
    const color = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

  return (
    <div className="animate-fade-in">
      <div className="container mx-auto px-6 py-12">
        <button onClick={onBack} className="mb-8 text-teal-600 dark:text-teal-400 hover:underline">
          &larr; Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="mb-4">
               <ImageZoom imageUrl={mainImage} alt={product.name} />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {uniqueImages.map(imgUrl => (
                <button
                  key={imgUrl}
                  onClick={() => handleThumbnailClick(imgUrl)}
                  className={`rounded-md overflow-hidden transition-all duration-200 aspect-square ${mainImage === imgUrl ? 'ring-2 ring-teal-500 ring-offset-2' : 'hover:opacity-80'}`}
                >
                  <LazyImage src={imgUrl} alt="Product thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{product.category}</span>
            <h1 className="text-4xl font-extrabold my-2 text-gray-900 dark:text-white">{product.name}</h1>
            
            <a href="#reviews" className="flex items-center gap-2 mb-4 text-sm text-gray-500 dark:text-gray-400 hover:underline">
              <StarRating rating={average} />
              <span>({count} reviews)</span>
            </a>

            <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-4">₹{product.price}</p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{product.description}</p>
            
            {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Color: <span className="font-normal">{selectedVariant?.name}</span></h4>
                    <div className="flex items-center space-x-3">
                        {product.variants.map(variant => {
                            const isSelected = selectedVariant?.id === variant.id;
                            const checkmarkColor = isColorLight(variant.colorCode) ? 'text-gray-800' : 'text-white';
                            return (
                                <button
                                key={variant.id}
                                onClick={() => handleVariantSelect(variant)}
                                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${isSelected ? 'border-teal-500 scale-110 ring-2 ring-teal-500 ring-offset-1' : 'border-gray-300 dark:border-gray-500'}`}
                                style={{ backgroundColor: variant.colorCode }}
                                aria-label={`Select color ${variant.name}`}
                                title={variant.name}
                                >
                                {isSelected && <CheckIcon className={`w-5 h-5 ${checkmarkColor}`} />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
            
            {/* Actions */}
            <div className="flex items-center gap-4 mt-auto pt-6 border-t dark:border-gray-700">
                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-md">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label="Decrease quantity">
                        <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-lg font-semibold">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="p-3 text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label="Increase quantity">
                        <PlusIcon className="w-4 h-4" />
                    </button>
                </div>

                <button
                    onClick={handleAddToCart}
                    className="flex-grow flex items-center justify-center bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-black dark:bg-teal-600 dark:hover:bg-teal-700 transition-colors shadow-md disabled:opacity-70"
                    disabled={addedToCart}
                >
                    <ShoppingCartIcon className="w-6 h-6" />
                    <span className="ml-2">{addedToCart ? 'Added!' : 'Add to Cart'}</span>
                </button>

                <button
                    onClick={handleWishlistClick}
                    className={`p-3 rounded-lg transition-colors duration-200 border ${
                        isInWishlist 
                        ? 'bg-red-100 text-red-500 border-red-200' 
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-red-100 hover:text-red-500'
                    }`}
                    aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <HeartIcon filled={isInWishlist} />
                </button>
            </div>

          </div>
        </div>
      </div>

      <ProductReviews product={product} />
      <UserGallery product={product} />
    </div>
  );
};

export default ProductDetailsPage;