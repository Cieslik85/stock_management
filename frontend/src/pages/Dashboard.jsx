import React, { useEffect, useState } from 'react';
import fetchWithAuth from '../utils/fetchWithAuth';
import { getCurrentUser } from '../services/authService';


const Dashboard = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = getCurrentUser();

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const data = await fetchWithAuth('/stock');
        setStock(data);
      } catch (err) {
        console.error('Error loading stock:', err.message);
        setError('Failed to load stock data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, []);

  if (loading) return <p>Loading stock...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Welcome {user?.username || user?.name}!</h1>
      <h2>Stock Overview</h2>
      <ul>
        {stock.map(item => (
          <li key={item.id}>
            {item.product_name} – {item.quantity} pcs
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
