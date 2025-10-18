import React, { useState } from 'react';
import { useReviews } from '../context/ReviewsContext';
import { StarIcon } from './icons/StarIcon';

interface ReviewFormProps {
  productId: number;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId }) => {
  const { addReview } = useReviews();
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || rating === 0) {
      setError('Please fill out all fields and select a rating.');
      return;
    }
    
    addReview(productId, { name, rating, comment });
    
    // Reset form
    setName('');
    setRating(0);
    setComment('');
    setError('');
    setSuccess(true);
    
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
      {success && (
        <p className="text-green-600 dark:text-green-400 font-semibold">Thank you for your review!</p>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-800 dark:border-gray-600"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rating</label>
        <div className="mt-1 flex items-center" onMouseLeave={() => setHoverRating(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              className="text-gray-400 focus:outline-none"
              aria-label={`Rate ${star} out of 5 stars`}
            >
              <StarIcon className={`w-7 h-7 cursor-pointer transition-colors ${ (hoverRating || rating) >= star ? 'text-amber-400' : 'text-gray-300 dark:text-gray-500'}`} />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Review</label>
        <textarea
          id="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-800 dark:border-gray-600"
          required
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        className="w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-black dark:bg-teal-600 dark:hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;