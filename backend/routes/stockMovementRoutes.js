const express = require('express');
const router = express.Router();
const StockMovementController = require('../controllers/stockMovementController');

router.post('/', StockMovementController.createStockMovement);
router.get('/', StockMovementController.getAllStockMovements);
router.get('/product/:productId', StockMovementController.getStockMovementsByProduct);

module.exports = router;
