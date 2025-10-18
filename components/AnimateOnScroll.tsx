import React, { useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  const isVisible = !!entry?.isIntersecting;

  const style = {
    transitionDelay: isVisible ? `${delay}ms` : '0ms'
  };

  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${className} ${isVisible ? 'is-visible' : ''}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default AnimateOnScroll;