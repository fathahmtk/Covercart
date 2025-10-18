import React, { useState, useRef, useEffect } from 'react';
import LazyImage from './LazyImage';

interface ImageZoomProps {
  imageUrl: string;
  alt: string;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ imageUrl, alt }) => {
  const [showZoom, setShowZoom] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset loaded state when image url changes so zoom doesn't activate on a stale image
  useEffect(() => {
    setIsImageLoaded(false);
  }, [imageUrl]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Calculate position relative to the container
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Calculate mouse position as a percentage
    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;

    setMousePosition({ x: xPercent, y: yPercent });
  };

  const handleMouseEnter = () => {
    // Only enable zoom on larger screens AND after the image has loaded
    if (window.innerWidth >= 1024 && isImageLoaded) { 
        setShowZoom(true);
    }
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full cursor-crosshair overflow-hidden rounded-lg border dark:border-gray-700"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <LazyImage
        key={imageUrl} // key is important here to re-trigger component on src change
        src={imageUrl}
        alt={alt}
        className="w-full h-auto object-cover transition-transform duration-200 ease-out"
        placeholderClassName="w-full h-auto"
        style={{ 
            aspectRatio: '1/1.5',
            transform: showZoom ? 'scale(2.5)' : 'scale(1)',
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
        }}
        onLoad={() => setIsImageLoaded(true)}
      />
    </div>
  );
};

export default ImageZoom;