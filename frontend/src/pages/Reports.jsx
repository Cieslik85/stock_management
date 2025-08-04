import React, { useEffect, useState } from 'react';
import fetchWithAuth from '../utils/fetchWithAuth';
import Button from '../components/button';

const Reports = () => {
  const [stockMovements, setStockMovements] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('stock');

  useEffect(() => {
    fetchWithAuth('/stock-movements').then(setStockMovements);
    fetchWithAuth('/orders').then(setOrders);
    fetchWithAuth('/products').then(setProducts);
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Reports</h2>

      {/* Tab Switcher */}
      <div className="flex gap-4 mb-8">
        <Button
          color={activeTab === 'stock' ? 'green' : 'blue'}
          className={activeTab === 'stock' ? '' : 'bg-gray-200 text-gray-700'}
          onClick={() => setActiveTab('stock')}
        >
          Stock Movement
        </Button>
        <Button
          color={activeTab === 'orders' ? 'green' : 'blue'}
          className={activeTab === 'orders' ? '' : 'bg-gray-200 text-gray-700'}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </Button>
        <Button
          color={activeTab === 'products' ? 'green' : 'blue'}
          className={activeTab === 'products' ? '' : 'bg-gray-200 text-gray-700'}
          onClick={() => setActiveTab('products')}
        >
          Products
        </Button>
      </div>

      {/* Stock Movement Report */}
      {activeTab === 'stock' && (
        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-2">Stock Movement Report</h3>
          <div className="bg-white rounded shadow p-4 mb-4">
            <table className="min-w-full text-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2">Product</th>

                  <th className="border border-gray-200 px-4 py-2">Type</th>
                  <th className="border border-gray-200 px-4 py-2">Quantity</th>
                  <th className="border border-gray-200 px-4 py-2">User</th>
                  <th className="border border-gray-200 px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stockMovements.map(mv => (
                  <tr key={mv.id}>
                    <td className="border border-gray-200 px-4 py-2">{mv.product_name}</td>

                    <td className="border border-gray-200 px-4 py-2">{mv.action_type}</td>
                    <td className="border border-gray-200 px-4 py-2">{mv.quantity}</td>
                    <td className="border border-gray-200 px-4 py-2">{mv.user_name}</td>
                    <td className="border border-gray-200 px-4 py-2">{new Date(mv.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Orders Report */}
      {activeTab === 'orders' && (
        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-2">Orders Report</h3>
          <div className="bg-white rounded shadow p-4 mb-4">
            <table className="min-w-full text-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2">Date</th>
                  <th className="border border-gray-200 px-4 py-2">User</th>
                  <th className="border border-gray-200 px-4 py-2">Status</th>
                  <th className="border border-gray-200 px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map(order => (
                  <tr key={order.id}>
                    <td className="border border-gray-200 px-4 py-2">{new Date(order.date).toLocaleString()}</td>
                    <td className="border border-gray-200 px-4 py-2">{order.user_name}</td>
                    <td className="border border-gray-200 px-4 py-2">{order.status}</td>
                    <td className="border border-gray-200 px-4 py-2">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Product Report */}
      {activeTab === 'products' && (
        <section>
          <h3 className="text-xl font-semibold mb-2">Product Report</h3>
          <div className="bg-white rounded shadow p-4 mb-4">
            <table className="min-w-full text-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2">Name</th>
                  <th className="border border-gray-200 px-4 py-2">SKU</th>
                  <th className="border border-gray-200 px-4 py-2">Stock</th>
                  <th className="border border-gray-200 px-4 py-2">Archived</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map(prod => (
                  <tr key={prod.id}>
                    <td className="border border-gray-200 px-4 py-2">{prod.name}</td>
                    <td className="border border-gray-200 px-4 py-2">{prod.sku}</td>
                    <td className="border border-gray-200 px-4 py-2">{prod.quantity}</td>
                    <td className="border border-gray-200 px-4 py-2">{prod.archived ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default Reports;
