
import React, { useEffect, useState, useCallback } from 'react';
import { XMarkIcon } from './icons/XMarkIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface LightboxProps {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToNext = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, goToNext, goToPrev]);

  if (!images || images.length === 0) return null;
  
  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80"
      style={{ animation: 'modal-fade-in 0.3s ease-out' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Previous Button */}
      {images.length > 1 && (
        <button
            onClick={(e) => { e.stopPropagation(); goToPrev(); }}
            className="absolute top-1/2 left-4 -translate-y-1/2 z-10 p-3 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/40 transition-all"
            aria-label="Previous image"
        >
            <ChevronLeftIcon className="w-8 h-8 text-white" />
        </button>
      )}

      <div
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        style={{ animation: 'modal-zoom-in 0.3s ease-out' }}
      >
        <img 
            key={currentImage} // Force re-render on image change for transition
            src={currentImage} 
            alt={`Full screen view ${currentIndex + 1} of ${images.length}`} 
            className="block max-w-full max-h-full rounded-lg shadow-2xl animate-fade-in" 
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
        />
      </div>

      {/* Next Button */}
      {images.length > 1 && (
          <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute top-1/2 right-4 -translate-y-1/2 z-10 p-3 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/40 transition-all"
              aria-label="Next image"
          >
              <ChevronRightIcon className="w-8 h-8 text-white" />
          </button>
      )}

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/30 text-white rounded-full p-2 hover:bg-white/50 transition-colors z-20"
        aria-label="Close image view"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm rounded-full px-3 py-1">
            {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default Lightbox;
