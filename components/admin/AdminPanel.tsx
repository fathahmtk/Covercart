

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
import { CATEGORIES } from '../../constants';
import LazyImage from '../LazyImage';
import HeroImageManager from './HeroImageManager';
import { PaintBrushIcon } from '../icons/PaintBrushIcon';

type SortConfig<T> = { key: keyof T; direction: 'asc' | 'desc' } | null;
type ProductSortKeys = 'name' | 'category' | 'price' | 'stock';

const ITEMS_PER_PAGE = 10;

const AdminPanel: React.FC = () => {
  // Authentication State
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');

  // UI State
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'appearance'>('products');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Products State
  const { products, deleteProduct } = useProducts();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  // New states for filtering, sorting, and pagination
  const [productSortConfig, setProductSortConfig] = useState<SortConfig<Product> | { key: ProductSortKeys; direction: 'asc' | 'desc' } | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);


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
    // Replaced hardcoded password with environment variable
    if (password === process.env.ADMIN_PASSWORD) {
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      setIsAuth(true);
    } else {
      alert('Incorrect password');
    }
  };

  const getProductStock = (product: Product): number => {
    return product.variants && product.variants.length > 0
      ? product.variants.reduce((sum, v) => sum + v.stock, 0)
      : product.stock ?? 0;
  };
  
  const getStockStatus = (stock: number) => {
      if (stock <= 0) return 'Out of Stock';
      if (stock <= 5) return 'Low Stock';
      return 'In Stock';
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
        const categoryMatch = categoryFilter === 'All' || product.category === categoryFilter;
        const stockStatus = getStockStatus(getProductStock(product));
        const stockMatch = stockFilter === 'All' || stockStatus === stockFilter;
        return categoryMatch && stockMatch;
    });
  }, [products, categoryFilter, stockFilter]);

  const sortedProducts = useMemo(() => {
    if (!productSortConfig) return filteredProducts;
    
    return [...filteredProducts].sort((a, b) => {
        const key = productSortConfig.key as ProductSortKeys;
        let aValue: string | number;
        let bValue: string | number;

        if (key === 'stock') {
            aValue = getProductStock(a);
            bValue = getProductStock(b);
        } else {
            aValue = a[key as keyof Product] as string | number;
            bValue = b[key as keyof Product] as string | number;
        }

        if (aValue < bValue) return productSortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return productSortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });
  }, [filteredProducts, productSortConfig]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, stockFilter]);

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);


  const requestProductSort = (key: ProductSortKeys) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (productSortConfig && productSortConfig.key === key && productSortConfig.direction === 'asc') {
        direction = 'desc';
    }
    setProductSortConfig({ key, direction });
  };
  
  const sortedOrders = useMemo(() => {
    if (!orderSortConfig) return orders;
    return [...orders].sort((a, b) => {
        if (a[orderSortConfig.key] < b[orderSortConfig.key]) return orderSortConfig.direction === 'asc' ? -1 : 1;
        if (a[orderSortConfig.key] > b[orderSortConfig.key]) return orderSortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });
  }, [orders, orderSortConfig]);

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
    const totalStock = getProductStock(product);
    const status = getStockStatus(totalStock);
    
    if (status === 'Out of Stock') return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Out of Stock</span>;
    if (status === 'Low Stock') return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Low Stock ({totalStock})</span>;
    return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">In Stock ({totalStock})</span>;
  }
  
  const SortIndicator = ({ sortKey }: { sortKey: ProductSortKeys }) => {
    if (!productSortConfig || productSortConfig.key !== sortKey) return null;
    return productSortConfig.direction === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />;
  };

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
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 input-style"
            aria-label="Admin password"
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
           <button onClick={() => setActiveTab('appearance')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'appearance' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            <PaintBrushIcon /> Appearance
          </button>
        </nav>
      </div>
      
      {activeTab === 'products' && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex flex-wrap items-center gap-4">
            <div className="flex-grow">
                <label htmlFor="category-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select id="category-filter" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div className="flex-grow">
                <label htmlFor="stock-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Stock Status</label>
                <select id="stock-filter" value={stockFilter} onChange={e => setStockFilter(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600">
                    <option value="All">All</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                </select>
            </div>
        </div>
      )}

      {activeTab === 'appearance' && (
        <HeroImageManager />
      )}


      {/* Content */}
      {activeTab !== 'appearance' && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto border dark:border-gray-700">
            {activeTab === 'products' ? (
            <>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <button onClick={() => requestProductSort('name')} className="flex items-center gap-1">Product <SortIndicator sortKey="name" /></button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <button onClick={() => requestProductSort('category')} className="flex items-center gap-1">Category <SortIndicator sortKey="category" /></button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <button onClick={() => requestProductSort('price')} className="flex items-center gap-1">Price <SortIndicator sortKey="price" /></button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <button onClick={() => requestProductSort('stock')} className="flex items-center gap-1">Stock <SortIndicator sortKey="stock" /></button>
                    </th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedProducts.map((product) => (
                    <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="flex-shrink-0 h-10 w-10"><LazyImage className="h-10 w-10 rounded-md object-cover" src={product.imageUrl} alt={product.name} /></div><div className="ml-4"><div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div></div></div></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">₹{product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{getStockDisplay(product)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><button onClick={() => handleOpenEditModal(product)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200 mr-4"><PencilIcon /></button><button onClick={() => handleDeleteClick(product)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"><TrashIcon /></button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            {/* Pagination for Products */}
            {totalPages > 1 && (
                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
                        <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Next</button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, sortedProducts.length)}</span> of <span className="font-medium">{sortedProducts.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                                    Previous
                                </button>
                                <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                                    Next
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
            </>
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
                                                    <li key={item.cartItemId}>{item.productName}{item.variantName && `(${item.variantName})`} x {item.quantity} - ₹{item.price * item.quantity}</li>
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
      )}
      
      <AddProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} productToEdit={productToEdit} />
      <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={handleConfirmDelete} title="Delete Product" message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`} confirmButtonText="Delete" confirmButtonVariant="danger" />
    </div>
  );
};

export default AdminPanel;