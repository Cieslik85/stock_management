// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import fetchWithAuth from '../utils/fetchWithAuth';

const ProductDetails = () => {
  const { id } = useParams(); // product ID
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [stock, setStock] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    category_id: ''
  });

  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, stockRes, categoriesRes] = await Promise.all([
          fetchWithAuth(`/products/${id}`),
          fetchWithAuth(`/stock`),
          fetchWithAuth(`/categories`)
        ]);

        const matchedStock = stockRes.find(s => s.product_id.toString() === id);

        setProduct(productRes);
        setStock(matchedStock || null);
        setCategories(categoriesRes);
        setFormData({
          name: productRes.name,
          sku: productRes.sku,
          description: productRes.description,
          price: productRes.price,
          category_id: productRes.category_id
        });
      } catch (err) {
        console.error('Error loading product details:', err);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const updated = await fetchWithAuth(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...formData, price: parseFloat(formData.price) })
      });
      setProduct(updated);
      setEditing(false);
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  const handleStockChange = async (type) => {
    if (!stock || !amount) return;
    try {
      const updated = await fetchWithAuth(`/stock/${stock.id}/${type}`, {
        method: 'PATCH',
        body: JSON.stringify({ amount: parseInt(amount), note })
      });
      setStock(updated);
      setAmount('');
      setNote('');
    } catch (err) {
      console.error(`Error adjusting stock:`, err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetchWithAuth(`/products/${id}`, { method: 'DELETE' });
      navigate('/products');
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Product Details</h1>

      <form onSubmit={handleUpdateProduct} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            className="border p-2 w-full"
            disabled={!editing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">SKU</label>
          <input
            type="text"
            value={formData.sku}
            onChange={e => handleChange('sku', e.target.value)}
            className="border p-2 w-full"
            disabled={!editing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={formData.description}
            onChange={e => handleChange('description', e.target.value)}
            className="border p-2 w-full"
            disabled={!editing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            value={formData.price}
            onChange={e => handleChange('price', e.target.value)}
            className="border p-2 w-full"
            disabled={!editing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            value={formData.category_id}
            onChange={e => handleChange('category_id', e.target.value)}
            className="border p-2 w-full"
            disabled={!editing}
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {editing ? (
          <div className="flex gap-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Save
            </button>
            <button type="button" onClick={() => setEditing(false)} className="border px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} type="button" className="bg-yellow-500 text-white px-4 py-2 rounded">
            Edit
          </button>
        )}
      </form>

      {/* --- Stock Management --- */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Stock</h2>
        <p><strong>Current Quantity:</strong> {stock ? stock.quantity : 'N/A'}</p>

        {stock && (
          <div className="mt-4 space-y-3">
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Amount"
              className="border p-2 w-full"
            />
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Note (optional)"
              className="border p-2 w-full"
            />
            <div className="flex gap-4">
              <button onClick={() => handleStockChange('increase')} className="bg-green-600 text-white px-4 py-2 rounded">
                Increase
              </button>
              <button onClick={() => handleStockChange('decrease')} className="bg-red-600 text-white px-4 py-2 rounded">
                Decrease
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- Delete Product --- */}
      <div className="mt-10">
        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">
          Delete Product
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
