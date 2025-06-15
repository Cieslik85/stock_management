// src/layout/Layout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-4">
        <Topbar />
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
