// Handles stock changes history (audit trail)

const StockMovement = require('../models/stockMovementModel');

exports.createStockMovement = async (req, res) => {
  try {
    const movement = await StockMovement.create(req.body);
    res.status(201).json(movement);
  } catch (err) {
    console.error('Error creating stock movement:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllStockMovements = async (req, res) => {
  try {
    const movements = await StockMovement.getAll();
    res.status(200).json(movements);
  } catch (err) {
    console.error('Error fetching stock movements:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getStockMovementsByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const movements = await StockMovement.getByProductId(productId);
    res.status(200).json(movements);
  } catch (err) {
    console.error('Error fetching movements for product:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
