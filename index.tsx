import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { UserGalleryProvider } from './context/UserGalleryContext';
import { OrderProvider } from './context/OrderContext';
import { ToastProvider } from './components/ToastProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <ProductProvider>
          <ReviewsProvider>
            <UserGalleryProvider>
              <CartProvider>
                <WishlistProvider>
                  <OrderProvider>
                    <App />
                  </OrderProvider>
                </WishlistProvider>
              </CartProvider>
            </UserGalleryProvider>
          </ReviewsProvider>
        </ProductProvider>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
);