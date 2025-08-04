import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import fetchWithAuth from '../utils/fetchWithAuth';
import Button from '../components/Button';


const Stock = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [stockEntry, setStockEntry] = useState(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newQtyNote, setNewQtyNote] = useState('');
  const [movements, setMovements] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);


  const fetchData = async () => {
    try {
      const [productRes, stockRes, movementsRes, productsRes] = await Promise.all([
        fetchWithAuth(`/products/${productId}`),
        fetchWithAuth('/stock'),
        fetchWithAuth(`/stock-movements/product/${productId}`),
        fetchWithAuth('/products')
      ]);

      setProduct(productRes);
      const match = stockRes.find(s => s.product_id.toString() === productId.toString());
      setStockEntry(match || null);
      setMovements(movementsRes);
      setAllProducts(productsRes);
    } catch (err) {
      console.error('Error loading stock data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [productId]);

  // Search logic for switching products
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }
    const results = allProducts.filter(prod =>
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, allProducts]);

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

  // Sort movements by date descending (most recent first)
  const sortedMovements = [...movements].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  const displayedMovements = showAll ? sortedMovements : sortedMovements.slice(0, 5);


  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-4">
      {/* Product Search Box */}
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
              <Button
                onClick={() => updateQty('increase')}
                color="green"
              >
                Increase
              </Button>
              <Button
                onClick={() => updateQty('decrease')}
                color="red"
              >
                Decrease
              </Button>
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

            <Button
              onClick={handleSetQty}
              color="blue"
            >
              Set Quantity
            </Button>
          </div>
        </>
      )}

      {/* Movement History */}
      <h2 className="text-lg font-semibold mb-2">Stock Movement History</h2>
      {movements.length > 0 ? (
        <>
          <table className="min-w-full bg-white border text-sm">
            <thead>
              <tr>
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Comment</th>
                <th className="border px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {displayedMovements.map(m => (
                <tr key={m.id}>
                  <td className="border px-4 py-2 capitalize">{m.action_type}</td>
                  <td className="border px-4 py-2">{m.quantity}</td>
                  <td className="border px-4 py-2">{m.note || '-'}</td>
                  <td className="border px-4 py-2">{new Date(m.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {movements.length > 5 && (
            <div className="mt-2 flex justify-end">
              <Button
                color="blue"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Show Less' : 'View All History'}
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-600">No movement history available.</p>
      )}
    </div>
  );
};

export default Stock;
