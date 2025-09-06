import React from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';

export function StockTable({ tableRows, search, setSearch, filteredStock }) {
    return (
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
    );
}

export function StockPieChart({ pieData }) {
    return (
        <div>
            <h3>Stock Distribution</h3>
            <Pie data={pieData} />
        </div>
    );
}

export function StockBarChart({ barData }) {
    return (
        <div>
            <h3>Top Products</h3>
            <Bar data={barData} />
        </div>
    );
}

export function StockLineChart({ lineData }) {
    return (
        <div>
            <h3>Stock Trend (Top 3)</h3>
            <Line data={lineData} />
        </div>
    );
}
