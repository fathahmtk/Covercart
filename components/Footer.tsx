
import React from 'react';
import { BUSINESS_INFO } from '../constants';
import { LogoIcon } from './icons/LogoIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.phone.replace(/\D/g, '')}?text=${encodeURIComponent(BUSINESS_INFO.whatsappMessage)}`;


  const handleClearCache = () => {
    const isConfirmed = window.confirm(
      'Are you sure you want to clear all app data? This will remove all products, reviews, cart, and wishlist items from your local storage. This action cannot be undone.'
    );
    if (isConfirmed) {
      localStorage.removeItem('covercove-reviews');
      localStorage.removeItem('covercove-products');
      localStorage.removeItem('covercove-cart');
      localStorage.removeItem('covercove-wishlist');
      localStorage.removeItem('covercove-user-gallery');
      localStorage.removeItem('covercove-orders');
      sessionStorage.removeItem('isAdminAuthenticated');

      alert('Application cache has been cleared. The page will now reload.');
      window.location.reload();
    }
  };

  return (
    <footer className="bg-gray-800 dark:bg-slate-900 text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 lg:col-span-1">
             <a href="#/" className="flex items-center space-x-2 text-2xl font-bold text-white">
                <LogoIcon />
                <span style={{fontFamily: 'var(--font-heading)'}}>{BUSINESS_INFO.name}</span>
            </a>
            <p className="mt-4 text-sm text-gray-400">
              Style That Speaks. From runway trends to timeless classics, find the perfect case that's uniquely you.
            </p>
            <div className="flex space-x-4 mt-6">
                <a href="https://www.facebook.com/share/1BkAG3Qvm8/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                    <FacebookIcon className="w-6 h-6"/>
                </a>
                <a href="https://www.instagram.com/covercart_in?igsh=MW95ODFnNDFqaTdibw==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                    <InstagramIcon />
                </a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="WhatsApp">
                    <WhatsAppIcon className="w-6 h-6"/>
                </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider">Quick Links</h5>
            <ul className="mt-4 space-y-2">
              <li><a href="#products" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">Collection</a></li>
              <li><a href="#/gallery" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">Gallery</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">About Us</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider">Customer Service</h5>
            <ul className="mt-4 space-y-2">
              <li><a href="#/orders" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">Order Tracking</a></li>
              <li><a href="#/privacy" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#/terms" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#/refunds" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">Refund Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider">Stay Updated</h5>
            <p className="mt-4 text-sm text-gray-400">
              Get the latest news and special offers. (No spam, we promise!)
            </p>
            <form className="mt-4 flex">
              <input type="email" placeholder="Your email" className="w-full px-4 py-2 rounded-l-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
              <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-r-md transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} {BUSINESS_INFO.name}. All Rights Reserved.</p>
           <button onClick={handleClearCache} className="mt-4 text-xs text-gray-500 hover:text-gray-300 hover:underline">
             Clear Application Cache
           </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
