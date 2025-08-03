import React from 'react';
import { getCurrentUser, logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Button from '../components/button';

const Topbar = () => {
  const user = React.useMemo(() => getCurrentUser(), []);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.username || user?.name;

  return (
    <header className="flex items-center justify-between bg-white border-b px-6 py-4 shadow-sm">
      <h1 className="text-lg font-semibold text-gray-800">
        {displayName}
      </h1>
      <Button color="red" onClick={handleLogout} className="flex items-center gap-2">
        <LogOut size={18} />
        Logout
      </Button>
    </header>
  );
};

export default Topbar;
