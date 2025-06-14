const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const verifyToken = require('../middleware/authMiddleware');
const permit = require('../middleware/roleMiddleware');

router.get('/', verifyToken, ProductController.getAllProducts);
router.get('/:id', verifyToken, ProductController.getProductById);
router.post('/', verifyToken, permit('admin', 'manager'), ProductController.createProduct);
router.put('/:id', verifyToken,  permit('admin', 'manager'), ProductController.updateProduct);
router.delete('/:id', verifyToken,  permit('admin', 'manager'), ProductController.deleteProduct);

module.exports = router;
