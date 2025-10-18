import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import AiDesigner from './components/AiDesigner';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import { Product } from './types';
import ProductDetailsPage from './components/ProductDetailsPage';
import AddProductModal from './components/AddProductModal';
import QuickViewModal from './components/QuickViewModal';

const App: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setViewingProduct(product);
    window.scrollTo(0, 0); // Scroll to top when viewing a product
  };

  const handleBackToList = () => {
    setViewingProduct(null);
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

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 font-sans antialiased">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main>
        {viewingProduct ? (
          <ProductDetailsPage product={viewingProduct} onBack={handleBackToList} />
        ) : (
          <>
            <Hero />
            <ProductList 
              searchQuery={searchQuery} 
              onProductClick={handleProductClick} 
              onAddProductClick={() => setIsAddProductModalOpen(true)}
              onQuickViewClick={handleQuickViewOpen}
            />
            <AiDesigner />
            <About />
            <Contact />
          </>
        )}
      </main>
      <Footer />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Wishlist isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      <AddProductModal isOpen={isAddProductModalOpen} onClose={() => setIsAddProductModalOpen(false)} />
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