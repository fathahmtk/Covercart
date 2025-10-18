
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
import { useSEO } from './hooks/useSEO';
import { BUSINESS_INFO } from './constants';
import ProductDetailsSkeleton from './components/ProductDetailsSkeleton';
import { ToastContainer } from './components/ToastProvider';
import OrderHistoryPage from './components/OrderHistoryPage';

const App: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Debounce the search query
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');
  const { products, loading } = useProducts();

  // Default SEO for the entire app / home page
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "covercove.com",
    "url": window.location.origin,
    "logo": `${window.location.origin}/vite.svg`, // Assuming vite.svg is the logo
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": BUSINESS_INFO.phone,
      "contactType": "customer service"
    }
  };

  useSEO({
    title: 'covercove.com - Designer Mobile Covers and Cases',
    description: 'Discover a stunning collection of mobile covers. High-quality cases for Apple, Samsung, Google, and more.',
    keywords: 'mobile cover, phone case, designer phone case, custom phone case, samsung case, apple iphone cover',
    schema: organizationSchema,
  });


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
      if (loading) {
        return <ProductDetailsSkeleton />;
      }
      const productId = parseInt(currentPath.split('/')[2], 10);
      const product = products.find(p => p.id === productId);
      if (product) {
        return (
          <ProductDetailsPage 
            product={product} 
            onBack={handleBackToList} 
            onProductClick={handleProductClick}
            onQuickViewClick={handleQuickViewOpen}
          />
        );
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

    if (currentPath === '#/orders') {
      return <OrderHistoryPage onBack={handleBackToList} />;
    }

    // Default to home page
    return (
      <HomePage 
        searchQuery={debouncedSearchQuery}
        onProductClick={handleProductClick}
        onQuickViewClick={handleQuickViewOpen}
      />
    );
  }, [currentPath, products, debouncedSearchQuery, loading]);

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
      <ToastContainer />
    </div>
  );
};

export default App;