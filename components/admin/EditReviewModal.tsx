
import React, { useState, useEffect } from 'react';
import { Review } from '../../types';
import { StarIcon } from '../icons/StarIcon';
import { XMarkIcon } from '../icons/XMarkIcon';

interface EditReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
  onSave: (reviewId: string, data: { name: string; rating: number; comment: string }) => void;
}

const EditReviewModal: React.FC<EditReviewModalProps> = ({ isOpen, onClose, review, onSave }) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  
  useEffect(() => {
    if (review) {
      setName(review.name);
      setRating(review.rating);
      setComment(review.comment);
    }
  }, [review]);

  if (!isOpen || !review) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(review.id, { name, rating, comment });
  };
  
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 animate-fade-in" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg flex flex-col animate-modal-zoom-in">
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Edit Review</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
              <XMarkIcon />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reviewer Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 input-style"
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
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Comment</label>
              <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1 input-style"
                required
              />
            </div>
            <div className="pt-4 border-t dark:border-gray-700 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold">Cancel</button>
              <button type="submit" className="px-6 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 font-semibold">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditReviewModal;
