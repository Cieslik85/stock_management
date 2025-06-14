
const { Parser } = require('json2csv');
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
  const { threshold, startDate, endDate, format } = req.query;

  try {
    const data = await Report.getLowStockItems(
      threshold ? parseInt(threshold) : undefined,
      startDate || null,
      endDate || null
    );

    if (format === 'csv') {
      const parser = new Parser();
      const csv = parser.parse(data);
      res.header('Content-Type', 'text/csv');
      res.attachment('low_stock_report.csv');
      return res.send(csv);
    }

    res.json(data);
  } catch (err) {
    console.error('Error fetching low stock data:', err);
    res.status(500).json({ error: 'Failed to fetch low stock report' });
  }
};

// Filtered report (optional query: product_id, min_quantity)
exports.getFilteredStock = async (req, res) => {
  const { product_id, min_quantity } = req.query;

  try {
    const data = await Report.getFilteredStock({ product_id, min_quantity });

    res.json(data);
  } catch (err) {
    console.error('Error filtering stock:', err);
    res.status(500).json({ error: 'Failed to filter stock' });
  }
};

// Download filtered stock as CSV
exports.downloadStockCSV = async (req, res) => {
  const { product_id, min_quantity } = req.query;

  try {
    const data = await Report.getFilteredStock({ product_id, min_quantity });
    const parser = new Parser();
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('stock_report.csv');
    res.send(csv);
  } catch (err) {
    console.error('Error exporting CSV:', err);
    res.status(500).json({ error: 'Failed to export stock report' });
  }
};

// GET /api/reports/stock-summary/csv
exports.downloadStockSummaryCsv = async (req, res) => {
  try {
    const data = await Report.getStockSummary();
    const parser = new Parser();
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="stock_summary_report.csv"');
    res.send(csv);
  } catch (err) {
    console.error('Error exporting stock summary CSV:', err);
    res.status(500).json({ error: 'Failed to export summary report' });
  }
};