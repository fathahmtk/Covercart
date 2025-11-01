import React from 'react';

export const ArrowPathIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 4v5h5M20 20v-5h-5"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 9a9 9 0 0114.13-4.52M20 15a9 9 0 01-14.13 4.52"
    />
  </svg>
);
