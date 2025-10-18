import React, { useState, useEffect, useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../types';
import AddProductModal from '../AddProductModal';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import AnimateOnScroll from '../AnimateOnScroll';
import ConfirmationModal from './ConfirmationModal';
import { ArrowUpIcon } from '../icons/ArrowUpIcon';
import { ArrowDownIcon } from '../icons/ArrowDownIcon';

type SortableKeys = 'name' | 'category' | 'price';

const AdminPanel: React.FC = () => {
  const { products, deleteProduct } = useProducts();
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('isAdminAuthenticated') === 'true');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });

  useEffect(() => {
    if (!isAuthenticated) {
      const password = prompt('Please enter the admin password:');
      if (password === 'admin123') { // Simple hardcoded password for demo
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        setIsAuthenticated(true);
      } else {
        alert('Incorrect password.');
        window.location.hash = '#/';
      }
    }
  }, [isAuthenticated]);

  const sortedProducts = useMemo(() => {
    let sortableProducts = [...products];
    if (sortConfig.key) {
        sortableProducts.sort((a, b) => {
            const key = sortConfig.key;
            const valA = a[key];
            const valB = b[key];

            let comparison = 0;
            if (typeof valA === 'string' && typeof valB === 'string') {
                comparison = valA.localeCompare(valB);
            } else if (typeof valA === 'number' && typeof valB === 'number') {
                comparison = valA - valB;
            }

            return sortConfig.direction === 'asc' ? comparison : -comparison;
        });
    }
    return sortableProducts;
  }, [products, sortConfig]);

  const requestSort = (key: SortableKeys) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleAddClick = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsConfirmModalOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
    }
    setIsConfirmModalOpen(false);
    setProductToDelete(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p>Redirecting...</p>
      </div>
    );
  }

  const SortableHeader: React.FC<{ sortKey: SortableKeys, children: React.ReactNode }> = ({ sortKey, children }) => (
    <button onClick={() => requestSort(sortKey)} className="flex items-center gap-2 group">
      {children}
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
        {sortConfig.key === sortKey ? (
            sortConfig.direction === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />
        ) : (
            <ArrowDownIcon className="text-gray-400" />
        )}
      </span>
    </button>
  );

  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-[80vh]">
        <div className="container mx-auto px-6 py-12">
          <AnimateOnScroll className="fade-in-up">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin - Manage Products</h1>
              <button
                onClick={handleAddClick}
                className="flex items-center gap-2 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors font-semibold shadow"
              >
                <PlusCircleIcon />
                <span>Add New Product</span>
              </button>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll className="fade-in-up" delay={200}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                    <tr>
                      <th scope="col" className="px-6 py-3">Image</th>
                      <th scope="col" className="px-6 py-3">
                        <SortableHeader sortKey="name">Product Name</SortableHeader>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortableHeader sortKey="category">Category</SortableHeader>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortableHeader sortKey="price">Price</SortableHeader>
                      </th>
                      <th scope="col" className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProducts.map(product => (
                      <tr key={product.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                        <td className="px-6 py-4">
                          <img src={product.imageUrl} alt={product.name} className="w-12 h-16 object-cover rounded-sm"/>
                        </td>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          {product.name}
                        </th>
                        <td className="px-6 py-4">{product.category}</td>
                        <td className="px-6 py-4 font-semibold">₹{product.price}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => handleEditClick(product)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline p-1" title="Edit">
                              <PencilIcon />
                          </button>
                          <button onClick={() => handleDeleteClick(product)} className="font-medium text-red-600 dark:text-red-500 hover:underline p-1" title="Delete">
                              <TrashIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
        <AddProductModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          productToEdit={productToEdit}
        />
      </div>
      <ConfirmationModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmButtonText="Delete"
        confirmButtonVariant="danger"
      />
    </>
  );
};

export default AdminPanel;