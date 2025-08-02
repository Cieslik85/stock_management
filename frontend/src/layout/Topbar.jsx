import React from 'react';
import { getCurrentUser, logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Topbar = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between bg-white border-b px-6 py-4 shadow-sm">
      <h1 className="text-lg font-semibold text-gray-800">
        Welcome, {user?.username || user?.name}
      </h1>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
      >
        <LogOut size={18} />
        Logout
      </button>
    </header>
  );
};

export default Topbar;
