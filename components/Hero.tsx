

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { useHero } from '../context/HeroContext';
import LazyImage from './LazyImage';

const Hero: React.FC = () => {
  const { heroImages } = useHero();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const AUTOPLAY_DELAY = 5000;

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const goToNext = useCallback(() => {
    if (heroImages.length === 0) return;
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % heroImages.length);
  }, [heroImages.length]);

  const goToPrev = () => {
    if (heroImages.length === 0) return;
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
  
  if (heroImages.length === 0) {
      return (
          <section className="relative h-screen bg-gray-800 text-white flex items-center justify-center">
              <div className="text-center">
                  <h1 className="text-4xl font-bold">Welcome to covercart.in</h1>
                  <p className="mt-4">Admin: Please add images to the hero section in the admin panel.</p>
              </div>
          </section>
      );
  }

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
         {heroImages.map((image, index) => (
              <div
                key={image.id}
                className="relative w-full h-full flex-shrink-0"
                aria-hidden={index !== currentImageIndex}
                aria-roledescription="slide"
              >
                  <LazyImage
                      src={image.url}
                      alt={image.alt}
                      // @ts-ignore
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                      className="w-full h-full object-cover object-center animate-ken-burns"
                      placeholderClassName="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" aria-hidden="true"></div>
              </div>
            ))}
      </div>
      
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto bg-black/30 backdrop-blur-md p-8 rounded-2xl">
            <div className="opacity-0 animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
                <h1 className="text-4xl md:text-7xl font-extrabold leading-tight mb-4 drop-shadow-xl tracking-tight">
                Style That Speaks.
                </h1>
            </div>
            <div className="opacity-0 animate-slide-in-bottom" style={{ animationDelay: '0.5s' }}>
                <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-lg font-light text-gray-200">
                From runway trends to timeless classics, find the perfect case that's uniquely you.
                </p>
            </div>
            <div className="opacity-0 animate-slide-in-bottom flex flex-wrap justify-center gap-4" style={{ animationDelay: '0.8s' }}>
              <a 
                href="#products" 
                className="bg-[--color-primary] text-[--color-primary-text] font-bold py-4 px-10 rounded-full hover:bg-[--color-primary-hover] transition-all transform hover:scale-105 shadow-lg text-lg"
              >
                Explore Collection
              </a>
            </div>
        </div>
      </div>
      
      {/* Navigation Arrows */}
      <button 
        onClick={goToPrev}
        className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 z-20 p-3 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="w-6 h-6 md:w-8 md:h-8" />
      </button>
      <button 
        onClick={goToNext}
        className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 z-20 p-3 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
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