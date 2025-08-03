// src/pages/NewProduct.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchWithAuth from '../utils/fetchWithAuth';
import Button from '../components/button';

const NewProduct = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    quantity: '',
    category_id: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetchWithAuth('/categories');
        setCategories(res);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await fetchWithAuth('/products', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity)
        })
      });
      navigate('/products');
    } catch (err) {
      console.error('Error creating product:', err);

      // If response includes a readable error
      if (err.message && err.message.includes('SKU already exists')) {
        setError('A product with this SKU already exists.');
      } else {
        setError('Failed to create product. Please try again.');
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Add New Product</h1>
      {error && (
        <div className="text-red-600 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">SKU</label>
          <input
            type="text"
            value={formData.sku}
            onChange={e => handleChange('sku', e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={formData.description}
            onChange={e => handleChange('description', e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={e => handleChange('price', e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={e => handleChange('quantity', e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            value={formData.category_id}
            onChange={e => handleChange('category_id', e.target.value)}
            className="border p-2 w-full"
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <Button
            color="green"
            type="submit"

          >
            Create Product
          </Button>
          <Button
            color="red"
            type="button"
            onClick={() => navigate('/products')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewProduct;
