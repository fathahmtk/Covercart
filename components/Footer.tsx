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
              Style That Speaks. From runway trends to your own AI creations, find the perfect case that's uniquely you.
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
              <li><a href="#products" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">Products</a></li>
              <li><a href="#ai-designer" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">AI Designer</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">About Us</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider">Legal</h5>
            <ul className="mt-4 space-y-2">
              <li><a href="#/privacy" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#/terms" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#/refunds" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">Refund Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider">Contact Us</h5>
            <ul className="mt-4 space-y-2 text-sm">
                <li className="text-gray-400">{BUSINESS_INFO.address}</li>
                <li className="text-gray-400">
                    <a href={`tel:${BUSINESS_INFO.phone}`} className="hover:text-white hover:underline transition-colors">{BUSINESS_INFO.phone}</a>
                </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm">
          <p className="text-gray-400">&copy; {currentYear} {BUSINESS_INFO.name}. All Rights Reserved.</p>
           <div className="mt-4 space-x-4">
            <a href="#/admin" className="text-xs text-gray-500 hover:text-gray-300 hover:underline transition-colors">
                Admin Panel
            </a>
            <span className="text-gray-600">|</span>
            <button
                onClick={handleClearCache}
                className="text-xs text-gray-500 hover:text-gray-300 hover:underline transition-colors"
                title="Clears all locally stored app data."
            >
                Clear App Cache
            </button>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;