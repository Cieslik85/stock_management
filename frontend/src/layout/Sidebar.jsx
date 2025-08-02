import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { getCurrentUser } from '../services/authService';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const user = getCurrentUser();

  const menuItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/products', label: 'Products' },
    { to: '/categories', label: 'Categories' },
    { to: '/stock', label: 'Stock' },
    { to: '/orders', label: 'Orders' },
    { to: '/reports', label: 'Reports' },
    ...(user?.role === 'admin' ? [{ to: '/users', label: 'Users' }] : [])
  ];

  return (
    <aside
      className={`h-screen bg-white border-r shadow-sm transition-all duration-300 ease-in-out flex flex-col ${collapsed ? 'w-16' : 'w-64'
        }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <h2 className="text-xl font-bold text-blue-600">Stock</h2>}
        <button onClick={() => setCollapsed(!collapsed)} className="text-gray-600 hover:text-blue-500">
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100 hover:text-blue-500'
              } ${collapsed ? 'justify-center' : 'justify-start'}`
            }
            title={collapsed ? item.label : ''}
          >
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
