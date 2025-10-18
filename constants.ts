import { Product } from './types';

export const BUSINESS_INFO = {
  name: 'CoverCart',
  address: 'Kerala, India',
  phone: '+91 96334 94381',
  whatsappMessage: "Hello! I'm interested in your phone cases.",
};

export const MOCK_PRODUCTS: Product[] = [
    { 
      id: 1, 
      name: 'Cosmic Voyager Case for Galaxy S24', 
      price: 499, 
      description: 'Explore the galaxy with this stunning cosmic design, featuring vibrant nebulae and distant stars on a durable Samsung case.', 
      imageUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=800&auto=format&fit=crop', 
      category: 'Samsung',
      brand: 'Samsung',
      variants: [
        { id: 101, name: 'Nebula Blue', imageUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=800&auto=format&fit=crop', colorCode: '#4a5568', stock: 15 },
        { id: 102, name: 'Galaxy Black', imageUrl: 'https://images.unsplash.com/photo-1532309149036-7648ba6f31eb?q=80&w=800&auto=format&fit=crop', colorCode: '#1a202c', stock: 0 },
        { id: 103, name: 'Stardust Purple', imageUrl: 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?q=80&w=800&auto=format&fit=crop', colorCode: '#553c9a', stock: 8 },
      ]
    },
    { 
      id: 2, 
      name: 'Marble Elegance Cover for iPhone 15 Pro', 
      price: 549, 
      description: 'A timeless white and gold marble pattern for a sophisticated and classic look. The perfect elegant case for your Apple iPhone.', 
      imageUrl: 'https://images.unsplash.com/photo-1603715454235-5026f12204a1?q=80&w=800&auto=format&fit=crop', 
      category: 'Apple',
      brand: 'Apple',
      variants: [
        { id: 201, name: 'White & Gold', imageUrl: 'https://images.unsplash.com/photo-1603715454235-5026f12204a1?q=80&w=800&auto=format&fit=crop', colorCode: '#f7fafc', stock: 22 },
        { id: 202, name: 'Black & Silver', imageUrl: 'https://images.unsplash.com/photo-1596723298623-7a7625103a49?q=80&w=800&auto=format&fit=crop', colorCode: '#2d3748', stock: 12 },
      ]
    },
    { id: 3, name: 'Retro Sunset Case for Pixel 8', price: 499, description: 'A vibrant synthwave-inspired design with a retro sunset over a digital landscape. Ideal for Google Pixel phones.', imageUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=800&auto=format&fit=crop', category: 'Google', brand: 'Google', stock: 5 },
    { id: 4, name: 'Botanical Bliss Cover for OnePlus 12', price: 529, description: 'A beautiful and intricate pattern of lush green leaves and tropical flowers for your OnePlus phone.', imageUrl: 'https://images.unsplash.com/photo-1615839366679-27b8f2a49339?q=80&w=800&auto=format&fit=crop', category: 'OnePlus', brand: 'OnePlus', stock: 30 },
    { id: 5, name: 'Geometric Prism Case for Xiaomi 14', price: 479, description: 'A modern and sharp design featuring a colorful array of geometric shapes. A unique cover for Xiaomi phones.', imageUrl: 'https://images.unsplash.com/photo-1620421680383-3052a353351d?q=80&w=800&auto=format&fit=crop', category: 'Xiaomi', brand: 'Xiaomi', stock: 0 },
    { id: 6, name: 'Stealth Carbon Cover for iPhone 15', price: 599, description: 'A sleek and durable carbon fiber design for a modern, high-tech aesthetic. Premium protection for your Apple iPhone.', imageUrl: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?q=80&w=800&auto=format&fit=crop', category: 'Apple', brand: 'Apple', stock: 18 },
    { id: 7, name: 'Ocean Waves Case for Galaxy S24 Ultra', price: 519, description: 'Calming and beautiful depiction of swirling ocean waves in shades of blue. A perfect phone case for your Samsung Galaxy.', imageUrl: 'https://images.unsplash.com/photo-1546953304-5d94e27e12f2?q=80&w=800&auto=format&fit=crop', category: 'Samsung', brand: 'Samsung', stock: 3 },
    { id: 8, name: 'Gamer Grid Cover for Pixel 8 Pro', price: 499, description: 'A neon grid pattern perfect for gamers, glowing with electric energy. Light up your Google Pixel.', imageUrl: 'https://images.unsplash.com/photo-1603366615917-e213e0941bbd?q=80&w=800&auto=format&fit=crop', category: 'Google', brand: 'Google', stock: 25 },
    { id: 9, name: 'Pastel Dreams Case for OnePlus 11R', price: 499, description: 'A soft and dreamy design with a blend of pastel colors in a watercolor style for your OnePlus phone.', imageUrl: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=800&auto=format&fit=crop', category: 'OnePlus', brand: 'OnePlus', stock: 11 },
    { id: 10, name: 'Wild Leopard Cover for Redmi Note 13', price: 539, description: 'A chic and trendy leopard print pattern for a bold fashion statement on your Xiaomi phone.', imageUrl: 'https://images.unsplash.com/photo-1611252391258-393f9b3e1577?q=80&w=800&auto=format&fit=crop', category: 'Xiaomi', brand: 'Xiaomi', stock: 9 },
    { id: 11, name: 'Mountain Peak Case for Galaxy A55', price: 529, description: 'An inspiring silhouette of a mountain range against a starry night sky. Protect your Samsung phone in style.', imageUrl: 'https://images.unsplash.com/photo-1482862602821-edeff3a0172e?q=80&w=800&auto=format&fit=crop', category: 'Samsung', brand: 'Samsung', stock: 0 },
    { id: 12, name: 'Zen Garden Cover for iPhone 14 Pro Max', price: 499, description: 'A minimalist Japanese-inspired design featuring sand ripples and a single stone. A peaceful case for your Apple iPhone.', imageUrl: 'https://images.unsplash.com/photo-1593333464830-5b1b42b6a7a8?q=80&w=800&auto=format&fit=crop', category: 'Apple', brand: 'Apple', stock: 40 },
];

export const CATEGORIES = ['All', 'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi'];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Alphabetically: A-Z' },
  { value: 'name-desc', label: 'Alphabetically: Z-A' },
];