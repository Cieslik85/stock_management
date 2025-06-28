import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchWithAuth from '../utils/fetchWithAuth';
import { getCurrentUser } from '../services/authService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    category_id: ''
  });

  const user = getCurrentUser();
  const isAuthorized = user && (user.role === 'admin' || user.role === 'manager');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, stockRes, categoriesRes] = await Promise.all([
          fetchWithAuth('/products'),
          fetchWithAuth('/stock'),
          fetchWithAuth('/categories')
        ]);
        setProducts(productsRes);
        setStock(stockRes);
        setCategories(categoriesRes);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const newProduct = await fetchWithAuth('/products', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });
      setProducts(prev => [...prev, newProduct]);
      setFormData({
        name: '',
        sku: '',
        description: '',
        price: '',
        category_id: ''
      });
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };

  const getStockQuantity = (productId) => {
    const stockEntry = stock.find(s => s.product_id === productId);
    return stockEntry ? stockEntry.quantity : 0;
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Products</h1>

      {isAuthorized && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
          {/* Input fields... (same as before, minus quantity) */}
          {/* ... */}
        </form>
      )}

      <h2 className="text-lg font-semibold mb-2">Product List</h2>
      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">SKU</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(prod => (
            <tr key={prod.id}>
              <td className="border px-4 py-2">{prod.id}</td>
              <td className="border px-4 py-2">{prod.name}</td>
              <td className="border px-4 py-2">{prod.sku}</td>
              <td className="border px-4 py-2">${parseFloat(prod.price).toFixed(2)}</td>
              <td className="border px-4 py-2">{getStockQuantity(prod.id)}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => navigate(`/stock/${prod.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  Manage Stock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
