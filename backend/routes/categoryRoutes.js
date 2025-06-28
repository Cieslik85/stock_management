const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const verifyToken = require('../middleware/authMiddleware');
const permit = require('../middleware/roleMiddleware');

// CRUD routes
router.get('/', verifyToken, CategoryController.getAll);
router.get('/:id', verifyToken, CategoryController.getById);
router.post('/', verifyToken, permit('admin', 'manager'), CategoryController.create);
router.put('/:id', verifyToken, permit('admin', 'manager'), CategoryController.update);
router.delete('/:id', verifyToken, permit('admin', 'manager'), CategoryController.remove);


module.exports = router;
