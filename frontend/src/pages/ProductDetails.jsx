// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import fetchWithAuth from '../utils/fetchWithAuth';
import ConfirmDialog from '../components/ConfirmDialog';
import Button from '../components/button';

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

  const [deleteError, setDeleteError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [archiveError, setArchiveError] = useState('');
  const [archiveSuccess, setArchiveSuccess] = useState('');

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

  // Change handleDelete to only perform the delete, not open the dialog
  const handleDelete = async () => {
    setDeleteError('');
    try {
      await fetchWithAuth(`/products/${id}`, { method: 'DELETE' });
      setConfirmOpen(false);
      navigate('/products');
    } catch (err) {
      setDeleteError(err.message);
      setConfirmOpen(false);
    }
  };

  const handleArchive = async () => {
    setArchiveError('');
    setArchiveSuccess('');
    try {
      await fetchWithAuth(`/products/${id}/archive`, { method: 'PATCH' });
      setArchiveSuccess('Product archived successfully.');
      // Optionally, update UI or redirect
    } catch (err) {
      setArchiveError('Error archiving product.');
      console.error('Error archiving product:', err);
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

        {/* --- Delete Product --- */}
        <div className="mt-10">
          <Button
            color="red"
            onClick={() => setConfirmOpen(true)}
          >
            Delete Product
          </Button>
        </div>

        <ConfirmDialog
          open={confirmOpen}
          title="Delete Product"
          message="Are you sure you want to delete this product? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setConfirmOpen(false)}
        />

        {/* This will always show below the Delete button, even after dialog closes */}
        {deleteError && (
          <div className="mt-4 text-red-600 font-semibold">{deleteError}</div>
        )}
        {archiveError && (
          <div className="mt-4 text-red-600 font-semibold">{archiveError}</div>
        )}
        {archiveSuccess && (
          <div className="mt-4 text-green-600 font-semibold">{archiveSuccess}</div>
        )}

        <div className="mt-4">
          <Button color="yellow" onClick={handleArchive}>
            Archive Product
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
