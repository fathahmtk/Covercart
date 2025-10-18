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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[--color-bg]/80 dark:bg-[--color-bg]/80 backdrop-blur-xl border-b border-[--color-border]/50 shadow-sm' : 'bg-transparent'}`}>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center relative">

        {/* --- Main Header Content --- */}
        <div className="flex items-center space-x-8">
            <a href="#/" onClick={handleLogoClick} className="flex items-center space-x-2 text-2xl font-bold text-[--color-text]">
            <LogoIcon />
            <span style={{fontFamily: 'var(--font-heading)'}}>CoverCart</span>
            </a>
            <div className="hidden md:flex items-center space-x-6">
                <a href="#products" className="text-[--color-text-muted] hover:text-[--color-primary] transition-colors font-medium">Products</a>
                <a href="#ai-designer" className="text-[--color-text-muted] hover:text-[--color-primary] transition-colors font-medium">AI Designer</a>
                <a href="#about" className="text-[--color-text-muted] hover:text-[--color-primary] transition-colors font-medium">About</a>
                <a href="#contact" className="text-[--color-text-muted] hover:text-[--color-primary] transition-colors font-medium">Contact</a>
            </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
           {/* Desktop Search Bar */}
           <div className="relative hidden md:block">
             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
               <SearchIcon className="text-gray-400" />
             </span>
             <input
               type="text"
               placeholder="Search..."
               value={searchQuery}
               onChange={(e) => onSearchChange(e.target.value)}
               className="w-32 lg:w-56 py-2 pl-10 pr-10 text-[--color-text] bg-white/50 border border-[--color-border] rounded-full dark:bg-gray-800 dark:border-gray-600 focus:border-[--color-primary] dark:focus:border-[--color-primary] focus:ring-[--color-primary] focus:ring-opacity-40 focus:outline-none focus:ring transition-all duration-300"
             />
             {searchQuery && (
                <button onClick={handleClearSearch} className="absolute inset-y-0 right-0 flex items-center pr-3" aria-label="Clear search">
                    <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"/>
                </button>
             )}
           </div>

           {/* Mobile Search Toggle */}
          <button onClick={() => setIsMobileSearchOpen(true)} className="md:hidden text-[--color-text-muted] hover:text-[--color-primary] transition-colors p-2" aria-label="Open search">
             <SearchIcon className="w-6 h-6" />
          </button>
          
          <button onClick={toggleTheme} className="text-[--color-text-muted] hover:text-amber-500 dark:hover:text-amber-400 transition-colors p-2" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
          </button>

          <button onClick={onWishlistClick} className="relative text-[--color-text-muted] hover:text-red-500 dark:hover:text-red-400 transition-colors p-1">
            <HeartIcon />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </button>
          <button onClick={onCartClick} className="relative text-[--color-text-muted] hover:text-[--color-primary] transition-colors p-1">
            <ShoppingCartIcon />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
        {/* --- End Main Header Content --- */}

        {/* --- Mobile Search Overlay --- */}
        {isMobileSearchOpen && (
          <div className="absolute inset-0 bg-[--color-bg] flex items-center px-4 z-10">
            <span className="absolute inset-y-0 left-0 flex items-center pl-6">
              <SearchIcon className="text-gray-400 w-6 h-6" />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-full text-lg bg-transparent pl-12 pr-24 focus:outline-none text-[--color-text]"
              autoFocus
            />
            {searchQuery && (
                <button onClick={handleClearSearch} className="absolute right-14 text-gray-500 hover:text-[--color-text]" aria-label="Clear search">
                    <XMarkIcon className="w-7 h-7" />
                </button>
            )}
            <button onClick={() => setIsMobileSearchOpen(false)} className="absolute right-4 text-gray-500 hover:text-[--color-text]" aria-label="Close search">
              <XMarkIcon className="w-7 h-7" />
            </button>
          </div>
        )}
        {/* --- End Mobile Search Overlay --- */}
      </nav>
    </header>
  );
};

export default Header;
