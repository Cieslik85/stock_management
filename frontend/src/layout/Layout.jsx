import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';


/**
 * Layout component that structures the main application layout.
 * 
 * Renders a sidebar and a topbar, with the main content area displaying
 * the current route's component via the <Outlet />.
 * 
 * @component
 * @returns {JSX.Element} The layout structure with sidebar, topbar, and main content.
 */
const Layout = () => {
  return (
    <>

      <div className="flex min-h-screen bg-muted text-foreground">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 p-6 bg-muted">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
