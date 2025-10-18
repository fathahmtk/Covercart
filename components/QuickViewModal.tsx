import React, { useState, useEffect } from 'react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import StarRating from './StarRating';
import { useReviews } from '../context/ReviewsContext';
import { XMarkIcon } from './icons/XMarkIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { CheckIcon } from './icons/CheckIcon';
import LazyImage from './LazyImage';

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onViewFullDetails: (product: Product) => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ isOpen, onClose, product, onViewFullDetails }) => {
  const { addToCart } = useCart();
  const { getAverageRating } = useReviews();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (product) {
      const initialVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
      setSelectedVariant(initialVariant);
      setMainImage(initialVariant ? initialVariant.imageUrl : product.imageUrl);
      setQuantity(1); // Reset quantity when product changes
    }
  }, [product]);

  if (!product) return null;

  const { average, count } = getAverageRating(product.id);
  const uniqueImages = product.variants ? [...new Set([product.imageUrl, ...product.variants.map(v => v.imageUrl)])] : [product.imageUrl];

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setMainImage(variant.imageUrl);
  };
  
  const handleThumbnailClick = (imageUrl: string) => {
    setMainImage(imageUrl);
    const variant = product.variants?.find(v => v.imageUrl === imageUrl);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant || undefined, quantity);
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
      onClose();
    }, 2000);
  };
  
  const handleViewFullDetailsClick = () => {
    onViewFullDetails(product);
  }

  const isColorLight = (hexColor: string) => {
    const color = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-50 transition-opacity duration-300 ease-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${!isOpen && 'pointer-events-none'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-heading"
      >
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-[transform,opacity] duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="flex-shrink-0 p-4 absolute top-2 right-2 z-10">
            <button onClick={onClose} className="text-gray-500 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-full p-2 hover:text-gray-800 dark:hover:text-white" aria-label="Close quick view">
              <XMarkIcon />
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Gallery */}
              <div className="p-4">
                <div className="mb-4 rounded-lg overflow-hidden">
                  <LazyImage
                    key={mainImage}
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-auto object-cover"
                    style={{aspectRatio: '1/1.5'}}
                  />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {uniqueImages.map(imgUrl => (
                    <button
                      key={imgUrl}
                      onClick={() => handleThumbnailClick(imgUrl)}
                      className={`rounded-md overflow-hidden transition-all duration-200 aspect-square ${mainImage === imgUrl ? 'ring-2 ring-teal-500' : 'hover:opacity-80'}`}
                    >
                      <LazyImage src={imgUrl} alt="Product thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col">
                 <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{product.category}</span>
                <h1 id="quick-view-heading" className="text-3xl font-bold my-2 text-gray-900 dark:text-white">{product.name}</h1>
                
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={average} />
                  <span className="text-sm text-gray-500 dark:text-gray-400">({count} reviews)</span>
                </div>
                
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-4">₹{product.price}</p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 line-clamp-3">{product.description}</p>
                
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
                            className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${isSelected ? 'border-teal-500 ring-2 ring-teal-500 ring-offset-1' : 'border-gray-300 dark:border-gray-500'}`}
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

                <div className="mt-auto pt-6 border-t dark:border-gray-700">
                    <div className="flex items-center gap-4 mb-4">
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
                    </div>
                    <button onClick={handleViewFullDetailsClick} className="w-full text-center text-sm text-teal-600 dark:text-teal-400 hover:underline">
                        View Full Details & Reviews
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickViewModal;
