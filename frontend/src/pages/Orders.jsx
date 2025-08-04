import React, { useEffect, useState } from 'react';
import fetchWithAuth from '../utils/fetchWithAuth';
import { getCurrentUser } from '../services/authService';
import Button from '../components/Button';

/**
 * Orders component for displaying and creating orders.
 *
 * - Fetches and displays a list of orders and available products.
 * - Allows users to create a new order with multiple items.
 * - Handles form input for selecting products and quantities.
 * - Submits new orders and updates the order list upon creation.
 *
 * @component
 * @returns {JSX.Element} The rendered Orders page with order creation form and order list table.
 */
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newOrderItems, setNewOrderItems] = useState([
    { product_id: '', quantity: '' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const user = getCurrentUser();


  // Fetch orders and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetchWithAuth('/orders'),
          fetchWithAuth('/products')
        ]);
        setOrders(ordersRes);
        setProducts(productsRes);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    fetchData();
  }, []);

  // Form input handlers
  const handleItemChange = (index, field, value) => {
    const updated = [...newOrderItems];
    updated[index][field] = value;
    setNewOrderItems(updated);
  };

  const addItem = () => {
    setNewOrderItems([...newOrderItems, { product_id: '', quantity: '' }]);
  };

  const removeItem = (index) => {
    const updated = newOrderItems.filter((_, i) => i !== index);
    setNewOrderItems(updated);
  };

  // Submit new order
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        items: newOrderItems.map(item => ({
          product_id: parseInt(item.product_id),
          quantity: parseInt(item.quantity)
        }))
      };

      const created = await fetchWithAuth('/orders', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setOrders(prev => [...prev, created]);
      setNewOrderItems([{ product_id: '', quantity: '' }]);
    } catch (err) {
      console.error('Error creating order:', err);
    }
  };

  // Search handler
  const handleSearchSubmit = e => {
    e.preventDefault();
    // Implement search functionality here
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Orders</h1>

      {/* Search Form */}
      <form
        className="flex items-center max-w-sm mx-auto mb-4"
        onSubmit={handleSearchSubmit}
        autoComplete="off"
      >
        <label htmlFor="simple-search" className="sr-only">Search</label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input
            type="text"
            id="simple-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            required
          />
        </div>
      </form>

      {/* Create Order Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        {newOrderItems.map((item, index) => (
          <div key={index} className="mb-4 border p-3 rounded bg-gray-50">
            <div className="mb-2">
              <label className="block text-sm font-medium">Product</label>
              <select
                value={item.product_id}
                onChange={e => handleItemChange(index, 'product_id', e.target.value)}
                required
                className="border p-2 w-full"
              >
                <option value="">Select product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <input
                type="number"
                value={item.quantity}
                onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                required
                className="border p-2 w-full"
              />
            </div>

            {newOrderItems.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-600 mt-2 text-sm"
              >
                Remove item
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="text-blue-600 text-sm mb-4"
        >
          + Add another item
        </button>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Order
        </button>
      </form>

      {/* Orders Table */}
      <h2 className="text-lg font-semibold mb-2">Order List</h2>
      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr>
            <th className="border px-4 py-2">Order ID</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Items</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td className="border px-4 py-2">{order.id}</td>
              <td className="border px-4 py-2">{order.status}</td>
              <td className="border px-4 py-2">
                {order.items && order.items.map((item, i) => (
                  <div key={i}>
                    {item.product_name} x {item.quantity}
                  </div>
                ))}
              </td>
              <td className="border px-4 py-2">
                {new Date(order.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
