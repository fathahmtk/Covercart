
import React, { useState } from 'react';
import { useCategory } from '../../context/CategoryContext';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { XMarkIcon } from '../icons/XMarkIcon';
import ConfirmationModal from './ConfirmationModal';

const CategoryManager: React.FC = () => {
    const { categories, addCategory, updateCategory, deleteCategory } = useCategory();
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState<{ oldName: string; newName: string } | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [error, setError] = useState('');

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategory.trim()) {
            if (!addCategory(newCategory.trim())) {
                setError(`Category "${newCategory.trim()}" already exists.`);
            } else {
                setNewCategory('');
                setError('');
            }
        }
    };

    const handleEditStart = (categoryName: string) => {
        setEditingCategory({ oldName: categoryName, newName: categoryName });
    };

    const handleEditCancel = () => {
        setEditingCategory(null);
    };
    
    const handleEditSave = () => {
        if (editingCategory && editingCategory.newName.trim()) {
            if (!updateCategory(editingCategory.oldName, editingCategory.newName.trim())) {
                alert(`Category "${editingCategory.newName.trim()}" already exists.`);
            } else {
                setEditingCategory(null);
            }
        }
    };
    
    const handleDeleteClick = (categoryName: string) => {
        setCategoryToDelete(categoryName);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (categoryToDelete) {
            deleteCategory(categoryToDelete);
            setCategoryToDelete(null);
            setIsConfirmOpen(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Manage Product Categories</h2>
            
            <form onSubmit={handleAddCategory} className="mb-6 flex gap-2">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => { setNewCategory(e.target.value); setError(''); }}
                    placeholder="New category name"
                    className="flex-grow input-style"
                />
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700">Add</button>
            </form>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            
            <div className="space-y-2">
                {categories.map(category => (
                    <div key={category} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                        {editingCategory?.oldName === category ? (
                            <div className="flex-grow flex items-center gap-2">
                                <input 
                                    type="text"
                                    value={editingCategory.newName}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, newName: e.target.value })}
                                    className="input-style"
                                    autoFocus
                                />
                                <button onClick={handleEditSave} className="p-2 text-green-600 hover:bg-green-100 rounded-full"><CheckIcon /></button>
                                <button onClick={handleEditCancel} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><XMarkIcon /></button>
                            </div>
                        ) : (
                            <>
                                <span className="text-gray-800 dark:text-gray-200">{category}</span>
                                <div className="space-x-2">
                                    <button onClick={() => handleEditStart(category)} className="p-2 text-teal-600 hover:bg-teal-100 dark:hover:bg-teal-900/50 rounded-full"><PencilIcon /></button>
                                    <button onClick={() => handleDeleteClick(category)} className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><TrashIcon /></button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <ConfirmationModal 
                isOpen={isConfirmOpen} 
                onClose={() => setIsConfirmOpen(false)} 
                onConfirm={handleConfirmDelete}
                title="Delete Category"
                message={`Are you sure you want to delete "${categoryToDelete}"? This will not remove products from this category but may affect filtering.`}
                confirmButtonText="Delete"
                confirmButtonVariant="danger"
            />
        </div>
    );
};

export default CategoryManager;
