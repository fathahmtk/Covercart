import React, { useState } from 'react';
import { Product } from '../types';
import { useUserGallery } from '../context/UserGalleryContext';
import { fileToBase64 } from '../utils/imageUtils';
import LazyImage from './LazyImage';
import Lightbox from './Lightbox';
import { PhotographIcon } from './icons/PhotographIcon';
import { CameraIcon } from './icons/CameraIcon';

interface UserGalleryProps {
  product: Product;
}

const UserGallery: React.FC<UserGalleryProps> = ({ product }) => {
  const { getImagesForProduct, addImage } = useUserGallery();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const images = getImagesForProduct(product.id);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError('File is too large. Please upload an image under 2MB.');
        return;
      }
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image to upload.');
      return;
    }

    try {
      const imageUrl = await fileToBase64(selectedFile);
      addImage(product.id, { imageUrl, caption });
      
      // Reset form
      setSelectedFile(null);
      setPreview(null);
      setCaption('');
      setError('');
      setSuccess(true);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    }
  };

  return (
    <>
      <section id="user-gallery" className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Gallery */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">From Our Customers</h3>
              {images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map((item) => (
                    <div key={item.id} className="group relative cursor-pointer" onClick={() => setLightboxImage(item.imageUrl)}>
                      <LazyImage
                        src={item.imageUrl}
                        alt={item.caption || 'User submitted photo'}
                        className="w-full h-full object-cover rounded-lg aspect-square"
                      />
                       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
                          <p className="text-white text-xs text-center line-clamp-2">{item.caption}</p>
                       </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 font-semibold">No photos yet!</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Be the first to share your style.</p>
                </div>
              )}
            </div>

            {/* Upload Form */}
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Share Your Style</h3>
              <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                {success && (
                  <p className="text-green-600 dark:text-green-400 font-semibold text-center">Thank you for sharing your photo!</p>
                )}
                <div>
                  <label htmlFor="photo-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload your photo</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {preview ? (
                        <img src={preview} alt="Upload preview" className="mx-auto h-24 w-auto rounded-md" />
                      ) : (
                        <PhotographIcon className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label htmlFor="photo-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-teal-600 dark:text-teal-400 hover:text-teal-500 focus-within:outline-none">
                          <span>{selectedFile ? 'Change image' : 'Select an image'}</span>
                          <input id="photo-upload" name="photo-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, WEBP up to 2MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Optional Caption</label>
                  <input
                    type="text"
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-900 dark:border-gray-600"
                    placeholder="e.g., Love my new case!"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={!selectedFile}
                  className="w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-black dark:bg-teal-600 dark:hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Photo
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {lightboxImage && (
        <Lightbox imageUrl={lightboxImage} onClose={() => setLightboxImage(null)} />
      )}
    </>
  );
};

export default UserGallery;