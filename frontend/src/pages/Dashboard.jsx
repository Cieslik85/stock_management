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
  const [search, setSearch] = useState('');

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


  // Search/filter for table

  const filteredStock = stock.filter(item =>
    item.product_name.toLowerCase().includes(search.toLowerCase())
  );

  // Table: show top 20 filtered products
  const tableRows = filteredStock.slice(0, 20);

  // Pie chart: top 10 products, group rest as 'Other'
  const PIE_LIMIT = 10;
  const sortedStock = [...stock].sort((a, b) => b.quantity - a.quantity);
  const pieTop = sortedStock.slice(0, PIE_LIMIT);
  const pieOther = sortedStock.slice(PIE_LIMIT);
  const pieLabels = [
    ...pieTop.map(item => item.product_name),
    ...(pieOther.length ? ['Other'] : [])
  ];
  const pieDataArr = [
    ...pieTop.map(item => item.quantity),
    ...(pieOther.length ? [pieOther.reduce((sum, item) => sum + item.quantity, 0)] : [])
  ];
  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        data: pieDataArr,
        backgroundColor: [
          '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6', '#38bdf8', '#facc15', '#4ade80', '#fca5a5', '#d1d5db'
        ],
      },
    ],
  };

  // Bar chart: top 5 products
  const topProducts = sortedStock.slice(0, 5);
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

  // Line chart: top 3 products, show their quantity trend (simulated)
  const LINE_LIMIT = 3;
  const lineProducts = sortedStock.slice(0, LINE_LIMIT);
  const lineData = {
    labels: lineProducts.map(item => item.product_name),
    datasets: lineProducts.map((item, idx) => ({
      label: item.product_name,
      data: [item.quantity - Math.floor(Math.random() * 10), item.quantity],
      borderColor: ['#34d399', '#60a5fa', '#fbbf24'][idx],
      backgroundColor: ['rgba(52,211,153,0.2)', 'rgba(96,165,250,0.2)', 'rgba(251,191,36,0.2)'][idx],
      fill: true,
    })),
  };

  return (
    <div>
      <h2>Stock Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
        {/* Table with search and limit */}
        <div>
          <h3>Stock Table</h3>
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-2 py-1 mb-2 w-full"
          />
          <table className="min-w-full text-sm border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-2">Product</th>
                <th className="border border-gray-200 px-4 py-2">Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableRows.map(item => (
                <tr key={item.id}>
                  <td className="border border-gray-200 px-4 py-2">{item.product_name}</td>
                  <td className="border border-gray-200 px-4 py-2">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStock.length > 20 && (
            <div className="text-xs text-gray-500 mt-1">Showing top 20 of {filteredStock.length} products. Use search to filter.</div>
          )}
        </div>
        {/* Pie Chart: top 10 + Other */}
        <div>
          <h3>Stock Distribution</h3>
          <Pie data={pieData} />
        </div>
        {/* Bar Chart: top 5 */}
        <div>
          <h3>Top Products</h3>
          <Bar data={barData} />
        </div>
        {/* Line Chart: top 3 */}
        <div>
          <h3>Stock Trend (Top 3)</h3>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
