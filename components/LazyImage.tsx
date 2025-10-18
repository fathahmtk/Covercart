import React, { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { PhotographIcon } from './icons/PhotographIcon';
import { ImageBrokenIcon } from './icons/ImageBrokenIcon';

interface LazyImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | Blob;
  placeholderClassName?: string;
  onLoad?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, placeholderClassName, onLoad, ...props }) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(containerRef, {});
  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    if (!isVisible || !src) {
      return;
    }
    
    // Reset states when src/visibility changes
    setIsLoaded(false);
    setIsError(false);

    let objectUrl: string | undefined;

    if (src instanceof Blob) {
      objectUrl = URL.createObjectURL(src);
      setImageSrc(objectUrl);
    } else {
      setImageSrc(src);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [isVisible, src]);
  
  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad();
    }
  };

  const handleImageError = () => {
    setIsError(true);
  };
  
  const showPlaceholder = !isLoaded && !isError;

  return (
    <div ref={containerRef} className={`relative overflow-hidden bg-gray-200 dark:bg-gray-800 ${placeholderClassName || className}`}>
      {showPlaceholder && (
        <div className={`absolute inset-0 flex items-center justify-center ${placeholderClassName || className}`}>
            <PhotographIcon className="w-1/4 h-1/4 text-gray-400 dark:text-gray-600 opacity-50" />
        </div>
      )}
      
      {isError && (
        <div className={`absolute inset-0 flex flex-col items-center justify-center text-gray-500 dark:text-gray-500 ${placeholderClassName || className}`}>
          <ImageBrokenIcon className="w-1/4 h-1/4 mb-2" />
          <span className="text-xs font-semibold">Could not load image</span>
        </div>
      )}
      
      {imageSrc && !isError && (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`${className} transition-all duration-500 ease-in-out ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'}`}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;