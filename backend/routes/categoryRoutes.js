const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const verifyToken = require('../middleware/authMiddleware');
const permit = require('../middleware/roleMiddleware');

// CRUD routes
router.get('/', verifyToken, CategoryController.getAll);
router.get('/:id', verifyToken, CategoryController.getById);
router.post('/', permit('admin', 'manager'), verifyToken, CategoryController.create);
router.put('/:id', permit('admin', 'manager'), verifyToken, CategoryController.update);
router.delete('/:id', permit('admin', 'manager'), verifyToken, CategoryController.remove);

module.exports = router;
