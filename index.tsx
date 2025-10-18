import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { ProductProvider } from './context/ProductContext';
import { UserGalleryProvider } from './context/UserGalleryContext';
import { ThemeProvider } from './context/ThemeContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ProductProvider>
        <ReviewsProvider>
          <UserGalleryProvider>
            <WishlistProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </WishlistProvider>
          </UserGalleryProvider>
        </ReviewsProvider>
      </ProductProvider>
    </ThemeProvider>
  </React.StrictMode>
);