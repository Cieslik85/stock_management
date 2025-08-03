import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchWithAuth from '../utils/fetchWithAuth';
import { getCurrentUser } from '../services/authService';
import Button from '../components/button';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showArchived, setShowArchived] = useState(false);

  const [stock, setStock] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    category_id: ''
  });

  const user = getCurrentUser();
  const isAuthorized = user && (user.role === 'admin' || user.role === 'manager');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, stockRes, categoriesRes] = await Promise.all([
          fetchWithAuth('/products'),
          fetchWithAuth('/stock'),
          fetchWithAuth('/categories')
        ]);
        setProducts(productsRes);
        setStock(stockRes);
        setCategories(categoriesRes);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const url = `/products${showArchived ? '?showArchived=true' : ''}`;
      const data = await fetchWithAuth(url);
      setProducts(data);
    };
    fetchProducts();
  }, [showArchived]);

  // const handleChange = (field, value) => {
  //   setFormData(prev => ({ ...prev, [field]: value }));
  // };

  // const handleDelete = async (id) => {
  //   if (!window.confirm('Are you sure you want to delete this product?')) return;
  //   try {
  //     await fetchWithAuth(`/products/${id}`, { method: 'DELETE' });
  //     setProducts(prev => prev.filter(prod => prod.id !== id));
  //   } catch (err) {
  //     console.error('Error deleting product:', err);
  //   }
  // };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const newProduct = await fetchWithAuth('/products', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });
      setProducts(prev => [...prev, newProduct]);
      setFormData({
        name: '',
        sku: '',
        description: '',
        price: '',
        category_id: ''
      });
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };

  const getStockQuantity = (productId) => {
    const stockEntry = stock.find(s => s.product_id === productId);
    return stockEntry ? stockEntry.quantity : 0;
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : 'Unknown';
  };

  const filteredProducts = products.filter(prod =>
    prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prod.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Products</h1>

      <div className="mb-4 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 w-full sm:w-1/2"
        />


        <Button
          color="green"
          onClick={() => navigate(`/newProduct`)}
        >
          New Product
        </Button>
      </div>

      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={showArchived}
          onChange={e => setShowArchived(e.target.checked)}
          className="mr-2"
        />
        Show archived products
      </label>

      <h2 className="text-lg font-semibold mb-2">Product List</h2>
      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">SKU</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Archived</th> {/* Added column */}
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(prod => (
            <tr key={prod.id}>
              <td className="border px-4 py-2">{prod.id}</td>
              <td className="border px-4 py-2">{prod.name}</td>
              <td className="border px-4 py-2">{prod.sku}</td>
              <td className="border px-4 py-2">${parseFloat(prod.price).toFixed(2)}</td>
              <td className="border px-4 py-2">{getStockQuantity(prod.id)}</td>
              <td className="border px-4 py-2">{getCategoryName(prod.category_id)}</td>
              <td className="border px-4 py-2">
                {prod.archived ? (
                  <span className="text-red-600 font-semibold">Yes</span>
                ) : (
                  <span className="text-green-700">No</span>
                )}
              </td>
              <td className="border px-4 py-2 flex gap-4">
                <Button
                  color="green"
                  onClick={() => navigate(`/products/${prod.id}`)}
                >
                  Manage
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
