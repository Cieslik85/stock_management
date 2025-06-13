const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const verifyToken = require('../middleware/authMiddleware');

// CRUD routes
router.get('/', verifyToken, CategoryController.getAll);
router.get('/:id', verifyToken, CategoryController.getById);
router.post('/', verifyToken, CategoryController.create);
router.put('/:id', verifyToken, CategoryController.update);
router.delete('/:id', verifyToken, CategoryController.remove);

module.exports = router;
