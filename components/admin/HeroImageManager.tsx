

import React, { useState } from 'react';
import { useHero } from '../../context/HeroContext';
import { TrashIcon } from '../icons/TrashIcon';
import LazyImage from '../LazyImage';
import { PlusIcon } from '../icons/PlusIcon';

const HeroImageManager: React.FC = () => {
  const { heroImages, addImage, removeImage } = useHero();
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  const [error, setError] = useState('');

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim() || !newImageAlt.trim()) {
      setError('Please provide both an image URL and a description.');
      return;
    }
     try {
        new URL(newImageUrl);
    } catch (_) {
        setError('Please enter a valid image URL.');
        return;
    }

    addImage({ url: newImageUrl, alt: newImageAlt });
    setNewImageUrl('');
    setNewImageAlt('');
    setError('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4">Manage Hero Images</h2>
      
      {/* Add New Image Form */}
      <form onSubmit={handleAddImage} className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-600/50">
        <h3 className="text-lg font-semibold mb-3">Add New Image</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
            <input
              type="text"
              id="imageUrl"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="mt-1 input-style"
            />
          </div>
          <div>
            <label htmlFor="imageAlt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (for accessibility)</label>
            <input
              type="text"
              id="imageAlt"
              value={newImageAlt}
              onChange={(e) => setNewImageAlt(e.target.value)}
              placeholder="e.g., A stylish phone case..."
              className="mt-1 input-style"
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button type="submit" className="mt-4 flex items-center gap-2 bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors text-sm">
          <PlusIcon className="w-4 h-4" /> Add Image
        </button>
      </form>

      {/* Current Images List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Current Images</h3>
        <div className="space-y-4">
          {heroImages.length > 0 ? (
            heroImages.map((image) => (
              <div key={image.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-md border dark:border-gray-700">
                <LazyImage src={image.url} alt={image.alt} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{image.alt}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 break-all line-clamp-1">URL: {image.url}</p>
                </div>
                <button
                  onClick={() => removeImage(image.id)}
                  className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"
                  aria-label={`Remove image: ${image.alt}`}
                >
                  <TrashIcon />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No hero images have been added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroImageManager;