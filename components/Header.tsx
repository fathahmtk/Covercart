

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { LogoIcon } from './icons/LogoIcon';
import { HeartIcon } from './icons/HeartIcon';
import { SearchIcon } from './icons/SearchIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { Bars3Icon } from './icons/Bars3Icon';
import { SparklesIcon } from './icons/SparklesIcon';

interface HeaderProps {
  onCartClick: () => void;
  onWishlistClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onWishlistClick, searchQuery, onSearchChange }) => {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { // Cleanup on unmount
        document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleClearSearch = () => {
    onSearchChange(''); // Clear immediately
  };
  
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // If we are already on the home page, scroll to top. Otherwise, navigate to home.
    if (window.location.hash === '#/' || window.location.hash === '') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        window.location.hash = '#/';
    }
  };
  
  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      setIsMobileSearchOpen(false); // Close search when opening menu
    }
  };

  const openMobileSearch = () => {
    setIsMobileSearchOpen(true);
    setIsMobileMenuOpen(false); // Close menu when opening search
  };


  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[--color-bg-primary]/80 dark:bg-[--color-bg-primary]/80 backdrop-blur-xl border-b border-[--color-border]' : 'bg-transparent'}`}>
        <nav className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center relative">

          {/* --- Main Header Content --- */}
          <div className="flex items-center space-x-8">
              <a href="#/" onClick={handleLogoClick} className="flex items-center space-x-2 text-2xl font-bold text-[--color-text-primary]">
              <LogoIcon />
              <span style={{fontFamily: 'var(--font-heading)'}}>covercart.in</span>
              </a>
              <div className="hidden md:flex items-center space-x-6">
                  <a href="#products" className="text-[--color-text-secondary] hover:text-[--color-primary] transition-colors font-medium">Products</a>
                  <a href="#/gallery" className="text-[--color-text-secondary] hover:text-[--color-primary] transition-colors font-medium">Gallery</a>
                  <a href="#/ai-designer" className="flex items-center gap-1 text-[--color-primary] hover:text-[--color-primary-hover] transition-colors font-semibold">
                    <SparklesIcon className="w-4 h-4" />
                    AI Designer
                  </a>
              </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Desktop Search Bar */}
            <div className="relative hidden md:block group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="text-[--color-text-muted] group-focus-within:text-[--color-primary]" />
              </span>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-32 lg:w-48 py-2 pl-10 pr-10 text-sm text-[--color-text-primary] bg-[--color-bg-secondary] border border-[--color-border] rounded-full focus:border-[--color-primary] focus:ring-[--color-primary] focus:ring-opacity-40 focus:outline-none focus:ring-2 transition-all duration-300"
              />
              {searchQuery && (
                  <button onClick={handleClearSearch} className="absolute inset-y-0 right-0 flex items-center pr-3" aria-label="Clear search">
                      <XMarkIcon className="w-5 h-5 text-[--color-text-muted] hover:text-[--color-text-primary]"/>
                  </button>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button onClick={openMobileSearch} className="md:hidden text-[--color-text-secondary] hover:text-[--color-primary] transition-colors p-2 rounded-full hover:bg-[--color-bg-secondary]" aria-label="Open search">
              <SearchIcon className="w-6 h-6" />
            </button>
            
            <button onClick={toggleTheme} className="text-[--color-text-secondary] hover:text-amber-500 dark:hover:text-amber-400 transition-colors p-2 rounded-full hover:bg-[--color-bg-secondary]" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>

            <button onClick={onWishlistClick} className="relative text-[--color-text-secondary] hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-[--color-bg-secondary]">
              <HeartIcon className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button onClick={onCartClick} className="relative text-[--color-text-secondary] hover:text-[--color-primary] transition-colors p-2 rounded-full hover:bg-[--color-bg-secondary]">
              <ShoppingCartIcon className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            {/* Mobile Menu Button */}
            <button onClick={toggleMobileMenu} className="p-2 text-[--color-text-secondary] hover:text-[--color-primary] md:hidden rounded-full hover:bg-[--color-bg-secondary]" aria-label="Open menu" aria-expanded={isMobileMenuOpen}>
              <Bars3Icon className="w-7 h-7" />
            </button>
          </div>
          {/* --- End Main Header Content --- */}

          {/* --- Mobile Search Overlay --- */}
          {isMobileSearchOpen && (
            <div className="absolute inset-0 bg-[--color-bg-primary] flex items-center px-4 z-10">
              <span className="absolute inset-y-0 left-0 flex items-center pl-6">
                <SearchIcon className="text-[--color-text-muted] w-6 h-6" />
              </span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-full text-lg bg-transparent pl-12 pr-24 focus:outline-none text-[--color-text-primary]"
                autoFocus
              />
              {searchQuery && (
                  <button onClick={handleClearSearch} className="absolute right-14 text-[--color-text-muted] hover:text-[--color-text-primary]" aria-label="Clear search">
                      <XMarkIcon className="w-7 h-7" />
                  </button>
              )}
              <button onClick={() => setIsMobileSearchOpen(false)} className="absolute right-4 text-[--color-text-muted] hover:text-[--color-text-primary]" aria-label="Close search">
                <XMarkIcon className="w-7 h-7" />
              </button>
            </div>
          )}
          {/* --- End Mobile Search Overlay --- */}
        </nav>
      </header>
      {/* --- Mobile Menu Overlay --- */}
      <div className={`fixed inset-0 top-[65px] bg-[--color-bg-primary]/95 backdrop-blur-lg z-40 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {isMobileMenuOpen && (
              <div className="container mx-auto px-6 py-8 flex flex-col items-center space-y-8 animate-fade-in-up">
                  <a href="#products" onClick={handleMobileLinkClick} className="text-2xl font-semibold text-[--color-text-primary] hover:text-[--color-primary]">Products</a>
                  <a href="#/gallery" onClick={handleMobileLinkClick} className="text-2xl font-semibold text-[--color-text-primary] hover:text-[--color-primary]">Gallery</a>
                  <a href="#/ai-designer" onClick={handleMobileLinkClick} className="flex items-center gap-2 text-2xl font-semibold text-[--color-primary] hover:text-[--color-primary-hover]">
                    <SparklesIcon className="w-6 h-6" />
                    AI Designer
                  </a>
              </div>
          )}
      </div>
    </>
  );
};

export default Header;