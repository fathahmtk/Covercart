import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-pulse">
      {/* Image Placeholder */}
      <div className="w-full h-64 bg-gray-300 dark:bg-gray-700"></div>
      <div className="p-6">
        {/* Title Placeholder */}
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        {/* Description Placeholder */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
        <div className="flex justify-between items-center">
          {/* Price Placeholder */}
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
          {/* Button Placeholder */}
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg w-1/3"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
