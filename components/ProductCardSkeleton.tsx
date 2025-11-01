import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[--color-bg-primary] rounded-2xl shadow-md overflow-hidden border border-[--color-border] h-full flex flex-col animate-pulse">
      {/* Image Placeholder */}
      <div className="w-full h-72 bg-[--color-bg-tertiary]"></div>
      <div className="p-5 flex flex-col flex-grow">
        {/* Category Placeholder */}
        <div className="h-3 bg-[--color-bg-tertiary] rounded w-1/4 mb-3"></div>
        {/* Title Placeholder */}
        <div className="h-6 bg-[--color-bg-tertiary] rounded w-3/4 mb-3"></div>
        {/* Description Placeholder */}
        <div className="h-4 bg-[--color-bg-tertiary] rounded w-full mb-1"></div>
        <div className="h-4 bg-[--color-bg-tertiary] rounded w-5/6 mb-3"></div>
        
        {/* Rating placeholder */}
        <div className="h-5 bg-[--color-bg-tertiary] rounded w-1/2 mb-4"></div>

        <div className="mt-auto pt-4 flex justify-between items-center">
          {/* Price Placeholder */}
          <div className="h-8 bg-[--color-bg-tertiary] rounded w-1/4"></div>
          {/* Button Placeholder */}
          <div className="h-12 w-12 bg-[--color-bg-tertiary] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;