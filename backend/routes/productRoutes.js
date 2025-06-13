const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, ProductController.createProduct);
router.get('/', verifyToken, ProductController.getAllProducts);
router.get('/:id', verifyToken, ProductController.getProductById);
router.put('/:id', verifyToken, ProductController.updateProduct);
router.delete('/:id', verifyToken, ProductController.deleteProduct);

module.exports = router;
