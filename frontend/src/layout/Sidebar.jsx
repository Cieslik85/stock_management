import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { getCurrentUser } from '../services/authService';
import Button from '../components/button';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const user = React.useMemo(() => getCurrentUser(), []);

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
        {!collapsed && <h2 className="text-xl font-bold text-blue-600">Forest Rack</h2>}
        <Button
          color="green"
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 min-w-0 w-8 h-8 flex items-center justify-center"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Menu size={20} color="white" /> : <X size={20} color="white" />}
        </Button>
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
