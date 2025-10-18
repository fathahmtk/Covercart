import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import { Product } from './types';
import ProductDetailsPage from './components/ProductDetailsPage';
import QuickViewModal from './components/QuickViewModal';
import HomePage from './components/HomePage';
import AdminPanel from './components/admin/AdminPanel';
import { useProducts } from './context/ProductContext';
import { useDebounce } from './hooks/useDebounce';
import PrivacyPolicyPage from './components/legal/PrivacyPolicyPage';
import TermsOfServicePage from './components/legal/TermsOfServicePage';
import RefundPolicyPage from './components/legal/RefundPolicyPage';

const App: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Debounce the search query
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');
  const { products } = useProducts();

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleProductClick = (product: Product) => {
    window.location.hash = `#/product/${product.id}`;
  };

  const handleBackToList = () => {
    window.location.hash = '#/';
  };
  
  const handleQuickViewOpen = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleQuickViewClose = () => {
    setQuickViewProduct(null);
  };

  const handleViewFullDetails = (product: Product) => {
    handleQuickViewClose();
    handleProductClick(product);
  };

  const renderedPage = useMemo(() => {
    if (currentPath.startsWith('#/product/')) {
      const productId = parseInt(currentPath.split('/')[2], 10);
      const product = products.find(p => p.id === productId);
      if (product) {
        return <ProductDetailsPage product={product} onBack={handleBackToList} />;
      }
      // Fallback if product not found
      window.location.hash = '#/';
      return null;
    }

    if (currentPath === '#/admin') {
      return <AdminPanel />;
    }
    
    if (currentPath === '#/privacy') {
      return <PrivacyPolicyPage onBack={handleBackToList} />;
    }
    
    if (currentPath === '#/terms') {
      return <TermsOfServicePage onBack={handleBackToList} />;
    }
    
    if (currentPath === '#/refunds') {
      return <RefundPolicyPage onBack={handleBackToList} />;
    }

    // Default to home page
    return (
      <HomePage 
        searchQuery={debouncedSearchQuery}
        onProductClick={handleProductClick}
        onQuickViewClick={handleQuickViewOpen}
      />
    );
  }, [currentPath, products, debouncedSearchQuery]);

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 font-sans antialiased">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main>
        {renderedPage}
      </main>
      <Footer />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Wishlist isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      <QuickViewModal 
        isOpen={!!quickViewProduct} 
        onClose={handleQuickViewClose} 
        product={quickViewProduct} 
        onViewFullDetails={handleViewFullDetails}
      />
    </div>
  );
};

export default App;