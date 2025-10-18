export interface ProductVariant {
  id: number;
  name: string; // e.g., "Galaxy Black"
  imageUrl: string;
  colorCode: string; // e.g., "#000000"
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string; // Default image
  category: string;
  variants?: ProductVariant[];
}

export interface CartItem {
  cartItemId: string; // Unique identifier, e.g., "1-101" for product 1, variant 101
  productId: number;
  productName: string;
  variantId?: number;
  variantName?: string;
  price: number;
  imageUrl: string; // Variant or main product image
  quantity: number;
}

export interface Review {
  id: string;
  productId: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface UserGalleryItem {
  id: string;
  productId: number;
  imageUrl: string;
  caption?: string;
  date: string;
}