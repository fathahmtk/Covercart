import React from 'react';
import { useCart } from '../context/CartContext';
import { XMarkIcon } from './icons/XMarkIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { BUSINESS_INFO } from '../constants';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    let message = "Hello! I'd like to place an order for the following items:\n\n";
    cartItems.forEach(item => {
      const variantInfo = item.variantName ? ` (${item.variantName})` : '';
      message += `- ${item.quantity} x ${item.productName}${variantInfo} @ ₹${item.price} each\n`;
    });
    message += `\n*Subtotal: ₹${cartTotal.toFixed(2)}*`;

    const whatsappUrl = `https://wa.me/${BUSINESS_INFO.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-50 transition-opacity duration-300 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${!isOpen && 'pointer-events-none'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
      >
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-[transform,opacity] duration-300 ease-in-out ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h2 id="cart-heading" className="text-2xl font-bold text-gray-800 dark:text-white">Your Cart ({cartCount})</h2>
            <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white" aria-label="Close cart">
              <XMarkIcon />
            </button>
          </div>

          {/* Items */}
          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
              <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Your cart is empty</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Looks like you haven't added anything yet.</p>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {cartItems.map(item => (
                <div key={item.cartItemId} className="flex items-start space-x-4">
                  <img src={item.imageUrl} alt={item.productName} className="w-20 h-20 rounded-md object-cover flex-shrink-0" />
                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                      {item.productName}
                      {item.variantName && <span className="font-normal text-gray-500 dark:text-gray-400"> - {item.variantName}</span>}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">₹{item.price}</p>
                    <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-md w-fit">
                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="p-1.5 text-gray-500 hover:text-gray-800 dark:hover:text-white disabled:opacity-50" aria-label="Decrease quantity">
                            <MinusIcon />
                        </button>
                        <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="p-1.5 text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label="Increase quantity">
                            <PlusIcon />
                        </button>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-800 dark:text-gray-200">₹{item.price * item.quantity}</p>
                     <button onClick={() => removeFromCart(item.cartItemId)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors mt-2" aria-label={`Remove ${item.productName} from cart`}>
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {cartItems.length > 0 && (
             <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
               <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Subtotal</span>
                <span className="text-2xl font-bold text-gray-800 dark:text-white">₹{cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className="w-full bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-black dark:bg-teal-600 dark:hover:bg-teal-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>
               <button onClick={clearCart} className="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:underline mt-4">
                  Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;