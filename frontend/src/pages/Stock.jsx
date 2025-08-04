/**
 * Stock Page
 * Displays a table of stock items for non-archived products.
 * Allows searching and managing stock for each product.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import fetchWithAuth from '../utils/fetchWithAuth';
import Button from '../components/Button';

const Stock = () => {
    // State for stock items and search term
    const [stockItems, setStockItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetches stock data on mount
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

    // Filters out archived products
    const filteredItems = stockItems
        .filter(item => !item.archived) // Exclude archived products
        .filter(item =>
            item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase())
        );

    // Renders a table with product info and manage button
    return (
        <div className="p-6 bg-white rounded shadow">
            <h1 className="text-xl font-bold mb-4">Stock Overview</h1>

            <form
                className="flex items-center max-w-sm mx-auto mb-4"
                onSubmit={e => e.preventDefault()}
                autoComplete="off"
            >
                <label htmlFor="simple-search" className="sr-only">Search</label>
                <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" aria-hidden="true" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="simple-search"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                        placeholder="Search by name or SKU..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        required
                    />
                </div>
            </form>

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
                                <Link to={`/stock/${item.product_id}`}>
                                    <Button color="yellow">
                                        Manage
                                    </Button>
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
