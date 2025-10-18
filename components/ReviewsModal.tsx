import React from 'react';
import { Product } from '../types';
import { useReviews } from '../context/ReviewsContext';
import { XMarkIcon } from './icons/XMarkIcon';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const ReviewsModal: React.FC<ReviewsModalProps> = ({ isOpen, onClose, product }) => {
  const { getReviewsForProduct, getAverageRating } = useReviews();

  if (!product) return null;

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
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-50 transition-opacity duration-300 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${!isOpen && 'pointer-events-none'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reviews-heading"
      >
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-[transform,opacity] duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div>
                <h2 id="reviews-heading" className="text-2xl font-bold text-gray-800 dark:text-white">Customer Reviews</h2>
                <p className="text-gray-600 dark:text-gray-400">{product.name}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white" aria-label="Close reviews">
              <XMarkIcon />
            </button>
          </div>
            
          <div className="flex-grow overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Review List */}
                <div className="order-2 lg:order-1">
                    <div className="flex items-center gap-4 mb-6">
                        <h3 className="text-xl font-bold">{count} Review{count !== 1 ? 's' : ''}</h3>
                        {count > 0 && <StarRating rating={average} />}
                    </div>
                    {reviews.length > 0 ? (
                        <div className="space-y-6">
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
                        <p className="text-gray-500 dark:text-gray-400">Be the first to review this product!</p>
                    )}
                </div>
                {/* Review Form */}
                <div className="order-1 lg:order-2">
                     <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
                     <ReviewForm productId={product.id} />
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewsModal;
