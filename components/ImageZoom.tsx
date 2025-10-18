import React, { useState, useRef, useEffect } from 'react';
import LazyImage from './LazyImage';

interface ImageZoomProps {
  imageUrl: string;
  alt: string;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ imageUrl, alt }) => {
  const [showZoom, setShowZoom] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Start at center
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset loaded state when image url changes
  useEffect(() => {
    setIsImageLoaded(false);
  }, [imageUrl]);

  const calculatePosition = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    container: HTMLDivElement
  ) => {
    const { left, top, width, height } = container.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      if (e.touches.length === 0) return position; // Keep last position if touch ends
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - left;
    const y = clientY - top;

    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;

    // Clamp values to be within 0-100 range
    return {
      x: Math.max(0, Math.min(xPercent, 100)),
      y: Math.max(0, Math.min(yPercent, 100)),
    };
  };

  const handleMove = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (!containerRef.current || !showZoom) return;
    if ('preventDefault' in e) {
        e.preventDefault(); // Prevent page scroll on touch
    }
    setPosition(calculatePosition(e, containerRef.current));
  };

  const handleEnter = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (isImageLoaded) {
      if ('preventDefault' in e) {
        e.preventDefault();
      }
      setShowZoom(true);
      if(containerRef.current) {
         setPosition(calculatePosition(e, containerRef.current));
      }
    }
  };

  const handleLeave = () => {
    setShowZoom(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-lg border dark:border-gray-700 ${isImageLoaded ? (showZoom ? 'cursor-move' : 'cursor-zoom-in') : 'cursor-wait'}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      onTouchStart={handleEnter}
      onTouchEnd={handleLeave}
      onTouchCancel={handleLeave}
      onTouchMove={handleMove}
    >
      <LazyImage
        key={imageUrl}
        src={imageUrl}
        alt={alt}
        className="w-full h-auto object-cover transition-transform duration-200 ease-out"
        placeholderClassName="w-full h-auto"
        style={{
          aspectRatio: '1/1.5',
          transform: showZoom ? 'scale(3)' : 'scale(1)', // Increased zoom level
          transformOrigin: `${position.x}% ${position.y}%`,
        }}
        onLoad={() => setIsImageLoaded(true)}
      />
       {/* Loading Spinner */}
      {!isImageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-white"></div>
        </div>
      )}
       {/* UI Hint for interactivity on desktop */}
       <div 
        className={`absolute top-4 right-4 bg-black/40 text-white text-xs rounded-full px-3 py-1 pointer-events-none transition-opacity duration-300 hidden md:flex items-center gap-1.5 ${showZoom || !isImageLoaded ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden="true"
        >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
        <span>Hover to zoom</span>
      </div>
    </div>
  );
};

export default ImageZoom;
