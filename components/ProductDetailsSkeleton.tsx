import React from 'react';

const ProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="container mx-auto px-6 py-12">
        {/* Back link placeholder */}
        <div className="mb-8 h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery Skeleton */}
          <div>
            <div className="mb-4 bg-gray-300 dark:bg-gray-700 rounded-lg" style={{ aspectRatio: '1/1.5' }}></div>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-gray-300 dark:bg-gray-700 rounded-md aspect-square"></div>
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="flex flex-col">
            <div className="h-4 w-1/4 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
            <div className="h-10 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>

            <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
            <div className="h-8 w-1/4 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>

            <div className="space-y-2 mb-8">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
            
            <div className="mb-6">
                <div className="h-6 w-1/5 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                </div>
            </div>
            
            {/* Actions Skeleton */}
            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="h-12 w-32 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                <div className="flex-grow h-12 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
