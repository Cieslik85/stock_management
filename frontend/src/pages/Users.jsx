// src/pages/Users.jsx
import React, { useEffect, useState } from 'react';
import fetchWithAuth from '../utils/fetchWithAuth';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [editingUserId, setEditingUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await fetchWithAuth('/users');
      setUsers(res);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUserId) {
        // Update (PATCH)
        const updated = await fetchWithAuth(`/users/${editingUserId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            role: formData.role,
          }),
        });

        setUsers(users.map(u => u.id === updated.user.id ? updated.user : u));
      } else {
        // Create (POST)
        await fetchWithAuth('/users', {
          method: 'POST',
          body: JSON.stringify(formData),
        });

        fetchUsers();
      }

      setFormData({ username: '', email: '', password: '', role: 'user' });
      setEditingUserId(null);
    } catch (err) {
      console.error('Failed to save user:', err);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      username: user.username,
      email: user.email || '',
      password: '',
      role: user.role,
    });
    setEditingUserId(user.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await fetchWithAuth(`/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">User Management</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={e => handleChange('username', e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={e => handleChange('email', e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        {!editingUserId && (
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={e => handleChange('password', e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            value={formData.role}
            onChange={e => handleChange('role', e.target.value)}
            className="border p-2 w-full"
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingUserId ? 'Update User' : 'Add User'}
        </button>
      </form>

      <h2 className="text-lg font-semibold mb-2">All Users</h2>
      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Created At</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">{user.email || '-'}</td>
              <td className="border px-4 py-2 capitalize">{user.role}</td>
              <td className="border px-4 py-2">
                {user.created_at
                  ? new Date(user.created_at).toLocaleString()
                  : '-'}
              </td>
              <td className="border px-4 py-2 flex gap-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="text-yellow-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
