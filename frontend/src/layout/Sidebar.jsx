import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // optional icons if using lucide-react
import { getCurrentUser } from '../services/authService';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const user = getCurrentUser();

  const menuItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/products', label: 'Products' },
    { to: '/categories', label: 'Categories' },
    { to: '/stock', label: 'Stock' },
    { to: '/reports', label: 'Reports' },
    { to: '/orders', label: 'Orders' },
    ...(user?.role === 'admin' ? [{ to: '/users', label: 'Users' }] : [])
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside
      className={`h-screen bg-white border-r transition-all duration-200 p-4 ${collapsed ? 'w-20' : 'w-64'
        }`}
    >
      <div className="flex justify-between items-center mb-6">
        {!collapsed && <h2 className="text-xl font-bold">Stock</h2>}
        <button onClick={toggleSidebar}>
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? 'justify-center' : ''
              } ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-500'}`
            }
            title={collapsed ? item.label : ''}
          >
            <span>{!collapsed && item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
