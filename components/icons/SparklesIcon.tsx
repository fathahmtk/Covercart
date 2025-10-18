
import React from 'react';

export const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
  <svg className={`w-5 h-5 mr-2 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L11 12l4.293 4.293a1 1 0 010 1.414L13 20m-3-3l-2.293-2.293a1 1 0 010-1.414L11 12l-4.293-4.293a1 1 0 010-1.414L9 4" />
  </svg>
);
