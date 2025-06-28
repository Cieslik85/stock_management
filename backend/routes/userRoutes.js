const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');
const permit = require('../middleware/roleMiddleware');

// Basic user management (admin only for some functions)
router.get('/', verifyToken, UserController.getAll);
router.get('/:id', verifyToken, UserController.getById);
router.delete('/:id', verifyToken, permit('admin'), UserController.deleteUser);
router.patch('/:id/role', verifyToken, permit('admin'), UserController.updateRole);
router.patch('/:id', verifyToken, permit('admin'), UserController.update);
router.post('/', verifyToken, permit('admin'), UserController.createUser);

module.exports = router;
