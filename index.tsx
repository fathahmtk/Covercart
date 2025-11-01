
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
import { HeroProvider } from './context/HeroContext';
import { CategoryProvider } from './context/CategoryContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <CategoryProvider>
          <ProductProvider>
            <ReviewsProvider>
              <UserGalleryProvider>
                <CartProvider>
                  <WishlistProvider>
                    <OrderProvider>
                      <HeroProvider>
                        <App />
                      </HeroProvider>
                    </OrderProvider>
                  </WishlistProvider>
                </CartProvider>
              </UserGalleryProvider>
            </ReviewsProvider>
          </ProductProvider>
        </CategoryProvider>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
);
