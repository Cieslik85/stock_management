// src/pages/Categories.jsx
import React, { useEffect, useState } from 'react';
import fetchWithAuth from '../utils/fetchWithAuth';
import Button from '../components/button';
import ConfirmDialog from '../components/ConfirmDialog';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
    setToDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setConfirmOpen(false);
    try {
      await fetchWithAuth(`/categories/${toDeleteId}`, { method: 'DELETE' });
      setCategories(prev => prev.filter(c => c.id !== toDeleteId));
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
    setToDeleteId(null);
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
        <Button color="green">Add Category</Button>
      </form>

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

      <h2 className="text-lg font-semibold mb-2">Existing Categories</h2>
      <ul className="space-y-2">
        {categories.map(cat => (
          <li key={cat.id} className="flex justify-between items-center border p-2 rounded">
            <span>{cat.name}</span>
            <div className="flex gap-2">
              <Button
                color="yellow"
                onClick={() => {
                  // TODO: Implement edit logic/modal here
                  alert(`Edit category: ${cat.name}`);
                }}
              >
                Edit
              </Button>
              <Button color="red" onClick={() => handleDelete(cat.id)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default Categories;
