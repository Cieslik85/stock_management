// src/pages/Categories.jsx
import React, { useEffect, useState } from 'react';
import fetchWithAuth from '../utils/fetchWithAuth';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetchWithAuth('/categories');
      setCategories(res);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const newCat = await fetchWithAuth('/categories', {
        method: 'POST',
        body: JSON.stringify({ name })
      });
      setCategories(prev => [...prev, newCat]);
      setName('');
    } catch (err) {
      console.error('Failed to add category:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;

    try {
      await fetchWithAuth(`/categories/${id}`, { method: 'DELETE' });
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Categories</h1>

      <form onSubmit={handleAdd} className="mb-6 space-y-3">
        <label className="block text-sm font-medium">New Category Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-2 w-full"
          placeholder="e.g. Electronics"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Category</button>
      </form>

      <h2 className="text-lg font-semibold mb-2">Existing Categories</h2>
      <ul className="space-y-2">
        {categories.map(cat => (
          <li key={cat.id} className="flex justify-between items-center border p-2 rounded">
            <span>{cat.name}</span>
            <button
              onClick={() => handleDelete(cat.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
