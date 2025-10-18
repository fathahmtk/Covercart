import React from 'react';
import { Product } from '../types';
import { useReviews } from '../context/ReviewsContext';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';

interface ProductReviewsProps {
  product: Product;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  const { getReviewsForProduct, getAverageRating } = useReviews();

  const reviews = getReviewsForProduct(product.id);
  const { average, count } = getAverageRating(product.id);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
  }

  return (
    <section id="reviews" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                {/* Review List */}
                <div>
                    <div className="flex items-center gap-4 mb-6">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Customer Reviews ({count})</h3>
                        {count > 0 && <StarRating rating={average} />}
                    </div>
                    {reviews.length > 0 ? (
                        <div className="space-y-6 max-h-[450px] overflow-y-auto pr-4 -mr-4">
                            {reviews.map(review => (
                                <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                    <div className="flex items-center mb-1">
                                        <StarRating rating={review.rating} />
                                        <p className="ml-auto text-sm text-gray-500 dark:text-gray-400">{formatDate(review.date)}</p>
                                    </div>
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">{review.name}</h4>
                                    <p className="text-gray-600 dark:text-gray-300 mt-1">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 mt-4">Be the first to review this product!</p>
                    )}
                </div>
                {/* Review Form */}
                <div>
                     <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Leave a Review</h3>
                     <ReviewForm productId={product.id} />
                </div>
            </div>
        </div>
    </section>
  );
};

export default ProductReviews;