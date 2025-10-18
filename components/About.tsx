import React from 'react';
import { BUSINESS_INFO } from '../constants';
import AnimateOnScroll from './AnimateOnScroll';
import LazyImage from './LazyImage';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-[--color-bg-subtle]">
      <div className="container mx-auto px-6">
        <AnimateOnScroll className="fade-in-up">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <LazyImage 
                src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=800&auto=format&fit=crop" 
                alt="A person holding a phone and using a credit card, representing e-commerce" 
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold mb-4 text-[--color-text] tracking-tight">About {BUSINESS_INFO.name}</h2>
              <p className="text-[--color-text-muted] mb-4 leading-relaxed">
                Based in the heart of {BUSINESS_INFO.address}, CoverCart was born from a passion for technology and personal expression. We believe that a phone case is more than just protection; it's a statement piece, a canvas for your personality.
              </p>
              <p className="text-[--color-text-muted] leading-relaxed">
                We are committed to providing high-quality, durable, and stylish mobile covers. From our curated collection to our groundbreaking AI designer, we give you the tools to make your phone truly yours. We're a small business with a big heart, selling directly through our social channels on Facebook, Instagram, and WhatsApp.
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default About;