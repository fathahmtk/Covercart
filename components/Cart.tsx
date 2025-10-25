

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { XMarkIcon } from './icons/XMarkIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { BUSINESS_INFO } from '../constants';
import { Order } from '../types';
import LazyImage from './LazyImage';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal } = useCart();
  const { addOrder } = useOrders();

  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [errors, setErrors] = useState<{ name?: string, mobile?: string, address?: string }>({});

  useEffect(() => {
    if (!isOpen) {
      // Reset form when cart closes
      setCustomerName('');
      setMobileNumber('');
      setDeliveryAddress('');
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: { name?: string, mobile?: string, address?: string } = {};
    if (!customerName.trim()) newErrors.name = 'Name is required.';
    if (!mobileNumber.trim()) {
        newErrors.mobile = 'Mobile number is required.';
    } else if (!/^\d{10}$/.test(mobileNumber.trim())) {
        newErrors.mobile = 'Please enter a valid 10-digit mobile number.';
    }
    if (!deliveryAddress.trim()) newErrors.address = 'Delivery address is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = () => {
    if (!validateForm()) {
        return;
    }

    const orderId = `${new Date().getTime()}`;
    const newOrder: Order = {
        id: orderId,
        customerName: customerName.trim(),
        mobileNumber: mobileNumber.trim(),
        deliveryAddress: deliveryAddress.trim(),
        items: cartItems,
        total: cartTotal,
        status: 'Pending',
        date: new Date().toISOString(),
    };

    addOrder(newOrder);

    const itemsSummary = cartItems
        .map(item => `${item.productName}${item.variantName ? ` (${item.variantName})` : ''} x ${item.quantity}`)
        .join('\n');
    
    const whatsappMessage = `Hello! I'd like to place an order (ID: ${orderId}):\n\n*Items:*\n${itemsSummary}\n\n*Total:* ₹${cartTotal}\n\n*Delivery Details:*\nName: ${customerName.trim()}\nMobile: ${mobileNumber.trim()}\nAddress: ${deliveryAddress.trim()}`;

    const whatsappUrl = `https://wa.me/${BUSINESS_INFO.phone.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    clearCart();
    onClose();
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

      {/* Cart Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 id="cart-heading" className="text-2xl font-bold text-gray-800 dark:text-white">Your Cart ({cartCount})</h2>
            <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white" aria-label="Close cart">
              <XMarkIcon />
            </button>
          </div>

          {/* Items */}
          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
              <ShoppingCartIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Your cart is empty</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Looks like you haven't added anything to your cart yet.</p>
              <button onClick={onClose} className="mt-6 bg-[--color-primary] text-white font-bold py-3 px-6 rounded-full hover:bg-[--color-primary-hover] transition-colors">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-6">
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.cartItemId} className="flex items-start space-x-4">
                    <LazyImage src={item.imageUrl} alt={item.productName} className="w-20 h-20 rounded-md object-cover" />
                    <div className="flex-grow">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">{item.productName}</h4>
                      {item.variantName && <p className="text-sm text-gray-500 dark:text-gray-400">{item.variantName}</p>}
                      <p className="text-sm text-gray-600 dark:text-gray-300 my-1">₹{item.price}</p>
                      <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-md w-fit">
                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label="Decrease quantity">
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label="Increase quantity">
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end h-full">
                       <p className="font-bold text-gray-800 dark:text-white mb-auto">₹{item.price * item.quantity}</p>
                       <button onClick={() => removeFromCart(item.cartItemId)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 mt-2 transition-colors" aria-label={`Remove ${item.productName} from cart`}>
                         <TrashIcon />
                       </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Details Form */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Delivery Details</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <input type="text" id="customerName" value={customerName} onChange={e => setCustomerName(e.target.value)} className="mt-1 input-style" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                   <div>
                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Number</label>
                    <input type="tel" id="mobileNumber" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} className="mt-1 input-style" />
                    {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                  </div>
                   <div>
                    <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Address</label>
                    <textarea id="deliveryAddress" rows={3} value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} className="mt-1 input-style" />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Subtotal</span>
                <span className="text-2xl font-bold text-gray-800 dark:text-white">₹{cartTotal}</span>
              </div>
              <button onClick={handleCheckout} className="w-full flex items-center justify-center bg-green-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-[1.02] shadow-lg hover:shadow-green-500/40">
                Proceed to Checkout
              </button>
              <button
                onClick={clearCart}
                className="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:underline mt-4"
              >
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