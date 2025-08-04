// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import ProductStock from './pages/ProductStock';
import Stock from './pages/Stock';
import Reports from './pages/Reports';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import Layout from './layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import NewProduct from './pages/NewProduct';
import ProductDetails from './pages/ProductDetails';
import Landing from './pages/Landing';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/products"
            element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <Products />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/:id"
            element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <ProductDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <Categories />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stock"
            element={
              <ProtectedRoute roles={['admin', 'manager', 'user']}>
                <Stock />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stock/:productId"
            element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <ProductStock />
              </ProtectedRoute>
            }
          />

          <Route
            path="/newProduct"
            element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <NewProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <Reports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute roles={['admin', 'manager', 'user']}>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute roles={['admin']}>
                <Users />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/" element={<Landing />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
