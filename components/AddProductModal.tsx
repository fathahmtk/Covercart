import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { Product, ProductVariant } from '../types';
import { CATEGORIES } from '../constants';
import { fileToBase64 } from '../utils/imageUtils';
import { XMarkIcon } from './icons/XMarkIcon';
import { PhotographIcon } from './icons/PhotographIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { PlusIcon } from './icons/PlusIcon';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, productToEdit }) => {
  const { addProduct, updateProduct } = useProducts();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1]);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [variants, setVariants] = useState<Partial<ProductVariant>[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setPrice(String(productToEdit.price));
      setDescription(productToEdit.description);
      setCategory(productToEdit.category);
      setMainImage(productToEdit.imageUrl);
      setVariants(productToEdit.variants || []);
      setStock(String(productToEdit.stock ?? ''));
      setIsFeatured(productToEdit.isFeatured || false);
    } else {
      resetForm();
    }
  }, [productToEdit, isOpen]);

  const resetForm = () => {
    setName('');
    setPrice('');
    setStock('');
    setDescription('');
    setCategory(CATEGORIES[1]);
    setMainImage(null);
    setVariants([]);
    setIsFeatured(false);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError('Image file is too large. Please upload an image under 2MB.');
        return;
      }
      setError('');
      try {
        const base64 = await fileToBase64(file);
        if (typeof index === 'number') {
          const newVariants = [...variants];
          newVariants[index].imageUrl = base64;
          setVariants(newVariants);
        } else {
          setMainImage(base64);
        }
      } catch (uploadError) {
        setError("There was an error processing the image. Please try another file.");
      }
    }
  };

  const handleAddVariant = () => {
    setVariants([...variants, { name: '', colorCode: '#000000', imageUrl: '', stock: 0 }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: keyof Omit<ProductVariant, 'id' | 'imageUrl'>, value: string | number) => {
    const newVariants = [...variants];
    (newVariants[index] as any)[field] = value;
    setVariants(newVariants);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description || !mainImage || (variants.length === 0 && !stock)) {
      setError('Please fill all required fields and upload a main image.');
      return;
    }
    if (variants.some(v => !v.name || !v.imageUrl || v.stock === undefined || v.stock < 0)) {
        setError('Please ensure all variants have a name, an image, and a valid stock quantity.');
        return;
    }
    setError('');

    const productData = {
        name,
        price: parseFloat(price),
        description,
        category,
        brand: category,
        imageUrl: mainImage,
        isFeatured,
        stock: variants.length > 0 ? undefined : parseInt(stock, 10),
        variants: variants.map((v, i) => ({
            id: v.id || Date.now() + i + 1,
            name: v.name!,
            colorCode: v.colorCode!,
            imageUrl: v.imageUrl!,
            stock: Number(v.stock!),
        }))
    };
    
    if (productToEdit) {
        updateProduct({ ...productData, id: productToEdit.id });
    } else {
        addProduct({ ...productData, id: Date.now() });
    }
    
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 animate-fade-in" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-modal-zoom-in">
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{productToEdit ? 'Edit Product' : 'Add New Product'}</h2>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
              <XMarkIcon />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 input-style" required />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (₹)</label>
                <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} className="mt-1 input-style" required min="0" />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea id="description" rows={3} value={description} onChange={e => setDescription(e.target.value)} className="mt-1 input-style" required />
            </div>
            <div className="flex items-center">
                <input
                    id="isFeatured"
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="isFeatured" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mark as Featured Product
                </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="mt-1 input-style">
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {variants.length === 0 && (
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Quantity</label>
                  <input type="number" id="stock" value={stock} onChange={e => setStock(e.target.value)} className="mt-1 input-style" required min="0" />
                </div>
              )}
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Main Image</label>
                <ImageUploader image={mainImage} onUpload={e => handleImageUpload(e)} id="main-image-upload" />
              </div>
            <div className="space-y-4 pt-4 border-t dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Product Variants</h3>
              {variants.map((variant, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md relative border dark:border-gray-600/50">
                    <button type="button" onClick={() => handleRemoveVariant(index)} className="absolute -top-2.5 -right-2.5 bg-white dark:bg-gray-700 rounded-full text-gray-500 hover:text-red-500 z-10 transition-transform hover:scale-110">
                        <XCircleIcon />
                    </button>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Variant Image</label>
                            <ImageUploader image={variant.imageUrl ?? null} onUpload={e => handleImageUpload(e, index)} id={`variant-image-${index}`} />
                        </div>
                        <div className="md:w-2/3 space-y-4">
                            <div>
                                <label htmlFor={`variant-name-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Variant Name</label>
                                <input id={`variant-name-${index}`} type="text" placeholder="e.g., Midnight Black" value={variant.name || ''} onChange={e => handleVariantChange(index, 'name', e.target.value)} className="input-style mt-1" required />
                            </div>
                            <div className="flex items-end gap-4">
                                <div className="flex-grow">
                                    <label htmlFor={`variant-stock-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label>
                                    <input id={`variant-stock-${index}`} type="number" placeholder="0" value={variant.stock ?? ''} onChange={e => handleVariantChange(index, 'stock', parseInt(e.target.value, 10) || 0)} className="input-style mt-1" required min="0" />
                                </div>
                                <div>
                                    <label htmlFor={`variant-color-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">Color</label>
                                    <input id={`variant-color-${index}`} type="color" value={variant.colorCode} onChange={e => handleVariantChange(index, 'colorCode', e.target.value)} className="h-10 w-16 p-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer mt-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              ))}
              <button type="button" onClick={handleAddVariant} className="flex items-center gap-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline">
                <PlusIcon className="w-4 h-4" /> Add Variant
              </button>
            </div>
            {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-900/50 p-3 rounded-md">{error}</p>}
            <div className="pt-4 border-t dark:border-gray-700 flex justify-end gap-3">
              <button type="button" onClick={handleClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold">Cancel</button>
              <button type="submit" className="px-6 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 font-semibold">Save Product</button>
            </div>
          </form>
        </div>
      </div>
       <style>{`
          .input-style { display: block; width: 100%; border-radius: 0.375rem; border: 1px solid; border-color: #D1D5DB; background-color: #FFFFFF; padding: 0.5rem 0.75rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); transition: border-color 0.2s, box-shadow 0.2s; }
          .dark .input-style { border-color: #4B5563; background-color: #374151; color: #F3F4F6; }
          .input-style:focus { outline: 2px solid transparent; outline-offset: 2px; --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); border-color: #14B8A6; --tw-ring-color: #14B8A6; }
       `}</style>
    </>
  );
};

const ImageUploader: React.FC<{image: string | null, onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void, id: string}> = ({ image, onUpload, id }) => (
  <div>
    <label htmlFor={id} className="cursor-pointer group">
      {image ? (
        <img src={image} alt="Upload preview" className="w-full h-32 object-contain rounded-md bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-500"/>
      ) : (
        <div className="w-full h-32 flex flex-col items-center justify-center rounded-md bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-500 text-gray-500 group-hover:bg-gray-100 dark:group-hover:bg-gray-800 group-hover:border-teal-500 transition-colors">
          <PhotographIcon />
          <p className="text-sm mt-1">Click to upload</p>
        </div>
      )}
    </label>
    <input type="file" id={id} onChange={onUpload} accept="image/png, image/jpeg, image/webp" className="hidden" />
  </div>
);

export default AddProductModal;
