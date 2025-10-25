

import React, { useMemo, useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useUserGallery } from '../context/UserGalleryContext';
import Lightbox from './Lightbox';
import LazyImage from './LazyImage';
import AnimateOnScroll from './AnimateOnScroll';
// Fix: Import UserGalleryItem to use for explicit typing.
import { Product, UserGalleryItem } from '../types';
import { CameraIcon } from './icons/CameraIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { TagIcon } from './icons/TagIcon';

interface GalleryPageProps {
  onBack: () => void;
  onProductClick: (product: Product) => void;
}

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  productId: number;
  productName: string;
  type: 'product' | 'user';
}

const GalleryPage: React.FC<GalleryPageProps> = ({ onBack, onProductClick }) => {
  const { products, loading } = useProducts();
  const { galleryItems: userGalleryItemsByProduct } = useUserGallery();
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'product' | 'user'>('all');

  const allImages = useMemo<GalleryItem[]>(() => {
    const productImages: GalleryItem[] = [];
    products.forEach(product => {
      const uniqueImageUrls = new Set<string>();
      if (product.imageUrl) uniqueImageUrls.add(product.imageUrl);
      product.variants?.forEach(v => {
        if (v.imageUrl) uniqueImageUrls.add(v.imageUrl);
      });

      uniqueImageUrls.forEach(url => {
        productImages.push({
          id: `prod-${product.id}-${url}`,
          src: url,
          alt: product.name,
          productId: product.id,
          productName: product.name,
          type: 'product',
        });
      });
    });

    const userImages: GalleryItem[] = [];
    // Fix: Explicitly type `item` as `UserGalleryItem` to fix type inference issue.
    Object.values(userGalleryItemsByProduct).flat().forEach((item: UserGalleryItem) => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            userImages.push({
                id: `user-${item.id}`,
                src: item.imageUrl,
                alt: item.caption || `User photo for ${product.name}`,
                caption: item.caption,
                productId: item.productId,
                productName: product.name,
                type: 'user',
            });
        }
    });

    // Shuffle for a more dynamic look
    const combined = [...productImages, ...userImages];
    for (let i = combined.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    return combined;
  }, [products, userGalleryItemsByProduct]);

  const filteredImages = useMemo(() => {
    if (filter === 'all') return allImages;
    return allImages.filter(item => item.type === filter);
  }, [allImages, filter]);

  const findProductById = (id: number) => products.find(p => p.id === id);
  
  const openLightbox = (imageSrc: string, imageIndex: number) => {
    setLightboxImages(filteredImages.map(item => item.src));
    setLightboxInitialIndex(imageIndex);
    setIsLightboxOpen(true);
  };

  return (
    <>
      <div className="animate-fade-in bg-[--color-bg-subtle]">
        <div className="container mx-auto px-6 py-12">
          <a href="#/" onClick={(e) => { e.preventDefault(); onBack(); }} className="mb-8 inline-block text-[--color-primary] hover:text-[--color-primary-hover] hover:underline">
            &larr; Back to Home
          </a>
          
          <AnimateOnScroll className="fade-in-up text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-[--color-text]">Photo Gallery</h1>
            <p className="text-[--color-text-muted]">A showcase of our collection and styles from our amazing customers.</p>
          </AnimateOnScroll>

          <div className="flex justify-center gap-2 mb-8">
            <button onClick={() => setFilter('all')} className={`filter-button ${filter === 'all' ? 'active' : ''}`}>All Photos</button>
            <button onClick={() => setFilter('product')} className={`filter-button ${filter === 'product' ? 'active' : ''}`}>Our Collection</button>
            <button onClick={() => setFilter('user')} className={`filter-button ${filter === 'user' ? 'active' : ''}`}>Customer Photos</button>
          </div>

          {loading && <p>Loading images...</p>}

          {!loading && filteredImages.length === 0 && (
             <div className="text-center py-10">
                <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <h3 className="text-xl font-semibold">No Photos Yet</h3>
                <p className="text-[--color-text-muted] mt-1">Check back later to see our gallery.</p>
            </div>
          )}

          <div className="masonry-grid">
            {filteredImages.map((item, index) => (
              <AnimateOnScroll key={item.id} delay={index * 50} className="fade-in-up masonry-item group">
                <div className="relative overflow-hidden rounded-lg shadow-md cursor-pointer border border-[--color-border]" onClick={() => openLightbox(item.src, index)}>
                  <LazyImage src={item.src} alt={item.alt} className="w-full h-auto block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {item.type === 'user' && item.caption && (
                        <p className="text-white text-sm font-semibold flex items-center gap-2">
                           <UserCircleIcon className="w-5 h-5"/>
                           <span>{item.caption}</span>
                        </p>
                      )}
                      <button onClick={(e) => {
                          e.stopPropagation();
                          const product = findProductById(item.productId);
                          if (product) onProductClick(product);
                      }} className="text-teal-300 text-xs font-bold hover:underline flex items-center gap-1.5 mt-1">
                          <TagIcon className="w-4 h-4" />
                          <span>{item.productName}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
      {isLightboxOpen && <Lightbox images={lightboxImages} initialIndex={lightboxInitialIndex} onClose={() => setIsLightboxOpen(false)} />}
      <style>{`
        .masonry-grid {
          column-count: 2;
          column-gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .masonry-grid {
            column-count: 3;
          }
        }
         @media (min-width: 1024px) {
          .masonry-grid {
            column-count: 4;
          }
        }
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 1.5rem;
        }
        .filter-button {
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-weight: 500;
          font-size: 0.875rem;
          background-color: var(--color-bg);
          color: var(--color-text-muted);
          border: 1px solid var(--color-border);
          transition: all 0.2s;
        }
        .filter-button:hover {
          background-color: var(--color-bg-subtle);
          color: var(--color-text);
        }
        .filter-button.active {
          background-color: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
          box-shadow: var(--shadow-elevation-low);
        }
      `}</style>
    </>
  );
};

export default GalleryPage;