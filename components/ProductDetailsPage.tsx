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
import { generateDescriptionWithGemini } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import RelatedProducts from './RelatedProducts';
import { useSEO } from '../hooks/useSEO';
import Lightbox from './Lightbox';
import { FacebookIcon } from './icons/FacebookIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { LinkIcon } from './icons/LinkIcon';
import { useToast } from './ToastProvider';

interface ProductDetailsPageProps {
  product: Product;
  onBack: () => void;
  onProductClick: (product: Product) => void;
  onQuickViewClick: (product: Product) => void;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ product, onBack, onProductClick, onQuickViewClick }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isItemInWishlist } = useWishlist();
  const { getAverageRating } = useReviews();
  const { showToast } = useToast();
  
  const allImages = product.variants ? [product.imageUrl, ...product.variants.map(v => v.imageUrl)] : [product.imageUrl];
  const uniqueImages = [...new Set(allImages)];
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
      product.variants && product.variants.length > 0 ? product.variants[0] : null
      );
  const [mainImage, setMainImage] = useState(product.imageUrl);
  const [quantity, setQuantity] = useState(1);
  
  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const { average, count } = getAverageRating(product.id);
  
  // SEO & Structured Data
  const seoTitle = `${product.name} | covercove.com - Premium Mobile Covers`;
  const seoDescription = product.description.substring(0, 160);
  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) ?? product.stock ?? 0;
  
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.imageUrl,
    "description": product.description,
    "brand": {
        "@type": "Brand",
        "name": product.brand || product.category
    },
    "sku": `CC-${product.id}`,
    "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "INR",
        "price": product.price,
        "availability": totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "itemCondition": "https://schema.org/NewCondition"
    },
    ...(count > 0 && {
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": average.toFixed(1),
            "reviewCount": count
        }
    })
  };
  
  useSEO({
    title: seoTitle,
    description: seoDescription,
    keywords: `mobile cover, phone case, ${product.name}, ${product.category}, covercove.com`,
    schema: productSchema,
  });

  const currentStock = selectedVariant ? selectedVariant.stock : product.stock ?? 0;
  const isOutOfStock = currentStock === 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

  useEffect(() => {
    // This effect runs when the component mounts or the product prop changes.
    // It resets the state for the new product being displayed.
    const initialVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
    setSelectedVariant(initialVariant);
    setMainImage(initialVariant ? initialVariant.imageUrl : product.imageUrl);
    setQuantity(1);
    setAiDescription(null);
    setIsGenerating(false);
    setGenerationError(null);
    setIsLightboxOpen(false); // Close lightbox when product changes
  }, [product]);

  const isInWishlist = isItemInWishlist(product.id);
  const imageAltText = `${product.name}${selectedVariant ? ` - ${selectedVariant.name}` : ''}`;
  const thumbnailAltText = `${product.name} for ${product.category}`;

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setMainImage(variant.imageUrl);
    setQuantity(1); // Reset quantity on variant change
  };
  
  const handleThumbnailClick = (imageUrl: string) => {
    setMainImage(imageUrl);
    const variant = product.variants?.find(v => v.imageUrl === imageUrl);
    if(variant) {
        setSelectedVariant(variant);
    }
  }

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant || undefined, quantity);
  };
  
  const handleWishlistClick = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
        const description = await generateDescriptionWithGemini(product.name, product.category);
        setAiDescription(description);
    } catch (error) {
        setGenerationError(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'whatsapp' | 'copy') => {
    const url = window.location.href;
    const text = `Check out this awesome phone case: ${product.name} from covercove.com!`;

    if (platform === 'copy') {
      navigator.clipboard.writeText(url).then(() => {
        showToast('Link copied to clipboard!', 'success');
      });
      return;
    }

    let shareUrl = '';
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const isColorLight = (hexColor: string) => {
    const color = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

  const StockIndicator = () => {
    if (isOutOfStock) {
        return <div className="px-3 py-1 text-sm font-bold text-red-800 bg-red-100 rounded-full inline-block">Out of Stock</div>;
    }
    if (isLowStock) {
        return <div className="px-3 py-1 text-sm font-bold text-amber-800 bg-amber-100 rounded-full inline-block">Low Stock - Only {currentStock} left!</div>;
    }
    return <div className="px-3 py-1 text-sm font-bold text-green-800 bg-green-100 rounded-full inline-block">In Stock</div>;
  };

  return (
    <div className="animate-fade-in">
      <div className="container mx-auto px-6 py-12">
        <a href="#/" onClick={(e) => { e.preventDefault(); onBack(); }} className="mb-8 inline-block text-teal-600 dark:text-teal-400 hover:underline">
          &larr; Back to Products
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="mb-4 cursor-pointer" onClick={() => setIsLightboxOpen(true)} title="Click to enlarge">
               <ImageZoom imageUrl={mainImage} alt={imageAltText} />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {uniqueImages.map(imgUrl => (
                <button
                  key={imgUrl}
                  onClick={() => handleThumbnailClick(imgUrl)}
                  className={`rounded-md overflow-hidden transition-all duration-200 aspect-square ${mainImage === imgUrl ? 'ring-2 ring-teal-500 ring-offset-2' : 'hover:opacity-80'}`}
                >
                  <LazyImage src={imgUrl} alt={`${thumbnailAltText} thumbnail`} className="w-full h-full object-cover" />
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
            
            <div className="mb-4">
                <StockIndicator />
            </div>

            <div className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 min-h-[4.5rem]">
              {aiDescription || product.description ? (
                <p>{aiDescription || product.description}</p>
              ) : (
                <div>
                  <p className="italic text-gray-400 dark:text-gray-500">No description available for this product.</p>
                  <button
                    onClick={handleGenerateDescription}
                    disabled={isGenerating}
                    className="mt-2 flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-[--color-primary] to-teal-400 hover:shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-wait px-4 py-2 rounded-full shadow"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-4 h-4" />
                        Generate AI Description
                      </>
                    )}
                  </button>
                  {generationError && <p className="text-red-500 text-xs mt-2">{generationError}</p>}
                </div>
              )}
            </div>
            
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
            <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-md">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label="Decrease quantity" disabled={isOutOfStock}>
                        <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-lg font-semibold">{quantity}</span>
                    <button onClick={() => setQuantity(q => Math.min(currentStock, q + 1))} className="p-3 text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label="Increase quantity" disabled={isOutOfStock || quantity >= currentStock}>
                        <PlusIcon className="w-4 h-4" />
                    </button>
                </div>

                <button
                    onClick={handleAddToCart}
                    className="flex-grow flex items-center justify-center bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-black dark:bg-teal-600 dark:hover:bg-teal-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isOutOfStock}
                >
                    <ShoppingCartIcon className="w-6 h-6" />
                    <span className="ml-2">{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
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

            {/* Social Share */}
            <div className="mt-6 pt-6 border-t dark:border-gray-700 flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Share:</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => handleShare('whatsapp')} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" aria-label="Share on WhatsApp"><WhatsAppIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" /></button>
                    <button onClick={() => handleShare('facebook')} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" aria-label="Share on Facebook"><FacebookIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" /></button>
                    <button onClick={() => handleShare('twitter')} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" aria-label="Share on Twitter"><TwitterIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" /></button>
                    <button onClick={() => handleShare('copy')} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" aria-label="Copy link"><LinkIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" /></button>
                </div>
            </div>
          </div>
        </div>
      </div>

      <ProductReviews product={product} />
      <UserGallery product={product} />
      <RelatedProducts 
        currentProduct={product}
        onProductClick={onProductClick}
        onQuickViewClick={onQuickViewClick}
      />
      {isLightboxOpen && (
        <Lightbox imageUrl={mainImage} onClose={() => setIsLightboxOpen(false)} />
      )}
    </div>
  );
};

export default ProductDetailsPage;