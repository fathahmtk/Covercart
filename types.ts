export interface ProductVariant {
  id: number;
  name: string;
  imageUrl: string;
  colorCode: string;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  brand: string;
  isFeatured?: boolean;
  variants?: ProductVariant[];
  stock?: number;
}

export interface CartItem {
  cartItemId: string;
  productId: number;
  productName: string;
  variantId?: number;
  variantName?: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  mobileNumber: string;
  deliveryAddress: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
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