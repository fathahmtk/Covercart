
import React from 'react';
import { BUSINESS_INFO } from '../constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleClearCache = () => {
    const isConfirmed = window.confirm(
      'Are you sure you want to clear all stored reviews data? This will also clear your current cart and wishlist. This action cannot be undone.'
    );
    if (isConfirmed) {
      // Clear reviews from localStorage
      localStorage.removeItem('covercart-reviews');
      
      // Inform the user and reload to clear in-memory state (cart, wishlist)
      alert('Application cache has been cleared. The page will now reload.');
      window.location.reload();
    }
  };

  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-white">
      <div className="container mx-auto px-6 py-6 text-center">
        <p>&copy; {currentYear} {BUSINESS_INFO.name}. All Rights Reserved.</p>
        <p className="text-sm text-gray-400">{BUSINESS_INFO.address}</p>
        <div className="mt-4">
          <button
            onClick={handleClearCache}
            className="text-xs text-gray-500 hover:text-gray-300 hover:underline transition-colors"
            title="Clears locally stored reviews, and resets cart and wishlist."
          >
            Clear App Cache
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
