import React, { useEffect, useState } from 'react';
import fetchWithAuth from '../utils/fetchWithAuth';
import { getCurrentUser } from '../services/authService';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);


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

  // Prepare chart data
  const labels = stock.map(item => item.product_name);
  const quantities = stock.map(item => item.quantity);

  // Pie chart data
  const pieData = {
    labels,
    datasets: [
      {
        data: quantities,
        backgroundColor: [
          '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6', '#38bdf8', '#facc15', '#4ade80', '#fca5a5'
        ],
      },
    ],
  };

  // Bar chart data (top 5 products)
  const topProducts = [...stock]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
  const barData = {
    labels: topProducts.map(item => item.product_name),
    datasets: [
      {
        label: 'Top 5 Products by Quantity',
        data: topProducts.map(item => item.quantity),
        backgroundColor: '#60a5fa',
      },
    ],
  };

  // Line chart data (simulate stock trend)
  // If you have historical data, replace this with real data
  const lineData = {
    labels: labels,
    datasets: [
      {
        label: 'Stock Trend',
        data: quantities.map(qty => qty - Math.floor(Math.random() * 10)),
        borderColor: '#34d399',
        backgroundColor: 'rgba(52,211,153,0.2)',
        fill: true,
      },
      {
        label: 'Current Stock',
        data: quantities,
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96,165,250,0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div>
      <h1>Welcome {user?.username || user?.name}!</h1>
      <h2>Stock Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
        {/* Table */}
        <div>
          <h3>Stock Table</h3>
          <table className="min-w-full text-sm border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-2">Product</th>
                <th className="border border-gray-200 px-4 py-2">Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stock.map(item => (
                <tr key={item.id}>
                  <td className="border border-gray-200 px-4 py-2">{item.product_name}</td>
                  <td className="border border-gray-200 px-4 py-2">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pie Chart */}
        <div>
          <h3>Stock Distribution</h3>
          <Pie data={pieData} />
        </div>
        {/* Bar Chart */}
        <div>
          <h3>Top Products</h3>
          <Bar data={barData} />
        </div>
        {/* Line Chart */}
        <div>
          <h3>Stock Trend</h3>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
