const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const verifyToken = require('../middleware/authMiddleware');

// Reporting routes
router.get('/low-stock', verifyToken, reportController.getLowStock);
router.get('/stock-summary', verifyToken, reportController.getStockSummary);

module.exports = router;
