// controllers/reportController.js
const Report = require('../models/reportModel');

// GET /api/reports/stock-summary
exports.getStockSummary = async (req, res) => {
  try {
    const summary = await Report.getStockSummary();
    res.json(summary);
  } catch (error) {
    console.error('Error fetching stock summary:', error);
    res.status(500).json({ error: 'Failed to fetch stock summary' });
  }
};

// GET /api/reports/low-stock
exports.getLowStock = async (req, res) => {
  const threshold = parseInt(req.query.threshold) || 5; // Default threshold of 5
  try {
    const lowStockItems = await Report.getLowStockItems(threshold);
    res.json(lowStockItems);
  } catch (error) {
    console.error('Error fetching low stock data:', error);
    res.status(500).json({ error: 'Failed to fetch low stock report' });
  }
};