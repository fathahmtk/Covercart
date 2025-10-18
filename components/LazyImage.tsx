import React, { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
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
      setImageSrc(src);
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
