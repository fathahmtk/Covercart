
import React, { useMemo, useState } from 'react';
import { useReviews } from '../../context/ReviewsContext';
import { useProducts } from '../../context/ProductContext';
import { Review } from '../../types';
import StarRating from '../StarRating';
import { TrashIcon } from '../icons/TrashIcon';
import ConfirmationModal from './ConfirmationModal';
import { PencilIcon } from '../icons/PencilIcon';
import EditReviewModal from './EditReviewModal';

interface ReviewWithProduct extends Review {
  productName: string;
}

const ReviewManager: React.FC = () => {
    const { reviews, deleteReview, updateReview } = useReviews();
    const { products } = useProducts();
    const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [reviewToEdit, setReviewToEdit] = useState<ReviewWithProduct | null>(null);

    const allReviews: ReviewWithProduct[] = useMemo(() => {
        return Object.entries(reviews).flatMap(([productId, productReviews]) => {
            const product = products.find(p => p.id === Number(productId));
            return productReviews.map(review => ({
                ...review,
                productName: product?.name || `Product ID: ${productId}`,
            }));
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [reviews, products]);

    const handleDeleteClick = (review: Review) => {
        setReviewToDelete(review);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (reviewToDelete) {
            deleteReview(reviewToDelete.productId, reviewToDelete.id);
            setReviewToDelete(null);
            setIsConfirmOpen(false);
        }
    };
    
    const handleEditClick = (review: ReviewWithProduct) => {
        setReviewToEdit(review);
    };

    const handleSaveReview = (reviewId: string, data: { name: string; rating: number; comment: string }) => {
        if (reviewToEdit) {
            updateReview(reviewToEdit.productId, reviewId, data);
            setReviewToEdit(null);
        }
    };
    
    const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Manage Customer Reviews</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reviewer</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rating</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Comment</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {allReviews.map(review => (
                            <tr key={review.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{review.productName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{review.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"><StarRating rating={review.rating} /></td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-sm truncate" title={review.comment}>{review.comment}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(review.date)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEditClick(review)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200 mr-4"><PencilIcon /></button>
                                    <button onClick={() => handleDeleteClick(review)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {allReviews.length === 0 && <p className="text-center py-4 text-gray-500 dark:text-gray-400">No reviews found.</p>}
            </div>
            <ConfirmationModal 
                isOpen={isConfirmOpen} 
                onClose={() => setIsConfirmOpen(false)} 
                onConfirm={handleConfirmDelete}
                title="Delete Review"
                message="Are you sure you want to delete this review? This action cannot be undone."
                confirmButtonText="Delete"
                confirmButtonVariant="danger"
            />
            <EditReviewModal
                isOpen={!!reviewToEdit}
                onClose={() => setReviewToEdit(null)}
                review={reviewToEdit}
                onSave={handleSaveReview}
            />
        </div>
    );
};

export default ReviewManager;
