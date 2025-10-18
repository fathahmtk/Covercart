
import React, { useState, useMemo } from 'react';
import { useOrders } from '../context/OrderContext';
import { Order } from '../types';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import LazyImage from './LazyImage';

interface LegalPageProps {
  onBack: () => void;
}

const OrderHistoryPage: React.FC<LegalPageProps> = ({ onBack }) => {
  const { orders } = useOrders();
  const [mobileNumber, setMobileNumber] = useState('');
  const [searchedNumber, setSearchedNumber] = useState('');

  const foundOrders = useMemo(() => {
    if (!searchedNumber) return [];
    return orders.filter(order => order.mobileNumber === searchedNumber);
  }, [orders, searchedNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedNumber(mobileNumber.trim());
  };
  
  const getStatusColor = (status: Order['status']) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
  }

  return (
    <div className="animate-fade-in bg-[--color-bg-subtle] min-h-[calc(100vh-200px)]">
      <div className="container mx-auto px-6 py-12">
        <a href="#/" onClick={(e) => { e.preventDefault(); onBack(); }} className="mb-8 inline-block text-[--color-primary] hover:text-[--color-primary-hover] hover:underline">
          &larr; Back to Home
        </a>
        <div className="bg-[--color-bg] p-8 rounded-lg shadow-md border border-[--color-border] max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-[--color-text]">Track Your Order</h1>
          <p className="text-[--color-text-muted] mb-6">Enter the mobile number you used during checkout to see your order history.</p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter your 10-digit mobile number"
              className="flex-grow w-full px-4 py-2 border border-[--color-border] rounded-md bg-[--color-bg-subtle] focus:ring-2 focus:ring-[--color-primary] focus:border-[--color-primary] transition"
              required
            />
            <button type="submit" className="px-6 py-2 rounded-md bg-[--color-primary] text-white font-semibold hover:bg-[--color-primary-hover] transition-colors shadow-sm">
              Find Orders
            </button>
          </form>

          <div>
            {searchedNumber && (
              foundOrders.length > 0 ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Orders for {searchedNumber}</h2>
                  {foundOrders.map(order => (
                    <div key={order.id} className="border border-[--color-border] rounded-lg overflow-hidden">
                        <div className="bg-[--color-bg-subtle] p-4 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-lg">Order #{order.id.slice(-6)}</p>
                                <p className="text-sm text-[--color-text-muted]">Placed on {formatDate(order.date)}</p>
                            </div>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>{order.status}</span>
                        </div>
                        <div className="p-4">
                            <ul className="space-y-2 mb-4">
                                {order.items.map(item => (
                                    <li key={item.cartItemId} className="flex items-center gap-4 text-sm">
                                        <LazyImage src={item.imageUrl} alt={item.productName} className="w-12 h-12 rounded-md object-cover" />
                                        <div className="flex-grow">
                                            <p className="font-semibold">{item.productName} {item.variantName && `(${item.variantName})`}</p>
                                            <p className="text-[--color-text-muted]">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium">₹{item.price * item.quantity}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="text-right font-bold text-lg border-t border-[--color-border] pt-2">
                                Total: ₹{order.total}
                            </div>
                        </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <ClipboardListIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-xl font-semibold">No Orders Found</h3>
                  <p className="text-[--color-text-muted] mt-1">We couldn't find any orders associated with that mobile number.</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
