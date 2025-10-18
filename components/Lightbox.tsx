import React, { useEffect } from 'react';
import { XMarkIcon } from './icons/XMarkIcon';

interface LightboxProps {
  imageUrl: string;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ imageUrl, onClose }) => {
  useEffect(() => {
    // Handle Escape key to close the lightbox
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      style={{ animation: 'modal-fade-in 0.3s ease-out' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative max-w-[90vw] max-h-[90vh]"
        style={{ animation: 'modal-zoom-in 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
      >
        <img src={imageUrl} alt="Full screen view" className="block max-w-full max-h-full rounded-lg shadow-2xl" />
        
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white/30 text-white rounded-full p-2 hover:bg-white/50 transition-colors"
          aria-label="Close image view"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Lightbox;