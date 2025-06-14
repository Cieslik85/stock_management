const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const verifyToken = require('../middleware/authMiddleware');

// Reporting routes
router.get('/low-stock', verifyToken, reportController.getLowStock);
router.get('/stock-summary', verifyToken, reportController.getStockSummary);
router.get('/filtered', verifyToken, reportController.getFilteredStock);
router.get('/filtered/csv', verifyToken, reportController.downloadStockCSV);
router.get('/stock-summary/csv', verifyToken, reportController.downloadStockSummaryCsv);

module.exports = router;
