const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const verifyToken = require('../middleware/authMiddleware');
const permit = require('../middleware/roleMiddleware');

router.get('/', verifyToken, OrderController.getAllOrders);
router.get('/:id', verifyToken, OrderController.getOrderById);
router.post('/', verifyToken, permit('admin', 'manager', 'user'), OrderController.createOrder);
router.put('/:id', verifyToken, permit('admin', 'manager', 'user'), OrderController.updateOrderStatus);
router.delete('/:id', verifyToken,  permit('admin', 'manager'), OrderController.deleteOrder);

module.exports = router;