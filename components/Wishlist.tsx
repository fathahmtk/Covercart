

import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { XMarkIcon } from './icons/XMarkIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { HeartIcon } from './icons/HeartIcon';
import { Product } from '../types';
import LazyImage from './LazyImage';

interface WishlistProps {
  isOpen: boolean;
  onClose: () => void;
}

const Wishlist: React.FC<WishlistProps> = ({ isOpen, onClose }) => {
  const { wishlistItems, removeFromWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product: Product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Wishlist Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[--color-bg-primary] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wishlist-heading"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-[--color-border]">
            <h2 id="wishlist-heading" className="text-2xl font-bold text-[--color-text-primary]">Your Wishlist ({wishlistCount})</h2>
            <button onClick={onClose} className="text-[--color-text-muted] hover:text-[--color-text-primary]" aria-label="Close wishlist">
              <XMarkIcon />
            </button>
          </div>

          {/* Items */}
          {wishlistItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
              <HeartIcon className="w-16 h-16 text-[--color-text-muted] mb-4" />
              <h3 className="text-xl font-semibold text-[--color-text-primary]">Your wishlist is empty</h3>
              <p className="text-[--color-text-secondary] mt-2">Tap the heart on products to save them for later.</p>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {wishlistItems.map(item => (
                <div key={item.id} className="flex items-start space-x-4">
                  <LazyImage src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-md object-cover" />
                  <div className="flex-grow">
                    <h4 className="font-semibold text-[--color-text-primary]">{item.name}</h4>
                    <p className="text-sm text-[--color-text-secondary] mb-2">₹{item.price}</p>
                    <button 
                      onClick={() => handleMoveToCart(item)}
                      className="flex items-center text-sm text-[--color-primary] font-semibold hover:underline"
                      aria-label={`Add ${item.name} to cart`}
                    >
                      <ShoppingCartIcon className="w-5 h-5"/>
                      <span className="ml-1">Add to Cart</span>
                    </button>
                  </div>
                  <button onClick={() => removeFromWishlist(item.id)} className="text-[--color-text-muted] hover:text-red-500 transition-colors" aria-label={`Remove ${item.name} from wishlist`}>
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;