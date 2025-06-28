import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import fetchWithAuth from '../utils/fetchWithAuth';

const Stock = () => {
    const [stockItems, setStockItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const res = await fetchWithAuth('/stock');
                setStockItems(res);
            } catch (err) {
                console.error('Failed to load stock:', err);
            }
        };

        fetchStock();
    }, []);

    const filteredItems = stockItems.filter(item =>
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-white rounded shadow">
            <h1 className="text-xl font-bold mb-4">Stock Overview</h1>

            <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by product name or SKU..."
                className="border p-2 w-full mb-4"
            />

            <table className="min-w-full border text-sm">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Product</th>
                        <th className="border px-4 py-2">SKU</th>
                        <th className="border px-4 py-2">Quantity</th>
                        <th className="border px-4 py-2">Last Updated</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredItems.map((item) => (
                        <tr key={item.id}>
                            <td className="border px-4 py-2">{item.product_name}</td>
                            <td className="border px-4 py-2">{item.sku}</td>
                            <td className="border px-4 py-2">{item.quantity}</td>
                            <td className="border px-4 py-2">
                                {item.updated_at ? new Date(item.updated_at).toLocaleString() : '-'}
                            </td>
                            <td className="border px-4 py-2">
                                <Link
                                    to={`/stock/${item.product_id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    Manage
                                </Link>
                            </td>
                        </tr>
                    ))}
                    {filteredItems.length === 0 && (
                        <tr>
                            <td colSpan="5" className="text-center py-4 text-gray-500">
                                No products found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Stock;
