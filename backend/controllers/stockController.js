const Stock = require('../models/stockModel');
const StockMovement = require('../models/stockMovementModel');


// POST /api/stock
exports.createStock = async (req, res) => {
  const { product_id, quantity } = req.body;
  try {
    const newStock = await Stock.create(product_id, quantity);
    res.status(201).json(newStock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create stock entry' });
  }
};
// GET /api/stock
exports.getAllStock = async (req, res) => {
  try {
    const stockItems = await Stock.getAll();
    res.json(stockItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
};

// GET /api/stock/:id
exports.getStockById = async (req, res) => {
  const { id } = req.params;
  try {
    const stock = await Stock.getById(id);
    if (!stock) return res.status(404).json({ error: 'Stock not found' });
    res.json(stock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stock by ID' });
  }
};

// PATCH /api/stock/:id/increase
exports.increaseStock = async (req, res) => {
  const { id } = req.params;
  const { amount, note } = req.body;

  try {
    const updated = await Stock.increaseStock(id, amount);
    if (!updated) return res.status(404).json({ error: 'Stock not found' });

    // Record stock movement
    await StockMovement.create({
      product_id: updated.product_id,
      action_type: 'increase',
      quantity: amount,
      note: note || null
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to increase stock' });
  }
};


// PATCH /api/stock/:id/decrease
exports.decreaseStock = async (req, res) => {
  const { id } = req.params;
  const { amount, note } = req.body;

  try {
    const updated = await Stock.decreaseStock(id, amount);
    if (!updated) return res.status(404).json({ error: 'Stock not found' });

    // Record stock movement
    await StockMovement.create({
      product_id: updated.product_id,
      action_type: 'decrease',
      quantity: amount,
      note: note || null
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to decrease stock' });
  }
};


// PUT /api/stock/:id
exports.updateStock = async (req, res) => {
  const { id } = req.params;
  const { quantity, note } = req.body;

  try {
    const updated = await Stock.update(id, quantity);
    if (!updated) return res.status(404).json({ error: 'Stock not found' });

    // Record as a stock movement (custom action)
    await StockMovement.create({
      product_id: updated.product_id,
      action_type: 'set',
      quantity,
      note: note || null
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update stock' });
  }
};


// DELETE /api/stock/:id
exports.deleteStock = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Stock.remove(id);
    if (!deleted) return res.status(404).json({ error: 'Stock not found' });
    res.json({ message: 'Stock deleted', deleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete stock' });
  }
};
