
import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

const heroImages = [
  {
    id: '1614214211420-565b8a07b713',
    alt: 'A phone with a stylish pastel geometric case placed on a pink surface'
  },
  {
    id: '1596723298623-7a7625103a49',
    alt: 'A phone with an elegant black and silver marble case'
  },
  {
    id: '1579546929518-9e396f3cc809',
    alt: 'A vibrant and colorful gradient phone case design'
  },
  {
    id: '1620421680383-3052a353351d',
    alt: 'A phone case with a sharp geometric prism design in bright colors'
  },
  {
    id: '1557672172-298e090bd0f1',
    alt: 'A phone case with a retro synthwave sunset design'
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      className="relative h-screen text-white flex items-center justify-center overflow-hidden"
      aria-label="Hero section with a stylish model"
    >
      <div className="absolute inset-0 z-0">
         {heroImages.map((image, index) => {
            const srcSet = generateSrcSet(image.id);
            const defaultSrc = `https://images.unsplash.com/photo-${image.id}?q=80&auto=format&fit=crop&w=1920`;

            return (
              <img 
                  key={image.id}
                  src={defaultSrc}
                  srcSet={srcSet}
                  sizes="100vw"
                  alt={image.alt}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  // @ts-ignore
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
              />
            );
         })}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" aria-hidden="true"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="opacity-0 animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-4xl md:text-7xl font-extrabold leading-tight mb-4 drop-shadow-2xl tracking-tight">
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
            className="bg-white text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg"
          >
            Explore Collection
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <a href="#products" aria-label="Scroll down to products">
           <ChevronDownIcon className="w-8 h-8 text-white/70 animate-bounce-slow" />
        </a>
      </div>
    </section>
  );
};

export default Hero;