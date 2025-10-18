import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[--color-bg] rounded-xl shadow-md overflow-hidden border border-[--color-border] h-full flex flex-col animate-pulse">
      {/* Image Placeholder */}
      <div className="w-full h-64 bg-gray-300 dark:bg-gray-700"></div>
      <div className="p-6 flex flex-col flex-grow">
        {/* Title Placeholder */}
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        {/* Description Placeholder */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-3"></div>
        
        {/* Rating placeholder */}
        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>

        <div className="mt-auto pt-4 flex justify-between items-center">
          {/* Price Placeholder */}
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
          {/* Button Placeholder */}
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg w-2/5"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
