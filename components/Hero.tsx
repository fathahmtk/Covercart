
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

const heroImages = [
  {
    id: '1603715454235-5026f12204a1',
    alt: 'A stylish phone with an elegant white and gold marble case.'
  },
  {
    id: '1512499617640-b74ae3e7db25',
    alt: 'A stylish flat lay with a phone in a case, sunglasses, and notebook on a pink background.'
  },
  {
    id: '1574281591321-4f68a2d1e1c9',
    alt: 'A phone with a vibrant synthwave retro sunset case.'
  },
  {
    id: '1610792516307-ea5acd9c3b00',
    alt: 'A person holding a phone with a modern, artistic case against a textured wall.'
  },
  {
    id: '1599582301353-53303c621122',
    alt: 'A close-up of a sleek and modern carbon fiber phone case.'
  }
];

const generateSrcSet = (id: string) => {
  const baseUrl = `https://images.unsplash.com/photo-${id}`;
  const params = `q=80&auto=format&fit=crop`;
  const widths = [640, 768, 1024, 1280, 1536, 1920, 2070];
  return widths.map(w => `${baseUrl}?${params}&w=${w} ${w}w`).join(', ');
};

const Hero: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> for browser compatibility.
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const AUTOPLAY_DELAY = 5000;

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const goToNext = useCallback(() => {
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % heroImages.length);
  }, []);

  const goToPrev = () => {
    setCurrentImageIndex(prevIndex => (prevIndex - 1 + heroImages.length) % heroImages.length);
  };
  
  const goToSlide = (slideIndex: number) => {
    setCurrentImageIndex(slideIndex);
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(goToNext, AUTOPLAY_DELAY);
    return () => resetTimeout();
  }, [currentImageIndex, goToNext]);

  return (
    <section 
      className="relative h-screen text-white flex items-center justify-center overflow-hidden group"
      aria-roledescription="carousel"
      aria-label="Hero section with stylish phone cases"
    >
      <div 
        className="absolute inset-0 z-0 flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
      >
         {heroImages.map((image, index) => {
            const defaultSrc = `https://images.unsplash.com/photo-${image.id}?q=80&auto=format&fit=crop&w=1920`;
            return (
              <div
                key={image.id}
                className="relative w-full h-full flex-shrink-0"
                aria-hidden={index !== currentImageIndex}
                aria-roledescription="slide"
              >
                  <img 
                      src={defaultSrc}
                      srcSet={generateSrcSet(image.id)}
                      sizes="100vw"
                      alt={image.alt}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      // @ts-ignore
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                      className="w-full h-full object-cover object-center animate-ken-burns"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" aria-hidden="true"></div>
              </div>
            );
         })}
      </div>
      
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="opacity-0 animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-4xl md:text-7xl font-extrabold leading-tight mb-4 drop-shadow-lg tracking-tight">
              Style That Speaks.
            </h1>
        </div>
        <div className="opacity-0 animate-slide-in-bottom" style={{ animationDelay: '0.5s' }}>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-md font-light text-gray-200">
              From runway trends to timeless classics, find the perfect case that's uniquely you.
            </p>
        </div>
        <div className="opacity-0 animate-slide-in-bottom flex flex-wrap justify-center gap-4" style={{ animationDelay: '0.8s' }}>
          <a 
            href="#products" 
            className="bg-white text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg"
          >
            Explore Collection
          </a>
        </div>
      </div>
      
      {/* Navigation Arrows */}
      <button 
        onClick={goToPrev}
        className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 z-20 p-3 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="w-6 h-6 md:w-8 md:h-8" />
      </button>
      <button 
        onClick={goToNext}
        className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 z-20 p-3 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {heroImages.map((_, index) => (
          <button 
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentImageIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentImageIndex}
          />
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <a href="#products" aria-label="Scroll down to products">
           <ChevronDownIcon className="w-8 h-8 text-white/70 animate-bounce-slow" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
