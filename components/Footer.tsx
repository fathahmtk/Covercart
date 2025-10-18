import React from 'react';
import { BUSINESS_INFO } from '../constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleClearCache = () => {
    const isConfirmed = window.confirm(
      'Are you sure you want to clear all app data? This will remove all products, reviews, cart, and wishlist items from your local storage. This action cannot be undone.'
    );
    if (isConfirmed) {
      localStorage.removeItem('covercart-reviews');
      localStorage.removeItem('covercart-products');
      localStorage.removeItem('covercart-cart');
      localStorage.removeItem('covercart-wishlist');
      localStorage.removeItem('covercart-user-gallery');
      sessionStorage.removeItem('isAdminAuthenticated');

      alert('Application cache has been cleared. The page will now reload.');
      window.location.reload();
    }
  };

  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-white">
      <div className="container mx-auto px-6 py-6 text-center">
        <p>&copy; {currentYear} {BUSINESS_INFO.name}. All Rights Reserved.</p>
        <p className="text-sm text-gray-400">{BUSINESS_INFO.address}</p>
        <div className="mt-4 space-x-4">
          <a href="#/admin" className="text-xs text-gray-500 hover:text-gray-300 hover:underline transition-colors">
            Admin Panel
          </a>
          <button
            onClick={handleClearCache}
            className="text-xs text-gray-500 hover:text-gray-300 hover:underline transition-colors"
            title="Clears all locally stored app data."
          >
            Clear App Cache
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
