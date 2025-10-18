import React from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

const Hero: React.FC = () => {
  return (
    <section 
      className="relative h-screen text-white flex items-center justify-center overflow-hidden"
      aria-label="Hero section with a stylish model"
    >
      <div className="absolute inset-0 z-0">
         <img 
            src="https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=1920&auto=format&fit=crop" 
            alt="AI-generated image of a stylish model with futuristic neon lighting"
            className="w-full h-full object-cover object-center animate-fade-in"
         />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" aria-hidden="true"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="opacity-0 animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-4xl md:text-7xl font-extrabold leading-tight mb-4 drop-shadow-2xl tracking-tight">
              Style That Speaks.
            </h1>
        </div>
        <div className="opacity-0 animate-slide-in-bottom" style={{ animationDelay: '0.5s' }}>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-lg font-light text-gray-200">
              From runway trends to your own AI creations, find the perfect case that's uniquely you.
            </p>
        </div>
        <div className="opacity-0 animate-slide-in-bottom flex flex-wrap justify-center gap-4" style={{ animationDelay: '0.8s' }}>
          <a 
            href="#products" 
            className="bg-white text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg"
          >
            Explore Collection
          </a>
          <a 
            href="#ai-designer" 
            className="bg-gradient-to-r from-[--color-primary] to-teal-400 text-white font-bold py-3 px-8 rounded-full hover:shadow-xl hover:from-[--color-primary-hover] hover:to-teal-500 transition-all transform hover:scale-105 shadow-lg"
          >
            Design with AI
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