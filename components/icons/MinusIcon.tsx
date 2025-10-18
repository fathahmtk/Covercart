import React from 'react';

export const MinusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={`w-5 h-5 ${className}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);