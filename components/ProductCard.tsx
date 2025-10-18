import React, { useState, useRef, useEffect } from 'react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { HeartIcon } from './icons/HeartIcon';
import StarRating from './StarRating';
import { useReviews } from '../context/ReviewsContext';
import { ShareIcon } from './icons/ShareIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { LinkIcon } from './icons/LinkIcon';
import { CheckIcon } from './icons/CheckIcon';
import { EyeIcon } from './icons/EyeIcon';
import LazyImage from './LazyImage';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  onQuickViewClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, onQuickViewClick }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isItemInWishlist } = useWishlist();
  const { getAverageRating } = useReviews();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [wishlistFeedback, setWishlistFeedback] = useState(false);
  const shareContainerRef = useRef<HTMLDivElement>(null);

  const displayImageUrl = selectedVariant ? selectedVariant.imageUrl : product.imageUrl;
  const { average, count } = getAverageRating(product.id);
  const isInWishlist = isItemInWishlist(product.id);
  const productUrl = `${window.location.origin}${window.location.pathname}?product=${product.id}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareContainerRef.current && !shareContainerRef.current.contains(event.target as Node)) {
        setIsShareOpen(false);
      }
    };
    if (isShareOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShareOpen]);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.variants && selectedVariant) {
      addToCart(product, selectedVariant);
    } else if (!product.variants) {
      addToCart(product);
    }
  };
  
  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShareOpen(prev => !prev);
  }

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(productUrl).then(() => {
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
            setIsShareOpen(false);
        }, 2000);
    });
  }
  
  const handleShareToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInWishlist) {
      addToWishlist(product);
      setWishlistFeedback(true);
      setTimeout(() => {
        setWishlistFeedback(false);
        setIsShareOpen(false);
      }, 2000);
    } else {
      setIsShareOpen(false);
    }
  };

  const handleSocialShare = (platform: 'facebook' | 'twitter') => {
    const text = encodeURIComponent(`Check out this cool phone case: ${product.name}!`);
    let url = '';
    if(platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
    } else {
      url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${text}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsShareOpen(false);
  }
  
  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickViewClick(product);
  };

  // Helper function to determine if a color is light or dark for contrast
  const isColorLight = (hexColor: string) => {
    const color = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    // Using a simple luminance formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };


  return (
    <div 
        onClick={() => onProductClick(product)}
        className="cursor-pointer bg-[--color-bg] rounded-xl shadow-md overflow-hidden group transform hover:-translate-y-2 transition-all duration-300 border border-[--color-border] hover:shadow-xl hover:border-[--color-primary]/50 h-full flex flex-col"
    >
      <div className="relative">
        <LazyImage
          src={displayImageUrl}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handleQuickViewClick}
            className="flex items-center gap-2 bg-white text-gray-800 font-semibold py-2 px-4 rounded-full shadow-lg transform hover:scale-105 transition-transform"
            aria-label={`Quick view ${product.name}`}
          >
            <EyeIcon className="w-5 h-5" />
            <span>Quick View</span>
          </button>
        </div>

        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <button
            onClick={handleWishlistClick}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isInWishlist 
              ? 'bg-red-100 text-red-500' 
              : 'bg-white/70 text-gray-700 hover:bg-red-100 hover:text-red-500'
            }`}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <HeartIcon filled={isInWishlist} />
          </button>
          <div className="relative" ref={shareContainerRef}>
            <button
              onClick={handleShareClick}
              className="p-2 rounded-full bg-white/70 text-gray-700 hover:bg-gray-200 transition-colors"
              aria-label="Share product"
            >
              <ShareIcon className="w-6 h-6" />
            </button>
            {isShareOpen && (
              <div className="absolute top-full right-0 mt-2 z-20 bg-white dark:bg-gray-700 rounded-lg shadow-xl p-2 flex flex-col items-start gap-1 transform transition-all duration-150 ease-out origin-top-right w-48 text-sm">
                  <a onClick={(e) => { e.stopPropagation(); handleSocialShare('facebook'); }} className="w-full text-left cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 flex items-center gap-3">
                    <FacebookIcon className="w-5 h-5"/> <span>Share on Facebook</span>
                  </a>
                  <a onClick={(e) => { e.stopPropagation(); handleSocialShare('twitter'); }} className="w-full text-left cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 flex items-center gap-3">
                     <TwitterIcon className="w-5 h-5"/> <span>Share on Twitter</span>
                  </a>
                  <button onClick={handleCopyLink} className="w-full text-left p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 flex items-center gap-3" title="Copy link">
                    {isCopied ? (
                      <>
                        <CheckIcon className="w-5 h-5 text-[--color-primary]"/>
                        <span className="text-[--color-primary] font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-5 h-5"/>
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                  <div className="w-full h-px bg-gray-200 dark:bg-gray-600 my-1"></div>
                  <button onClick={handleShareToWishlist} className="w-full text-left p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 flex items-center gap-3" disabled={isInWishlist || wishlistFeedback}>
                    {wishlistFeedback ? (
                      <>
                        <CheckIcon className="w-5 h-5 text-[--color-primary]"/>
                        <span className="text-[--color-primary] font-semibold">Added!</span>
                      </>
                    ) : isInWishlist ? (
                      <>
                        <HeartIcon filled={true} className="w-5 h-5 text-red-500"/>
                        <span className="text-gray-500">In Wishlist</span>
                      </>
                    ) : (
                      <>
                        <HeartIcon className="w-5 h-5"/>
                        <span>Add to Wishlist</span>
                      </>
                    )}
                  </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-[--color-text] truncate" style={{fontFamily: 'var(--font-heading)'}}>
          {product.name}
          {selectedVariant && <span className="font-normal text-[--color-text-muted]"> - {selectedVariant.name}</span>}
        </h3>
        
        {product.variants && product.variants.length > 0 && (
          <div className="flex items-center space-x-2 mt-2 mb-1">
            {product.variants.map(variant => {
              const isSelected = selectedVariant?.id === variant.id;
              const checkmarkColor = isColorLight(variant.colorCode) ? 'text-gray-800' : 'text-white';
              
              return (
                <button
                  key={variant.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedVariant(variant); }}
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${isSelected ? 'border-[--color-primary] scale-110 ring-2 ring-[--color-primary] ring-offset-1' : 'border-gray-300 dark:border-gray-500'}`}
                  style={{ backgroundColor: variant.colorCode }}
                  aria-label={`Select color ${variant.name}`}
                  title={variant.name}
                >
                  {isSelected && (
                    <CheckIcon className={`w-4 h-4 ${checkmarkColor}`} />
                  )}
                </button>
              );
            })}
          </div>
        )}
        
        <p className="text-[--color-text-muted] mt-1 h-10 text-ellipsis overflow-hidden text-sm">{product.description}</p>
        
        <div className="flex items-center mt-3" onClick={(e) => { e.stopPropagation(); onProductClick(product); }}>
          <StarRating rating={average} />
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 hover:underline">({count} reviews)</span>
        </div>

        <div className="mt-auto pt-4 flex justify-between items-center">
          <p className="text-2xl font-bold text-[--color-primary]">₹{product.price}</p>
          <button 
            onClick={handleAddToCart}
            className="flex items-center bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-black dark:bg-[--color-primary] dark:hover:bg-[--color-primary-hover] transition-colors"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            <span className="ml-2 text-sm font-semibold">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;