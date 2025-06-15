import React from 'react';
import { getCurrentUser, logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex justify-between items-center bg-white border-b p-4 mb-4">
      <h1 className="text-lg font-semibold">Welcome, {user?.username || user?.name}</h1>
      <button
        onClick={handleLogout}
        className="text-red-600 hover:underline"
      >
        Logout
      </button>
    </header>
  );
};

export default Topbar;
