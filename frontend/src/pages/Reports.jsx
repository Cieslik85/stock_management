import React, { useEffect, useState } from 'react';
import fetchWithAuth from '../utils/fetchWithAuth';
import Button from '../components/button';
import Pagination from '../components/Pagination';

const Reports = () => {
  const [stockMovements, setStockMovements] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('stock');
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchWithAuth('/stock-movements').then(setStockMovements);
    fetchWithAuth('/orders').then(setOrders);
    fetchWithAuth('/products').then(setProducts);
  }, []);


  // Filtering
  const filteredProducts = products.filter(prod =>
    prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prod.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStockMovements = stockMovements.filter(mv =>
  (mv.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mv.sku?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredOrders = orders.filter(order =>
  (order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination/limit
  const totalProductPages = Math.max(1, Math.ceil(filteredProducts.length / limit));
  const totalStockPages = Math.max(1, Math.ceil(filteredStockMovements.length / limit));
  const totalOrderPages = Math.max(1, Math.ceil(filteredOrders.length / limit));

  // Reset page to 1 if searchTerm or limit changes
  useEffect(() => { setPage(1); }, [searchTerm, limit, activeTab]);

  const getVisible = (arr, totalPages) => {
    const start = (page - 1) * limit;
    return arr.slice(start, start + limit);
  };

  const visibleProducts = getVisible(filteredProducts, totalProductPages);
  const visibleStockMovements = getVisible(filteredStockMovements, totalStockPages);
  const visibleOrders = getVisible(filteredOrders, totalOrderPages);

  const limitOptions = [20, 40, 60, 100, 200];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Reports</h2>

      {/* Search Form */}
      <form
        className="flex items-center max-w-sm mx-auto mb-4"
        onSubmit={e => e.preventDefault()}
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
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">
              Showing {visibleStockMovements.length} of {filteredStockMovements.length} filtered, {stockMovements.length} total records
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="limit-stock" className="text-sm">Show</label>
              <select
                id="limit-stock"
                className="border rounded px-2 py-1 text-sm"
                value={limit}
                onChange={e => setLimit(Number(e.target.value))}
              >
                {limitOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <span className="text-sm">records</span>
            </div>
          </div>
          <div className="flex justify-end mb-2">
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={totalStockPages}
            />
          </div>
          <div className="bg-white rounded shadow p-4 mb-4">
            <table className="min-w-full text-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2">SKU</th>
                  <th className="border border-gray-200 px-4 py-2">Name</th>
                  <th className="border border-gray-200 px-4 py-2">Type</th>
                  <th className="border border-gray-200 px-4 py-2">Quantity</th>
                  <th className="border border-gray-200 px-4 py-2">User</th>
                  <th className="border border-gray-200 px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {visibleStockMovements.map(mv => (
                  <tr key={mv.id}>
                    <td className="border border-gray-200 px-4 py-2">{mv.sku}</td>
                    <td className="border border-gray-200 px-4 py-2">{mv.product_name}</td>
                    <td className="border border-gray-200 px-4 py-2">{mv.action_type}</td>
                    <td className="border border-gray-200 px-4 py-2">{mv.quantity}</td>
                    <td className="border border-gray-200 px-4 py-2">{mv.user_name}</td>
                    <td className="border border-gray-200 px-4 py-2">{new Date(mv.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mb-2">
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={totalStockPages}
            />
          </div>
        </section>
      )}

      {/* Orders Report */}
      {activeTab === 'orders' && (
        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-2">Orders Report</h3>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">
              Showing {visibleOrders.length} of {filteredOrders.length} filtered, {orders.length} total records
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="limit-orders" className="text-sm">Show</label>
              <select
                id="limit-orders"
                className="border rounded px-2 py-1 text-sm"
                value={limit}
                onChange={e => setLimit(Number(e.target.value))}
              >
                {limitOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <span className="text-sm">records</span>
            </div>
          </div>
          <div className="flex justify-end mb-2">
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={totalOrderPages}
            />
          </div>
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
                {visibleOrders.map(order => (
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
          <div className="flex justify-end mb-2">
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={totalOrderPages}
            />
          </div>
        </section>
      )}

      {/* Product Report */}
      {activeTab === 'products' && (
        <section>
          <h3 className="text-xl font-semibold mb-2">Product Report</h3>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">
              Showing {visibleProducts.length} of {filteredProducts.length} filtered, {products.length} total records
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="limit-products" className="text-sm">Show</label>
              <select
                id="limit-products"
                className="border rounded px-2 py-1 text-sm"
                value={limit}
                onChange={e => setLimit(Number(e.target.value))}
              >
                {limitOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <span className="text-sm">records</span>
            </div>
          </div>
          <div className="flex justify-end mb-2">
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={totalProductPages}
            />
          </div>
          <div className="bg-white rounded shadow p-4 mb-4">
            <table className="min-w-full text-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2">SKU</th>
                  <th className="border border-gray-200 px-4 py-2">Name</th>
                  <th className="border border-gray-200 px-4 py-2">Stock</th>
                  <th className="border border-gray-200 px-4 py-2">Archived</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {visibleProducts.map(prod => (
                  <tr key={prod.id}>
                    <td className="border border-gray-200 px-4 py-2">{prod.sku}</td>
                    <td className="border border-gray-200 px-4 py-2">{prod.name}</td>
                    <td className="border border-gray-200 px-4 py-2">{prod.quantity}</td>
                    <td className="border border-gray-200 px-4 py-2">{prod.archived ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mb-2">
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={totalProductPages}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default Reports;
