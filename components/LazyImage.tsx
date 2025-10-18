import React, { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

// Fix: Omitted 'src' from ImgHTMLAttributes and defined it to accept string or Blob.
interface LazyImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | Blob;
  placeholderClassName?: string;
  onLoad?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, placeholderClassName, onLoad, ...props }) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(containerRef, {});
  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    if (isVisible && !imageSrc) {
      // Fix: Improved type checking to handle string and Blob sources explicitly.
      // This ensures that only a string (either the original src or a new object URL)
      // is passed to setImageSrc, resolving the type error.
      if (typeof src === 'string') {
        setImageSrc(src);
      } else if (src instanceof Blob) {
        setImageSrc(URL.createObjectURL(src));
      }
    }
  }, [isVisible, src, imageSrc]);
  
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) {
        onLoad();
    }
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${placeholderClassName || className}`}>
      {/* Skeleton placeholder */}
      {!isLoaded && (
        <div className={`absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse ${placeholderClassName || className}`} />
      )}
      
      {/* Actual image */}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleImageLoad}
        className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
    </div>
  );
};

export default LazyImage;
