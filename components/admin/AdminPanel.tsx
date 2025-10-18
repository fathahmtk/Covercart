import React, { useState, useEffect, useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import { Product, Order } from '../../types';
import AddProductModal from '../AddProductModal';
import ConfirmationModal from './ConfirmationModal';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { ArrowUpIcon } from '../icons/ArrowUpIcon';
import { ArrowDownIcon } from '../icons/ArrowDownIcon';
import { ArchiveBoxIcon } from '../icons/ArchiveBoxIcon';
import { ClipboardListIcon } from '../icons/ClipboardListIcon';

type SortConfig<T> = { key: keyof T; direction: 'asc' | 'desc' } | null;

const AdminPanel: React.FC = () => {
  // Authentication State
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');

  // UI State
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Products State
  const { products, deleteProduct } = useProducts();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productSortConfig, setProductSortConfig] = useState<SortConfig<Product>>(null);

  // Orders State
  const { orders, updateOrderStatus } = useOrders();
  const [orderSortConfig, setOrderSortConfig] = useState<SortConfig<Order>>(null);

  useEffect(() => {
    if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
      setIsAuth(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Hardcoded password
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      setIsAuth(true);
    } else {
      alert('Incorrect password');
    }
  };

  // Generic sort function
  const sortedItems = <T,>(items: T[], sortConfig: SortConfig<T>): T[] => {
    if (!sortConfig) return items;
    return [...items].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });
  };

  const requestSort = <T,>(key: keyof T, sortConfig: SortConfig<T>, setSortConfig: React.Dispatch<React.SetStateAction<SortConfig<T>>>) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const sortedProducts = useMemo(() => sortedItems(products, productSortConfig), [products, productSortConfig]);
  const sortedOrders = useMemo(() => sortedItems(orders, orderSortConfig), [orders, orderSortConfig]);

  // Product actions
  const handleOpenAddModal = () => { setProductToEdit(null); setIsProductModalOpen(true); };
  const handleOpenEditModal = (product: Product) => { setProductToEdit(product); setIsProductModalOpen(true); };
  const handleDeleteClick = (product: Product) => { setProductToDelete(product); setIsConfirmModalOpen(true); };
  const handleConfirmDelete = () => {
    if (productToDelete) deleteProduct(productToDelete.id);
    setIsConfirmModalOpen(false);
    setProductToDelete(null);
  };
  
  const getStockDisplay = (product: Product) => {
    const totalStock = product.variants && product.variants.length > 0 
      ? product.variants.reduce((sum, v) => sum + v.stock, 0)
      : product.stock ?? 0;
    
    if (totalStock <= 0) return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Out of Stock</span>;
    if (totalStock <= 5) return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Low Stock ({totalStock})</span>;
    return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">In Stock ({totalStock})</span>;
  }

  if (!isAuth) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <form onSubmit={handleLogin} className="p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg border dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <button type="submit" className="mt-4 w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        {activeTab === 'products' && (
          <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">
            <PlusCircleIcon /> Add Product
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button onClick={() => setActiveTab('products')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'products' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            <ArchiveBoxIcon /> Product Management
          </button>
          <button onClick={() => setActiveTab('orders')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'orders' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            <ClipboardListIcon /> Order Management
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto border dark:border-gray-700">
        {activeTab === 'products' ? (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="flex-shrink-0 h-10 w-10"><img className="h-10 w-10 rounded-md object-cover" src={product.imageUrl} alt={product.name} /></div><div className="ml-4"><div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div></div></div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">₹{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{getStockDisplay(product)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><button onClick={() => handleOpenEditModal(product)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200 mr-4"><PencilIcon /></button><button onClick={() => handleDeleteClick(product)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"><TrashIcon /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
             <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Details</span></th>
              </tr>
            </thead>
             <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedOrders.map(order => (
                    <React.Fragment key={order.id}>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900 dark:text-white">#{order.id.slice(-6)}</div><div className="text-xs text-gray-500">{new Date(order.date).toLocaleString()}</div></td>
                            <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900 dark:text-white">{order.customerName}</div><div className="text-xs text-gray-500">{order.mobileNumber}</div></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700 dark:text-gray-200">₹{order.total}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])} className="rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500 text-xs">
                                    <option>Pending</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><button onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)} className="text-teal-600 hover:underline">{expandedOrderId === order.id ? 'Hide' : 'View'} Details</button></td>
                        </tr>
                        {expandedOrderId === order.id && (
                            <tr className="bg-gray-50 dark:bg-gray-900/50">
                                <td colSpan={5} className="px-6 py-4">
                                    <div className="text-sm text-gray-800 dark:text-gray-200">
                                        <h4 className="font-bold mb-2">Order Details:</h4>
                                        <p><strong>Address:</strong> {order.deliveryAddress}</p>
                                        <ul className="list-disc pl-5 mt-2 space-y-1">
                                            {order.items.map(item => (
                                                <li key={item.cartItemId}>{item.productName}{item.variantName && ` (${item.variantName})`} x {item.quantity} - ₹{item.price * item.quantity}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
             </tbody>
          </table>
        )}
      </div>
      
      <AddProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} productToEdit={productToEdit} />
      <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={handleConfirmDelete} title="Delete Product" message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`} confirmButtonText="Delete" confirmButtonVariant="danger" />
    </div>
  );
};

export default AdminPanel;