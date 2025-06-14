const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, stockController.createStock);
router.get('/', verifyToken, stockController.getAllStock);
router.get('/:id', verifyToken, stockController.getStockById);
router.patch('/:id/increase', verifyToken, stockController.increaseStock);
router.patch('/:id/decrease', verifyToken, stockController.decreaseStock);
router.put('/:id', verifyToken, stockController.updateStock);
router.delete('/:id', verifyToken, stockController.deleteStock);

module.exports = router;
