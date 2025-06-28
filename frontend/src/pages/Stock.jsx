import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import fetchWithAuth from '../utils/fetchWithAuth';

const Stock = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [stockEntry, setStockEntry] = useState(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newQtyNote, setNewQtyNote] = useState('');
  const [movements, setMovements] = useState([]);

  const fetchData = async () => {
    try {
      const [productRes, stockRes, movementsRes] = await Promise.all([
        fetchWithAuth(`/products/${productId}`),
        fetchWithAuth('/stock'),
        fetchWithAuth(`/stock-movements/product/${productId}`)
      ]);

      setProduct(productRes);
      const match = stockRes.find(s => s.product_id.toString() === productId.toString());
      setStockEntry(match || null);
      setMovements(movementsRes);
    } catch (err) {
      console.error('Error loading stock data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [productId]);

  const updateQty = async (type) => {
    if (!stockEntry || !amount) return;
    try {
      const updated = await fetchWithAuth(`/stock/${stockEntry.id}/${type}`, {
        method: 'PATCH',
        body: JSON.stringify({
          amount: parseInt(amount),
          note
        })
      });
      setStockEntry(updated);
      setAmount('');
      setNote('');
      await fetchData();
    } catch (err) {
      console.error(`Failed to ${type} stock:`, err);
    }
  };

  const handleSetQty = async () => {
    if (!stockEntry || newQty === '') return;
    try {
      const updated = await fetchWithAuth(`/stock/${stockEntry.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          quantity: parseInt(newQty),
          note: newQtyNote
        })
      });
      setStockEntry(updated);
      setNewQty('');
      setNewQtyNote('');
      await fetchData();
    } catch (err) {
      console.error('Failed to set stock:', err);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Manage Stock: {product.name}</h1>

      <div className="mb-4 bg-white p-4 rounded shadow">
        <p><strong>Current Quantity:</strong> {stockEntry ? stockEntry.quantity : 'N/A'}</p>
        <p><strong>Last Updated:</strong> {stockEntry?.updated_at ? new Date(stockEntry.updated_at).toLocaleString() : 'N/A'}</p>
      </div>

      {stockEntry && (
        <>
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-md font-semibold mb-3">Adjust Quantity</h2>

            <div className="mb-3">
              <label className="block text-sm font-medium">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="border p-2 w-full"
                placeholder="e.g. 10"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Comment (optional)</label>
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                className="border p-2 w-full"
                placeholder="e.g. Received shipment"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => updateQty('increase')}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Increase
              </button>
              <button
                onClick={() => updateQty('decrease')}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Decrease
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-md font-semibold mb-3">Set Quantity Directly</h2>
            <div className="mb-3">
              <label className="block text-sm font-medium">New Quantity</label>
              <input
                type="number"
                value={newQty}
                onChange={e => setNewQty(e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Comment (optional)</label>
              <input
                type="text"
                value={newQtyNote}
                onChange={e => setNewQtyNote(e.target.value)}
                className="border p-2 w-full"
                placeholder="e.g. Manual count correction"
              />
            </div>

            <button
              onClick={handleSetQty}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Set Quantity
            </button>
          </div>
        </>
      )}

      {/* Movement History */}
      <h2 className="text-lg font-semibold mb-2">Stock Movement History</h2>
      {movements.length > 0 ? (
        <table className="min-w-full bg-white border text-sm">
          <thead>
            <tr>
              <th className="border px-4 py-2">Type</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Note</th>
              <th className="border px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {movements.map(m => (
              <tr key={m.id}>
                <td className="border px-4 py-2 capitalize">{m.movement_type}</td>
                <td className="border px-4 py-2">{m.quantity}</td>
                <td className="border px-4 py-2">{m.note || '-'}</td>
                <td className="border px-4 py-2">{new Date(m.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-sm text-gray-600">No movement history available.</p>
      )}
    </div>
  );
};

export default Stock;
