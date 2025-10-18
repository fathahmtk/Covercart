import { Product } from './types';

export const BUSINESS_INFO = {
  name: 'CoverCart',
  address: 'New Delhi, India',
  phone: '+91 12345 67890',
  whatsappMessage: "Hello! I'm interested in your phone cases.",
};

export const MOCK_PRODUCTS: Product[] = [
    { 
      id: 1, 
      name: 'Cosmic Voyager', 
      price: 499, 
      description: 'Explore the galaxy with this stunning cosmic design, featuring vibrant nebulae and distant stars.', 
      imageUrl: 'https://picsum.photos/seed/case1-v1/400/600', 
      category: 'Abstract',
      variants: [
        { id: 101, name: 'Nebula Blue', imageUrl: 'https://picsum.photos/seed/case1-v1/400/600', colorCode: '#4a5568' },
        { id: 102, name: 'Galaxy Black', imageUrl: 'https://picsum.photos/seed/case1-v2/400/600', colorCode: '#1a202c' },
        { id: 103, name: 'Stardust Purple', imageUrl: 'https://picsum.photos/seed/case1-v3/400/600', colorCode: '#553c9a' },
      ]
    },
    { 
      id: 2, 
      name: 'Marble Elegance', 
      price: 549, 
      description: 'A timeless white and gold marble pattern for a sophisticated and classic look.', 
      imageUrl: 'https://picsum.photos/seed/case2-v1/400/600', 
      category: 'Minimalist',
      variants: [
        { id: 201, name: 'White & Gold', imageUrl: 'https://picsum.photos/seed/case2-v1/400/600', colorCode: '#f7fafc' },
        { id: 202, name: 'Black & Silver', imageUrl: 'https://picsum.photos/seed/case2-v2/400/600', colorCode: '#2d3748' },
      ]
    },
    { id: 3, name: 'Retro Sunset', price: 499, description: 'A vibrant synthwave-inspired design with a retro sunset over a digital landscape.', imageUrl: 'https://picsum.photos/seed/case3/400/600', category: 'Retro' },
    { id: 4, name: 'Botanical Bliss', price: 529, description: 'A beautiful and intricate pattern of lush green leaves and tropical flowers.', imageUrl: 'https://picsum.photos/seed/case4/400/600', category: 'Nature' },
    { id: 5, name: 'Geometric Prism', price: 479, description: 'A modern and sharp design featuring a colorful array of geometric shapes.', imageUrl: 'https://picsum.photos/seed/case5/400/600', category: 'Abstract' },
    { id: 6, name: 'Stealth Carbon', price: 599, description: 'A sleek and durable carbon fiber design for a modern, high-tech aesthetic.', imageUrl: 'https://picsum.photos/seed/case6/400/600', category: 'Minimalist' },
    { id: 7, name: 'Ocean Waves', price: 519, description: 'Calming and beautiful depiction of swirling ocean waves in shades of blue.', imageUrl: 'https://picsum.photos/seed/case7/400/600', category: 'Nature' },
    { id: 8, name: 'Gamer Grid', price: 499, description: 'A neon grid pattern perfect for gamers, glowing with electric energy.', imageUrl: 'https://picsum.photos/seed/case8/400/600', category: 'Retro' },
    { id: 9, name: 'Pastel Dreams', price: 499, description: 'A soft and dreamy design with a blend of pastel colors in a watercolor style.', imageUrl: 'https://picsum.photos/seed/case9/400/600', category: 'Abstract' },
    { id: 10, name: 'Wild Leopard', price: 539, description: 'A chic and trendy leopard print pattern for a bold fashion statement.', imageUrl: 'https://picsum.photos/seed/case10/400/600', category: 'Patterns' },
    { id: 11, name: 'Mountain Peak', price: 529, description: 'An inspiring silhouette of a mountain range against a starry night sky.', imageUrl: 'https://picsum.photos/seed/case11/400/600', category: 'Nature' },
    { id: 12, name: 'Zen Garden', price: 499, description: 'A minimalist Japanese-inspired design featuring sand ripples and a single stone.', imageUrl: 'https://picsum.photos/seed/case12/400/600', category: 'Minimalist' },
];

export const CATEGORIES = ['All', 'Abstract', 'Minimalist', 'Nature', 'Retro', 'Patterns'];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Alphabetically: A-Z' },
  { value: 'name-desc', label: 'Alphabetically: Z-A' },
];